import { defineStore } from 'pinia';
import apiService from '@/services/apiService';
import { useAuthStore } from '@/stores/auth';
import { useMastersStore } from '@/stores/masters';


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
                    po.emailSent = po.glTransfer;
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
            } catch (err) {
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
            const mastersStore = useMastersStore();

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

            const selectedLocation = mastersStore.locations.find(l => l.locCode === po.discode);
            formData.append('msg', `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 15px; color: #333; line-height: 1.6;">
    <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #fafafa;">
      <p style="margin-bottom: 15px;">Dear ${supplier.supName || 'Supplier'},</p>

      <p style="margin-bottom: 15px;">
        Please find attached <strong style="color: #007acc;">Purchase Order #${po.grnNo}</strong> from
        <strong>${selectedLocation?.comname}</strong>.
      </p>

      <table style="width: 100%; margin-bottom: 15px; font-size: 14px;">
        <tr>
          <td style="padding: 5px 0;">PO Date:</td>
          <td>${po.grnDate}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">Expected Delivery Date:</td>
          <td>${po.dlvDate}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;">Remarks:</td>
          <td>${po.remarks || 'N/A'}</td>
        </tr>
      </table>

      <p style="margin-bottom: 15px;">
        If you have any questions, please do not hesitate to contact us.
      </p>

      <p style="margin-bottom: 40px;">Thank you,</p>

      <p style="font-weight: bold; font-size: 16px;">${authStore.companyName}</p>
    </div>
  </div>
`);




            console.log("Sending email with form data:", formData);

            try {
                await apiService.emailPurchaseOrder(formData);
                this.successMessage = `PO #${po.grnNo} has been successfully emailed to the supplier.`;
                if (this.activePO) this.activePO.emailSent = true;
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
        async updateSupplierAgent(loc, sup, agentName, agentEmail, refCode) {
            this.clearMessages();
            try {
                await apiService.updateSupAgentDetails(loc, sup, agentName, agentEmail, refCode);
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
        voidPurchaseOrder() {
            return this.updatePOStatus('V', 'Voided');
        },
    },
});
