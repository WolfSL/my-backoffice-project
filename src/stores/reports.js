import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useReportsStore = defineStore('reports', {
  state: () => ({
    itemWiseSales: [],
    isLoading: false,
    error: null,
    lastAiQuery: '',

    salesSummaryWithPayment: [],
    isLoadingSalesSummary: false,
    errorSalesSummary: null,

    invoiceDetailReport: [],
    isLoadingInvoiceDetail: false,
    errorInvoiceDetail: null,

    // MODIFIED: Added state for AI functionality
    isAiLoading: false,
    aiResponse: '',

    incentiveReport: [],
    isLoadingIncentive: false,
    errorIncentive: null,

    dailySalesReport: [],
    isLoadingDailySales: false,
    errorDailySales: null,

    cancellationVoidReport: [],
    isLoadingCancellationVoid: false,
    errorCancellationVoid: null,
  }),
  actions: {
    async fetchItemWiseSales(dateFrom, dateTo, locations) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getItemWiseSales(dateFrom, dateTo, locations);
        this.itemWiseSales = response.data;
      } catch (err) {
        this.error = 'Failed to fetch item wise sales report.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDailySales(dateFrom, dateTo, locations) {
      this.isLoadingDailySales = true;
      this.errorDailySales = null;
      try {
        const response = await apiService.getDailySales(dateFrom, dateTo, locations);
        // MODIFIED: Ensure the response is always an array
        this.dailySalesReport = Array.isArray(response.data) ? response.data : [];
      } catch (err) {
        this.errorDailySales = 'Failed to fetch daily sales report.';
        this.dailySalesReport = []; // Also ensure it's an array on error
        console.error(err);
      } finally {
        this.isLoadingDailySales = false;
      }
    },
    async fetchSalesSummaryWithPayment(dateFrom, dateTo, locations) {
      this.isLoadingSalesSummary = true;
      this.errorSalesSummary = null;
      try {
        const response = await apiService.getSalesSummaryWithPayment(dateFrom, dateTo, locations);
        this.salesSummaryWithPayment = response.data;
      } catch (err) {
        this.errorSalesSummary = 'Failed to fetch sales summary.';
        console.error(err);
      } finally {
        this.isLoadingSalesSummary = false;
      }
    },
    async fetchInvoiceDetailReport(dateFrom, dateTo, locations) {
      this.isLoadingInvoiceDetail = true;
      this.errorInvoiceDetail = null;
      try {
        const response = await apiService.getInvDetailReport(dateFrom, dateTo, locations);
        this.invoiceDetailReport = response.data;
      } catch (err) {
        this.errorInvoiceDetail = 'Failed to fetch invoice detail report.';
        console.error(err);
      } finally {
        this.isLoadingInvoiceDetail = false;
      }
    },
    async fetchIncentiveReport(dateFrom, dateTo, locations) {
      this.isLoadingIncentive = true;
      this.errorIncentive = null;
      try {
        const response = await apiService.getIncentiveReport(dateFrom, dateTo, locations);
        this.incentiveReport = response.data;
      } catch (err) {
        this.errorIncentive = 'Failed to fetch incentive report.';
        console.error(err);
      } finally {
        this.isLoadingIncentive = false;
      }
    },
    async fetchVoidCancelReport(dateFrom, dateTo, locations) {
      this.isLoadingCancellationVoid = true;
      this.errorCancellationVoid = null;
      try {
        const response = await apiService.getVoidCancelReport(dateFrom, dateTo, locations);
        this.cancellationVoidReport = response.data || [];
      } catch (err) {
        this.errorCancellationVoid = 'Failed to fetch cancellation & void report.';
        console.error(err);
      } finally {
        this.isLoadingCancellationVoid = false;
      }
    },
    // MODIFIED: Added action to ask AI about invoice data
    async askAiAboutInvoiceData(reportData, question) {
      this.isAiLoading = true;
      this.aiResponse = '';
      this.lastAiQuery = question;
      try {
        const simplifiedData = reportData.map(inv => ({
          invoice_no: inv.INV_NO,
          date: inv.INV_DATE,
          loc: inv.INV_LOCATION,
          net: inv.INV_AMOUNT,
          gross: inv.INV_GROSS,
          discount: inv.INV_DISVAL,
          is_cancelled: inv.ISCANCEL,
        }));

        const prompt = `
            Based on the following JSON data summary of invoices, please answer the user's question.
            Provide a concise, clear answer. Please provide the answer in HTML format.

            Data: ${JSON.stringify(simplifiedData, null, 2)}

            User's Question: "${question}"
        `;

        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyBC1LfmyyIcr2gvBfuQlv_fKD2Nwo6i0qU"
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
          let rawResponse = result.candidates[0].content.parts[0].text;
          // Clean the response by removing markdown code fences
          this.aiResponse = rawResponse.replace(/```html|```/g, '').trim();
        } else {
          throw new Error('Invalid AI response structure.');
        }

      } catch (error) {
        console.error("AI request failed:", error);
        this.aiResponse = "<p class='text-red-500'>Sorry, I couldn't process that request. Please try again.</p>";
      } finally {
        this.isAiLoading = false;
      }
    }
  },
});
