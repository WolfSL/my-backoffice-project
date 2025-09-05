import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiService from '@/services/apiService';
import { useAuthStore } from './auth';
import { db } from '@/firebase/firebase';

export const useDashboardStore = defineStore('dashboard', () => {
  // === STATE ===
  const salesSummary = ref([]);
  const supplierSales = ref([]);
  const customerCount = ref(0);
  const cashFlowData = ref([]);
  const hourlySalesData = ref([]);
  const selectedLocations = ref([]);
  const voidCancelData = ref([]); // MODIFIED: New state for notifications
  const channelWiseSales = ref([]);

  const isSalesSummaryLoading = ref(false);
  const isSupplierSalesLoading = ref(false);
  const isCusCountLoading = ref(false);
  const isCashFlowLoading = ref(false);
  const isHourlySalesLoading = ref(false);
  const isNotificationsLoading = ref(false); // MODIFIED: New loading state

  const error = ref(null);

  const widgetConfig = ref([
    { id: 'salesSummary', visible: true, name: 'Sales Summary' },
    { id: 'supplierSales', visible: true, name: 'Supplier Sales' },
    { id: 'channelSales', visible: true, name: 'Channel Sales' },
    { id: 'hourlySales', visible: true, name: 'Hourly Sales' },
    { id: 'cashFlow', visible: true, name: 'Cash Flow' },
  ]);

  const xReportData = ref([]);
  const isXReportLoading = ref(false);
  const isXReportModalOpen = ref(false);
  const isChannelWiseSalesLoading = ref(false);

  const aiForecast = ref('');
  const isForecastLoading = ref(false);
  const supplierAnalysis = ref('');
  const isSupplierAnalysisLoading = ref(false);
  const hourlyAnalysis = ref('');
  const isHourlyAnalysisLoading = ref(false);

  // === GETTERS ===
  const totalSales = computed(() => {
    return salesSummary.value.reduce((total, item) => total + item.amt, 0);
  });
  

  // MODIFIED: New getter to count total notifications
  const notificationCount = computed(() => voidCancelData.value.length);

  // === ACTIONS ===

  async function fetchSalesSummary(dateFrom, dateTo) {
    isSalesSummaryLoading.value = true;
    try {
      const response = await apiService.getLiveSalesAll(dateFrom, dateTo);
      salesSummary.value = response.data;
    } catch (err) { error.value = 'Failed to load Sales Summary.'; console.error(err); }
    finally { isSalesSummaryLoading.value = false; }
  }

  async function fetchSupplierSales(dateFrom, dateTo) {
    isSupplierSalesLoading.value = true;
    try {
      const locations = selectedLocations.value.length === 0 ? 'X' : selectedLocations.value.join(',');
      const response = await apiService.getSuppSalesAll(dateFrom, dateTo, locations);
      supplierSales.value = response.data;
    } catch (err) { error.value = 'Failed to load Supplier Sales.'; console.error(err); }
    finally { isSupplierSalesLoading.value = false; }
  }

  async function fetchCusCount(dateFrom, dateTo) {
    isCusCountLoading.value = true;
    try {
      const locCode = selectedLocations.value.length === 0 ? 'X' : selectedLocations.value.map(code => `'${code}'`).join(',');
      const response = await apiService.getCusCount(dateFrom, dateTo, locCode);
      customerCount.value = response.data?.[0]?.cc || 0;
    } catch (err) { error.value = 'Failed to load Customer Count.'; console.error(err); }
    finally { isCusCountLoading.value = false; }
  }

  async function fetchHourlySales(dateFrom, dateTo) {
    isHourlySalesLoading.value = true;
    try {
      const locations = selectedLocations.value.length === 0 ? 'X' : selectedLocations.value.join(',');
      const response = await apiService.getHourlySales(dateFrom, dateTo, locations);
      hourlySalesData.value = response.data;
    } catch (err) { error.value = 'Failed to load Hourly Sales.'; console.error(err); }
    finally { isHourlySalesLoading.value = false; }
  }

  async function fetchCashFlow(dateFrom, dateTo) {
    isCashFlowLoading.value = true;
    try {
      const locations = selectedLocations.value.length === 0 ? 'X' : selectedLocations.value.join(',');
      const response = await apiService.getCashFlow(dateFrom, dateTo, locations);
      cashFlowData.value = response.data;
    } catch (err) { error.value = 'Failed to load Cash Flow.'; console.error(err); }
    finally { isCashFlowLoading.value = false; }
  }

  // MODIFIED: New action for notifications
  async function fetchVoidCancel(dateFrom, dateTo) {
    isNotificationsLoading.value = true;
    try {
      const locCode = selectedLocations.value.length === 0 ? 'X' : selectedLocations.value.join(',');
      const response = await apiService.getVoidCancel(dateFrom, dateTo, locCode);
      voidCancelData.value = response.data;
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      isNotificationsLoading.value = false;
    }
  }

  async function _callGeminiAPI(prompt) {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) { return result.candidates[0].content.parts[0].text; }
    else { throw new Error("No content returned from AI."); }
  }

  async function generateSalesForecast() {
    if (cashFlowData.value.length === 0) return "Not enough data.";
    isForecastLoading.value = true;
    try {
      const salesData = cashFlowData.value.map(d => ({ period: d.day || d.month, sales: d.flow }));
      const prompt = `Based on the following sales data for a business in Sri Lanka, provide a brief, one-paragraph sales forecast for the next period. Mention potential trends and be optimistic but realistic. consider holiday and seasons in sri lanka. Data: ${JSON.stringify(salesData)}`;
      aiForecast.value = await _callGeminiAPI(prompt);
    } catch (error) { console.error("AI Forecast error:", error); aiForecast.value = "Sorry, the forecast could not be generated."; }
    finally { isForecastLoading.value = false; }
  }

  async function generateSupplierAnalysis() {
    if (supplierSales.value.length === 0) return "Not enough data.";
    isSupplierAnalysisLoading.value = true;
    try {
      const prompt = `Analyze the following supplier sales data. Identify the top 2-3 performers and point out any potential risks, like over-reliance on one supplier or a supplier with very low sales. Be concise. Data: ${JSON.stringify(supplierSales.value)}`;
      supplierAnalysis.value = await _callGeminiAPI(prompt);
    } catch (error) { console.error("AI Supplier Analysis error:", error); supplierAnalysis.value = "Sorry, the analysis could not be generated."; }
    finally { isSupplierAnalysisLoading.value = false; }
  }

  async function generateHourlyAnalysis() {
    if (hourlySalesData.value.length === 0) return "Not enough data.";
    isHourlyAnalysisLoading.value = true;
    try {
      const prompt = `Analyze the following hourly sales data which lists sales by day and hour. Identify the peak business hours and the quietest periods. Provide a one-paragraph summary with a suggestion for staffing. Data: ${JSON.stringify(hourlySalesData.value)}`;
      hourlyAnalysis.value = await _callGeminiAPI(prompt);
    } catch (error) { console.error("AI Hourly Analysis error:", error); hourlyAnalysis.value = "Sorry, the analysis could not be generated."; }
    finally { isHourlyAnalysisLoading.value = false; }
  }

  async function fetchChannelWiseSales(dateFrom, dateTo) {
    isChannelWiseSalesLoading.value = true;
    try {
      const response = await apiService.getChannelWiseSales(dateFrom, dateTo);
      channelWiseSales.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch channel wise sales.';
      console.error(err);
    } finally {
      isChannelWiseSalesLoading.value = false;
    }
  }

  function toggleLocationSelection(locationCode) {
    const index = selectedLocations.value.indexOf(locationCode);
    if (index === -1) { selectedLocations.value.push(locationCode); }
    else { selectedLocations.value.splice(index, 1); }
  }

  async function fetchXReport(dateFrom, dateTo, locCode) {
    isXReportModalOpen.value = true;
    isXReportLoading.value = true;
    xReportData.value = [];
    try {
      const response = await apiService.getXreport(dateFrom, dateTo, locCode);
      xReportData.value = response.data;
    } catch (err) { console.error('Failed to fetch X-Report:', err); }
    finally { isXReportLoading.value = false; }
  }

  async function fetchWidgetConfig() {
    const authStore = useAuthStore();
    if (!authStore.firebaseUser) return;
    const companyId = authStore.companyName || 'default-company';
    const docRef = db.collection('companies').doc(companyId).collection('users').doc(authStore.firebaseUser.uid);
    const doc = await docRef.get();
    if (doc.exists && doc.data().widgetConfig) {
      widgetConfig.value = doc.data().widgetConfig;
    }
  }
  async function saveWidgetConfig() {
    const authStore = useAuthStore();
    if (!authStore.firebaseUser) return;
    const companyId = authStore.companyName || 'default-company';
    const docRef = db.collection('companies').doc(companyId).collection('users').doc(authStore.firebaseUser.uid);
    await docRef.set({ widgetConfig: widgetConfig.value }, { merge: true });
  }

  function closeXReportModal() { isXReportModalOpen.value = false; }
  return {
    salesSummary, supplierSales, customerCount, cashFlowData, hourlySalesData, voidCancelData, channelWiseSales, widgetConfig,
    isSalesSummaryLoading, isSupplierSalesLoading, isCusCountLoading, isCashFlowLoading, isHourlySalesLoading, isNotificationsLoading, isChannelWiseSalesLoading,
    error, totalSales, selectedLocations, xReportData, isXReportLoading, isXReportModalOpen,
    aiForecast, isForecastLoading, supplierAnalysis, isSupplierAnalysisLoading, hourlyAnalysis, isHourlyAnalysisLoading,
    notificationCount,
    fetchSalesSummary, fetchSupplierSales, fetchCusCount, fetchHourlySales,
    fetchCashFlow, fetchVoidCancel,
    generateSalesForecast, generateSupplierAnalysis, generateHourlyAnalysis,
    toggleLocationSelection, fetchXReport, closeXReportModal,
    fetchChannelWiseSales, fetchWidgetConfig, saveWidgetConfig
  };

});
