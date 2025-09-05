import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useStockStore = defineStore('stock', {
  state: () => ({
    stockTakeList: [],
    initializationStatus: null,
    searchedItems: [],
    // MODIFIED: Added state for variance report
    stockVarianceReport: [],
    isLoading: false,
    isUploading: false,
    error: null,
  }),
  actions: {
    async initializeStock(locationCode) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.initStock(locationCode);
        this.initializationStatus = response.data[0];
      } catch (err) {
        this.error = 'Failed to initialize stock.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchStockTake(locationCode, date) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getStockTake(locationCode, date);
        this.stockTakeList = response.data;
      } catch (err) {
        this.error = 'Failed to fetch stock take data.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async searchItems(discode, filter) {
        try {
            const response = await apiService.searchItemsForStockTake(discode, filter);
            this.searchedItems = response.data;
        } catch (err) {
            console.error('Failed to search items:', err);
        }
    },
    async getItemByBarcode(barcode, locCode) {
        try {
            const response = await apiService.getItemByBarcodeForStockTake(barcode, locCode);
            return response.data[0] || null;
        } catch (err) {
            console.error('Failed to get item by barcode:', err);
            return null;
        }
    },
    async saveStockTake(itemcode, loc, count, date, type) {
        try {
            await apiService.saveStockTake(itemcode, loc, count, date, type);
            await this.fetchStockTake(loc, date);
        } catch (err) {
            console.error('Failed to save stock take:', err);
        }
    },
    async uploadQbStock(payload) {
      this.isUploading = true;
      try {
        await apiService.uploadQbStockJson(payload);
      } catch (err) {
        console.error('Failed to upload QB stock', err);
      } finally {
        this.isUploading = false;
      }
    },
    // MODIFIED: Added action to fetch variance report
    async fetchStockVarianceReport(loc, date) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await apiService.getStockTakeReport(loc, date, 'T');
            this.stockVarianceReport = response.data;
        } catch(err) {
            this.error = 'Failed to fetch stock variance report.';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    }
  },
});
