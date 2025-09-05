import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useGrnStore = defineStore('grn', {
  state: () => ({
    grnList: [],
    activeGRN: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
    operationError: null,
  }),
  actions: {
    async fetchGrnList() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getGrnList();
        this.grnList = response.data;
      } catch (err) {
        this.error = 'Failed to fetch GRN list.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async initializeGRN(tNo, loc) {
      this.activeGRN = null;
      this.isLoading = true;
      if (tNo && loc) {
        try {
          const response = await apiService.getGrnById(tNo, loc);
          this.activeGRN = response.data;
        } catch (err) {
          this.error = 'Failed to load GRN details.';
        }
      } else {
        this.activeGRN = {
          TNo: 0,
          Loc: '',
          TDate: new Date().toISOString().split('T')[0],
          SupCode: '',
          InNo: '',
          InDate: new Date().toISOString().split('T')[0],
          Notes: '',
          Details: [],
        };
      }
      this.isLoading = false;
    },
    async saveGRN() {
      this.isSubmitting = true;
      try {
        const response = await apiService.saveGrn(this.activeGRN);
        this.successMessage = 'GRN saved successfully.';
        return response.data.tNo;
      } catch (err) {
        this.operationError = 'Failed to save GRN.';
        return null;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
});
