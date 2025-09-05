<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Incentive Report</h1>
        <div class="flex items-center space-x-2">
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                </div>
                <input v-model="dateFrom" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                </div>
                <input v-model="dateTo" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                </div>
                <button @click="isLocationModalOpen = true" class="w-full text-left pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                    {{ selectedLocations.length }} location(s) selected
                </button>
            </div>
            <button @click="generateReport" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 h-10">Generate</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Received Qty</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalReceivedQty.toLocaleString() }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Incentive</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalIncentive, false) }}</p>
            </div>
        </div>
        
        <div v-if="reportsStore.isLoadingIncentive" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.errorIncentive" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.errorIncentive }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                 <th class="w-12 px-4 py-2">
                    <button @click="toggleAllRows" class="p-1" :title="areAllExpanded ? 'Collapse All' : 'Expand All'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path v-if="areAllExpanded" fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                          <path v-else fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                 </th>
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
               <tr class="bg-gray-100 dark:bg-slate-700/50">
                <th class="px-2 py-1"></th>
                <th v-for="header in headers" :key="`filter-${header.key}`" class="px-2 py-1">
                  <input v-if="header.filterable" v-model="filters[header.key]" type="text" class="w-full text-xs px-1 py-0.5 border-gray-200 rounded" :placeholder="`Filter...`">
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <template v-for="invoice in filteredAndSortedReport" :key="invoice.InvoiceNo">
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td class="px-4 py-2">
                        <button @click="toggleRow(invoice.InvoiceNo)" class="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="{'rotate-90': expandedRows.includes(invoice.InvoiceNo)}" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </td>
                    <td class="px-4 py-2 text-xs">{{ new Date(invoice.GRNDate).toLocaleDateString() }}</td>
                    <td class="px-4 py-2 text-xs">{{ invoice.InvoiceNo }}</td>
                    <td class="px-4 py-2 text-xs">{{ invoice.supplier }}</td>
                    <td class="px-4 py-2 text-xs text-right">{{ invoice.totalReceivedQty.toLocaleString() }}</td>
                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(invoice.totalIncentive, false) }}</td>
                </tr>
                <tr v-if="expandedRows.includes(invoice.InvoiceNo)">
                    <td :colspan="headers.length + 1" class="p-4 bg-gray-100 dark:bg-slate-900">
                        <table class="min-w-full">
                            <thead class="bg-gray-200 dark:bg-slate-800">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Item Code</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Product/Service</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Rec. Qty</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Incentive/Bottle</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Incentive</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-slate-700">
                                <tr v-for="item in invoice.items" :key="item.Itemcode">
                                    <td class="px-4 py-2 text-xs">{{ item.Itemcode }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item['Product/Service'] }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ item.ReceivedQty }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(item.IncentivePerBottle, false) }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(item.Incentive, false) }}</td>
                                </tr>
                            </tbody>
                        </table>
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
          <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Locations</h2>
              <label class="flex items-center text-sm">
                <input type="checkbox" @change="toggleSelectAllLocations" :checked="areAllLocationsSelected" class="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2">
                Select All
              </label>
          </div>
          <div class="p-6 overflow-y-auto">
              <input v-model="locationSearchText" type="text" placeholder="Search locations..." class="w-full mb-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
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
const sortKey = ref('GRNDate');
const sortOrder = ref('desc');
const filters = ref({
    InvoiceNo: '',
    supplier: '',
});
const expandedRows = ref([]);
const areAllExpanded = ref(false);

const headers = [
    { key: 'GRNDate', label: 'Date', filterable: false },
    { key: 'InvoiceNo', label: 'Invoice No', filterable: true },
    { key: 'supplier', label: 'supplier', filterable: true },
    { key: 'totalReceivedQty', label: 'Total Rec. Qty', align: 'right' },
    { key: 'totalIncentive', label: 'Total Incentive', align: 'right' },
];

const groupedReportData = computed(() => {
  if (!reportsStore.incentiveReport) return [];
  const invoices = {};
  reportsStore.incentiveReport.forEach(item => {
    if (!invoices[item.InvoiceNo]) {
      invoices[item.InvoiceNo] = {
        InvoiceNo: item.InvoiceNo,
        GRNDate: item.GRNDate,
        supplier: item.supplier,
        items: [],
        totalIncentive: 0,
        totalReceivedQty: 0
      };
    }
    invoices[item.InvoiceNo].items.push(item);
    invoices[item.InvoiceNo].totalIncentive += item.Incentive;
    invoices[item.InvoiceNo].totalReceivedQty += item.ReceivedQty;
  });
  return Object.values(invoices);
});

const generateReport = () => {
  const locations = selectedLocations.value.length > 0 ? selectedLocations.value.map(code => `'${code}'`).join(',') : "'X'";
  reportsStore.fetchIncentiveReport(dateFrom.value, dateTo.value, locations);
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

const areAllLocationsSelected = computed({
    get: () => mastersStore.locations.length > 0 && selectedLocations.value.length === mastersStore.locations.length,
    set: (value) => {
        if (value) {
            selectedLocations.value = mastersStore.locations.map(l => l.locCode);
        } else {
            selectedLocations.value = [];
        }
    }
});

const toggleSelectAllLocations = () => {
    areAllLocationsSelected.value = !areAllLocationsSelected.value;
};

const filteredAndSortedReport = computed(() => {
  let data = [...groupedReportData.value];

  data = data.filter(invoice => {
    const invoiceMatch = Object.keys(filters.value).every(key => {
        if (!filters.value[key]) return true;
        return String(invoice[key]).toLowerCase().includes(filters.value[key].toLowerCase());
    });
    return invoiceMatch;
  });

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

const totalReceivedQty = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.totalReceivedQty, 0));
const totalIncentive = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.totalIncentive, 0));

const toggleRow = (invoiceNo) => {
    const index = expandedRows.value.indexOf(invoiceNo);
    if (index > -1) {
        expandedRows.value.splice(index, 1);
    } else {
        expandedRows.value.push(invoiceNo);
    }
};

const toggleAllRows = () => {
    if (areAllExpanded.value) {
        expandedRows.value = [];
    } else {
        expandedRows.value = filteredAndSortedReport.value.map(inv => inv.InvoiceNo);
    }
    areAllExpanded.value = !areAllExpanded.value;
};

const printReport = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text(`Incentive Report (${dateFrom.value} to ${dateTo.value})`, 14, 15);
    // PDF generation for grouped data needs to be implemented
    doc.save(`Incentive_Report_${dateFrom.value}_${dateTo.value}.pdf`);
};

const exportToExcel = () => {
    const dataToExport = filteredAndSortedReport.value.flatMap(invoice => {
        const invoiceHeader = {
            'Date': new Date(invoice.GRNDate).toLocaleDateString(),
            'Invoice No': invoice.InvoiceNo,
            'supplier': invoice.supplier,
        };
        const items = invoice.items.map(item => ({
            '': '  ->',
            'Item Code': item.Itemcode,
            'Product/Service': item['Product/Service'],
            'Received Qty': item.ReceivedQty,
            'Incentive/Bottle': item.IncentivePerBottle,
            'Incentive': item.Incentive,
        }));
        const totalRow = {
            'Product/Service': 'Total',
            'Received Qty': invoice.totalReceivedQty,
            'Incentive': invoice.totalIncentive
        };
        return [invoiceHeader, ...items, totalRow, {}];
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incentive Report');
    XLSX.writeFile(workbook, `Incentive_Report_${dateFrom.value}_${dateTo.value}.xlsx`);
};

onMounted(() => {
  mastersStore.fetchLocations();
});
</script>

