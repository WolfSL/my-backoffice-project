<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Daily Sales Report</h1>
        <div class="flex items-center space-x-2">
          <button @click="exportToExcel" title="Export to Excel" class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          <button @click="printReport" title="Print Report" class="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
          <input v-model="dateFrom" type="date" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="dateTo" type="date" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <button @click="isLocationModalOpen = true" class="w-full text-left px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
            {{ selectedLocations.length }} location(s) selected
          </button>
          <button @click="generateReport" class="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate</button>
        </div>

        <div v-if="reportsStore.isLoadingDailySales" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.errorDailySales" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.errorDailySales }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th v-for="header in headers" :key="header.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div class="flex items-center">
                    <span>{{ header.label }}</span>
                    <button @click="sortBy(header.key)" class="ml-1">
                      <svg v-if="sortKey === header.key && sortOrder === 'asc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                      <svg v-else-if="sortKey === header.key && sortOrder === 'desc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                      <svg v-else class="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="(item, index) in sortedReport" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.Location }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ new Date(item.Date).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.Code }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.ItemDescription }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ item.Qty }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ formatCurrency(item.ItemRate) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ formatCurrency(item.Amount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.SubDepartment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div v-if="isLocationModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
        <div class="p-5 border-b dark:border-slate-700">
          <h2 class="text-xl font-bold">Select Locations</h2>
          <input v-model="locationSearchText" type="text" placeholder="Search..." class="w-full mt-2 p-2 border rounded">
        </div>
        <div class="p-4 overflow-y-auto">
          <ul>
            <li v-for="loc in filteredLocations" :key="loc.locCode" class="py-2 border-b">
              <label class="flex items-center">
                <input type="checkbox" :value="loc.locCode" v-model="selectedLocations" class="h-4 w-4">
                <span class="ml-3">{{ loc.locName }}</span>
              </label>
            </li>
          </ul>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t text-right">
          <button @click="isLocationModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useReportsStore } from '@/stores/reports';
import { useMastersStore } from '@/stores/masters';

const reportsStore = useReportsStore();
const mastersStore = useMastersStore();

const dateFrom = ref(new Date().toISOString().split('T')[0]);
const dateTo = ref(new Date().toISOString().split('T')[0]);
const isLocationModalOpen = ref(false);
const locationSearchText = ref('');
const selectedLocations = ref([]);

const sortKey = ref('Date');
const sortOrder = ref('asc');

const headers = [
    { key: 'Location', label: 'Location' },
    { key: 'Date', label: 'Date' },
    { key: 'Code', label: 'Item Code' },
    { key: 'ItemDescription', label: 'Description' },
    { key: 'Qty', label: 'Qty' },
    { key: 'ItemRate', label: 'Rate' },
    { key: 'Amount', label: 'Amount' },
    { key: 'SubDepartment', label: 'Sub-Department' },
];

const generateReport = () => {
  const locations = selectedLocations.value.join(',');
  reportsStore.fetchDailySales(dateFrom.value, dateTo.value, locations);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

const filteredLocations = computed(() => {
    return mastersStore.locations.filter(loc => 
        loc.locName.toLowerCase().includes(locationSearchText.value.toLowerCase())
    );
});

const sortedReport = computed(() => {
    return [...reportsStore.dailySalesReport].sort((a, b) => {
        let valA = a[sortKey.value];
        let valB = b[sortKey.value];
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
    });
});

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const printReport = () => {
    // PDF generation logic here
};

const exportToExcel = () => {
    // Excel export logic here
};

onMounted(() => {
    mastersStore.fetchLocations();
});
</script>
