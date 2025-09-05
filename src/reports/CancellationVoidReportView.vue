<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Cancellation & Void Report</h1>
        <div class="flex items-center space-x-2">
           <button @click="isOptionsModalOpen = true" class="w-10 h-10 flex items-center justify-center bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors" title="Options">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
          </button>
          <button @click="exportToExcel" class="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" title="Export to Excel">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
          </button>
          <button @click="printReport" class="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" title="Print Report">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="flex items-center space-x-4 mb-4 flex-shrink-0">
            <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input v-model="dateFrom" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input v-model="dateTo" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative flex-1">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <button @click="isLocationModalOpen = true" class="w-full text-left pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                    {{ selectedLocations.length }} location(s) selected
                </button>
            </div>
            <button @click="generateReport" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 h-10">Generate</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Cancelled</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalCancel, false) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Void (with KOT)</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalVoidWithKot, false) }}</p>
            </div>
             <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center col-span-2 md:col-span-2">
                <div class="flex items-center justify-center space-x-4 text-xs">
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-red-200 dark:bg-red-800/50 border border-red-400 rounded-sm mr-2"></div>
                        <span class="text-gray-600 dark:text-gray-400">Cancelled Item</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-4 h-4 bg-green-200 dark:bg-green-800/50 border border-green-400 rounded-sm mr-2"></div>
                        <span class="text-gray-600 dark:text-gray-400">Pre-KOT Void</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="reportsStore.isLoadingCancellationVoid" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.errorCancellationVoid" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.errorCancellationVoid }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="w-12 px-4 py-2"></th>
                <th v-for="header in headers" :key="header.key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" :class="header.align === 'right' ? 'text-right' : ''">
                  <div class="flex items-center" :class="header.align === 'right' ? 'justify-end' : ''">
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
              <template v-for="item in filteredAndSortedReport" :key="item.InvoiceNo + item.ItemCode + item.InvoiceTime">
                <tr :class="rowClass(item)" class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td class="px-4 py-2">
                         <button @click="toggleRow(item.InvoiceNo + item.ItemCode)" class="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="{'rotate-90': expandedRows.includes(item.InvoiceNo + item.ItemCode)}" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </td>
                    <td v-for="header in headers" :key="`cell-${item.InvoiceNo}-${header.key}`" class="px-4 py-2 whitespace-nowrap text-xs text-gray-800 dark:text-gray-300" :class="header.align === 'right' ? 'text-right' : ''">
                      {{ formatCell(item, header.key) }}
                    </td>
                </tr>
                 <tr v-if="expandedRows.includes(item.InvoiceNo + item.ItemCode)">
                    <td :colspan="headers.length + 1" class="p-4 bg-gray-100 dark:bg-slate-900">
                        <div class="grid grid-cols-3 gap-4 text-xs">
                            <div><strong>KOT Number:</strong> {{ item.KotNumber }}</div>
                            <div><strong>Void KOT Number:</strong> {{ item.VoidKotNumber }}</div>
                            <div><strong>KOT Time:</strong> {{ item.KotTime ? new Date(item.KotTime).toLocaleTimeString() : 'N/A' }}</div>
                        </div>
                    </td>
                </tr>
              </template>
              <tr v-if="filteredAndSortedReport.length === 0">
                <td :colspan="headers.length + 1" class="text-center py-10 text-gray-500 dark:text-gray-400">No data to display. Please generate a report.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <!-- Location Selector Modal -->
  <div v-if="isLocationModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
          <div class="p-5 border-b dark:border-slate-700">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Locations</h2>
              <input v-model="locationSearchText" type="text" placeholder="Search locations..." class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div class="p-6 overflow-y-auto">
              <ul>
                  <li v-for="loc in filteredLocations" :key="loc.locCode" class="py-2 border-b dark:border-slate-700">
                      <label class="flex items-center">
                          <input type="checkbox" :value="loc.locCode" v-model="selectedLocations" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                          <div class="ml-3">
                              <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ loc.locName }}</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">{{ loc.master }}</p>
                          </div>
                      </label>
                  </li>
              </ul>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
              <button @click="isLocationModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
          </div>
      </div>
  </div>

   <!-- Options Modal -->
  <div v-if="isOptionsModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Report Options</h2>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Filter by Type</h3>
            <div class="flex space-x-4">
                <label class="flex items-center">
                    <input type="radio" v-model="reportOptions.filterType" value="all" class="h-4 w-4 text-indigo-600 border-gray-300">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">All</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" v-model="reportOptions.filterType" value="cancel" class="h-4 w-4 text-indigo-600 border-gray-300">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Cancellations Only</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" v-model="reportOptions.filterType" value="void" class="h-4 w-4 text-indigo-600 border-gray-300">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Voids Only</span>
                </label>
            </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isOptionsModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useReportsStore } from '@/stores/reports';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';

const reportsStore = useReportsStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();

const dateFrom = ref(new Date().toISOString().split('T')[0]);
const dateTo = ref(new Date().toISOString().split('T')[0]);
const isLocationModalOpen = ref(false);
const locationSearchText = ref('');
const selectedLocations = ref([]);
const sortKey = ref('InvoiceDate');
const sortOrder = ref('desc');
const expandedRows = ref([]);
const isOptionsModalOpen = ref(false);

const reportOptions = ref({
    filterType: 'all', // 'all', 'cancel', 'void'
});

const headers = [
    { key: 'TransactionType', label: 'Type' },
    { key: 'Location', label: 'Location' },
    { key: 'InvoiceNo', label: 'Invoice No' },
    { key: 'InvoiceDate', label: 'Date' },
    { key: 'InvoiceTime', label: 'Time' },
    { key: 'ItemDescription', label: 'Item' },
    { key: 'Quantity', label: 'Qty', align: 'right' },
    { key: 'Amount', label: 'Amount', align: 'right' },
    { key: 'Cashier', label: 'Cashier' },
    { key: 'Steward', label: 'Steward' },
];

const generateReport = () => {
  const locations = selectedLocations.value.length > 0 ? selectedLocations.value.map(code => `'${code}'`).join(',') : "'X'";
  reportsStore.fetchVoidCancelReport(dateFrom.value, dateTo.value, locations);
  expandedRows.value = [];
};

const formatCurrency = (value, withSymbol = true) => {
  if (typeof value !== 'number') return 'N/A';
  const options = withSymbol
    ? { style: 'currency', currency: 'LKR' }
    : { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-LK', options).format(value);
};

const filteredLocations = computed(() => {
    if (!locationSearchText.value) return mastersStore.locations;
    return mastersStore.locations.filter(loc =>
        loc.locName.toLowerCase().includes(locationSearchText.value.toLowerCase()) ||
        loc.master.toLowerCase().includes(locationSearchText.value.toLowerCase())
    );
});

const filteredAndSortedReport = computed(() => {
  let data = [...reportsStore.cancellationVoidReport];
  
  if(reportOptions.value.filterType === 'cancel') {
      data = data.filter(item => item.TransactionType === 'Canceled Item');
  } else if (reportOptions.value.filterType === 'void') {
      data = data.filter(item => item.TransactionType !== 'Canceled Item');
  }

  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const totalCancel = computed(() => {
    return filteredAndSortedReport.value
        .filter(item => item.TransactionType === 'Canceled Item')
        .reduce((sum, item) => sum + item.Amount, 0);
});

const totalVoidWithKot = computed(() => {
    return filteredAndSortedReport.value
        .filter(item => item.TransactionType !== 'Canceled Item' && item.KotNumber > 0)
        .reduce((sum, item) => sum + item.Amount, 0);
});

const rowClass = (item) => {
    if (item.TransactionType === 'Canceled Item') {
        return 'bg-red-100 dark:bg-red-800/50';
    }
    if (item.KotNumber === 0) {
        return 'bg-green-100 dark:bg-green-800/50';
    }
    return '';
};

const formatCell = (item, key) => {
    const value = item[key];
    switch(key) {
        case 'InvoiceDate': return new Date(value).toLocaleDateString();
        case 'InvoiceTime': return new Date(value).toLocaleTimeString();
        case 'Amount': return formatCurrency(value, false);
        default: return value;
    }
};

const toggleRow = (id) => {
    const index = expandedRows.value.indexOf(id);
    if (index > -1) {
        expandedRows.value.splice(index, 1);
    } else {
        expandedRows.value.push(id);
    }
};

const printReport = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text(`Cancellation & Void Report (${dateFrom.value} to ${dateTo.value})`, 14, 15);
    doc.autoTable({
        head: [headers.map(h => h.label)],
        body: filteredAndSortedReport.value.map(item => headers.map(h => formatCell(item, h.key))),
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 7 }
    });
    doc.save(`Cancellation_Void_Report_${dateFrom.value}_${dateTo.value}.pdf`);
};

const exportToExcel = () => {
    const data = filteredAndSortedReport.value.map(item => {
        const row = {};
        headers.forEach(h => row[h.label] = formatCell(item, h.key));
        return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cancellations and Voids');
    XLSX.writeFile(workbook, `Cancellation_Void_Report_${dateFrom.value}_${dateTo.value}.xlsx`);
};

onMounted(() => {
  mastersStore.fetchLocations();
});
</script>