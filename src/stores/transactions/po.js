import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';

export const usePoStore = defineStore('po', {
  state: () => ({
    purchaseOrders: [],
    activePO: null,
    supplierDetails: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
    operationError: null,
  }),
  actions: {
    clearMessages() {
      this.successMessage = null;
      this.operationError = null;
    },
    async fetchPurchaseOrders(type, role, dis, q3, q4) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getMin(type, role, dis, q3, q4);
        this.purchaseOrders = response.data.map(po => ({
          ...po,
          uniqueId: `${po.PONo}-${po.location}`
        }));
      } catch (err) {
        this.error = 'Failed to fetch purchase orders.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    // MODIFIED: Corrected date formatting to prevent timezone shifts
    async initializePO(poNo, disCode, docType) {
      this.clearActivePO();
      this.isLoading = true;
      const formatToYyyyMmDd = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return new Date().toISOString().substring(0, 10);
        // Directly slice the string to avoid timezone conversion issues
        return dateString.substring(0, 10);
      };

      if (poNo && disCode && docType) {
        try {
          const response = await apiService.getEtdx(poNo, disCode, docType);
          const po = response.data;
          po.grnDate = formatToYyyyMmDd(po.grnDate);
          po.dlvDate = formatToYyyyMmDd(po.dlvDate);
          this.activePO = po;
        } catch (err) {
          this.error = `Failed to load PO #${poNo}.`;
          console.error(err);
        }
      } else {
        const authStore = useAuthStore();
        this.activePO = {
          grnNo: '',
          discode: authStore.user?.LocationCode || '',
          doc_Type: 2,
          grnDate: formatToYyyyMmDd(new Date().toISOString()),
          dlvDate: formatToYyyyMmDd(new Date().toISOString()),
          supCode: '',
          poPeriod: 7,
          status: 'D',
          createUser: authStore.user?.Username || 'admin',
          grnPrnDets: [],
          remarks: '',
        };
      }
      this.isLoading = false;
    },
    async fetchSupplierDetails(loc, sup) {
      try {
        const response = await apiService.getSupDetails(loc, sup);
        this.supplierDetails = response.data[0] || null;
      } catch (err) {
        console.error('Failed to fetch supplier details:', err);
        this.supplierDetails = null;
      }
    },
    addItemToPO(item) {
      if (!this.activePO) return;
      const existingItem = this.activePO.grnPrnDets.find(i => i.itemCode === item.ItemCode);
      if (existingItem) {
        this.operationError = 'Item already exists in this PO.';
        setTimeout(() => this.clearMessages(), 3000);
        return;
      }
      const newItem = {
        itemCode: item.ItemCode,
        itemDes: item.ItemDescription,
        itQty: 0,
        unitPrice: item.cost,
        amount: 0,
        locCode: item.Unitpack,
        sih: item.SIH,
        avgDay: item.Avgday,
        bufdays: item.Bufdays,
        lpd: item.LPD,
        lpq: item.LPQ,
        serial: Date.now()
      };
      this.activePO.grnPrnDets.push(newItem);
    },
    removeItemFromPO(itemCode) {
      if (!this.activePO) return;
      this.activePO.grnPrnDets = this.activePO.grnPrnDets.filter(item => item.itemCode !== itemCode);
    },
    async savePurchaseOrder(isAutoCreate, isEditing) {
      this.clearMessages();
      this.isSubmitting = true;
      const authStore = useAuthStore();
      const payload = { ...this.activePO };

      try {
        if (!isEditing) {
          const response = await apiService.reservePoNumber(authStore.user.Username, payload.discode, 2);
          payload.grnNo = response.data.toString();
        }

        payload.status = 'D';
        payload.doc_Type = 2;
        payload.createUser = authStore.user.Username;
        payload.updateuser = "";
        payload.processedUser = "";
        payload.pono = payload.grnNo;
        payload.locCode = payload.discode;
        payload.remarks = payload.remarks || '';
        payload.supInvNo = payload.supInvNo || 'N/A';
        payload.createdate = new Date().toISOString();
        payload.updatedate = new Date().toISOString();
        payload.processedDate = new Date().toISOString();


        await apiService.savePO(payload, authStore.user.Username);
        await this.initializePO(payload.grnNo, payload.discode, 2);
        this.activePO.grnNo = payload.grnNo;
        this.successMessage = `Purchase Order #${payload.grnNo} saved successfully.`;
      } catch (err) {
        this.operationError = `Failed to save PO. ${err.response?.data?.title || err.message}`;
        console.error(err);
      } finally {
        this.isSubmitting = false;
        setTimeout(() => this.clearMessages(), 3000);
      }
    },
    async updatePOStatus(newStatus, actionVerb) {
        this.clearMessages();
        this.isSubmitting = true;
        const authStore = useAuthStore();
        const payload = { ...this.activePO };
        
        payload.status = newStatus;
        if (newStatus === 'A') {
            payload.updateuser = authStore.user.Username;
            payload.updatedate = new Date().toISOString();
        } else if (newStatus === 'P') {
            payload.processedUser = authStore.user.Username;
            payload.processedDate = new Date().toISOString();
        }
        
        try {
            await apiService.savePO(payload, authStore.user.Username);
            this.activePO.status = newStatus;
            await this.initializePO(payload.grnNo, payload.discode, 2);
            this.successMessage = `PO #${payload.grnNo} has been ${actionVerb}.`;
        } catch(err) {
            this.operationError = `Failed to ${actionVerb.toLowerCase()} PO. ${err.response?.data?.title || err.message}`;
            console.error(err);
        } finally {
            this.isSubmitting = false;
            setTimeout(() => this.clearMessages(), 3000);
        }
    },
    async emailPurchaseOrder(pdfBlob) {
      this.clearMessages();
      this.isSubmitting = true;
      const authStore = useAuthStore();
      const po = this.activePO;
      const supplier = this.supplierDetails;


      if (!supplier || !supplier.supAgentMail) {
        this.operationError = "Supplier details or email address is not available.";
        this.isSubmitting = false;
        setTimeout(() => this.clearMessages(), 3000);
        return;
      }
      const formData = new FormData();
      formData.append('file', pdfBlob, `PO_${po.grnNo}.pdf`);
      formData.append('subject', `Purchase Order from ${authStore.companyName} - #${po.grnNo}`);
      formData.append('toEmail', supplier.supAgentMail);
      formData.append('ccEmail', 'x');
      formData.append('pono', po.grnNo);
      formData.append('location', po.discode);

      // MODIFIED: Converted the message to a single line to prevent parsing issues
      const emailMessage = `<p>Dear ${supplier.supAgentMail || 'Supplier'},</p><p>Please find attached Purchase Order #${po.grnNo} from ${authStore.companyName}.</p><p>PO Date: ${po.grnDate}<br>Expected Delivery Date: ${po.dlvDate}</p><p>If you have any questions, please do not hesitate to contact us.</p><p>Thank you,</p><p><strong>${authStore.companyName}</strong></p>`;
      console.log("Email message content:",  this.supplierDetails?.supAgentMail, authStore.companyName, authStore.user.Username,po.discode);
      formData.append('msg', emailMessage);
      
     

      console.log("Sending email with form data:", formData);

      try {
        await apiService.emailPurchaseOrder(formData);
        this.successMessage = `PO #${po.grnNo} has been successfully emailed to the supplier.`;
      } catch (err) {
        this.operationError = 'Failed to email the Purchase Order.';
        console.error(err);
      } finally {
        this.isSubmitting = false;
        setTimeout(() => this.clearMessages(), 3000);
      }
    },
    approvePurchaseOrder() {
        return this.updatePOStatus('A', 'Approved');
    },
    processPurchaseOrder() {
        return this.updatePOStatus('P', 'Processed');
    },
    async updateSupplierAgent(loc, sup, agentName, agentEmail) {
      this.clearMessages();
      try {
        await apiService.updateSupAgentDetails(loc, sup, agentName, agentEmail);
        this.successMessage = 'Supplier agent details updated.';
      } catch (err) {
        this.operationError = 'Failed to update supplier agent.';
        console.error(err);
      } finally {
        setTimeout(() => this.clearMessages(), 3000);
      }
    },
    clearActivePO() {
      this.activePO = null;
      this.supplierDetails = null;
      this.error = null;
      this.clearMessages();
    },
  },
});
