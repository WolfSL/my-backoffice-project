import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiService from '@/services/apiService';

export const useReportsStore = defineStore('reports', () => {
  // === STATE ===
  const itemWiseSales = ref([]);
  const salesSummaryWithPayment = ref([]); // MODIFIED: New state
  const isLoading = ref(false);
  const error = ref(null);

  // === ACTIONS ===
  async function fetchItemWiseSales(dateFrom, dateTo, locations) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.getItemWiseSales(dateFrom, dateTo, locations);
      itemWiseSales.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch item wise sales data.';
      console.error(err);
      itemWiseSales.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  // MODIFIED: New action for the new report
  async function fetchSalesSummaryWithPayment(dateFrom, dateTo, locations) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiService.getSalesSummaryWithPayment(dateFrom, dateTo, locations);
      salesSummaryWithPayment.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch sales summary data.';
      console.error(err);
      salesSummaryWithPayment.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    itemWiseSales,
    salesSummaryWithPayment,
    isLoading,
    error,
    fetchItemWiseSales,
    fetchSalesSummaryWithPayment
  };
});
