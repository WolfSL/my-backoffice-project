<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Sales Summary with Payment</h1>
        <div class="flex items-center space-x-2">
          <button @click="isOptionsModalOpen = true" title="Report Options" class="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
          </button>
          <button @click="exportToExcel" title="Export to Excel" class="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          <button @click="downloadCrystalReport" title="Download Crystal Report" class="p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C3.732 5.943 7.523 4 10 4c2.477 0 6.268 1.943 9.542 6-3.274 4.057-7.065 6-9.542 6S3.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
          </button>
          <button @click="printReport" title="Print PDF Report" class="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
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
          <button @click="generateReport" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full">Generate</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-2">
            <div v-for="(total, type) in paymentTypeTotals" :key="type" class="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ type }}</p>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(total) }}</p>
            </div>
        </div>

        <div v-if="reportsStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.error" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th v-for="header in activeHeaders" :key="header.key" class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" :class="header.align === 'right' ? 'text-right' : 'text-left'">
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
              <tr v-if="viewMode === 'full'" class="bg-gray-100 dark:bg-slate-700/50">
                <th v-for="header in activeHeaders" :key="`filter-${header.key}`" class="px-6 py-2">
                  <input v-if="header.filterable" v-model="filters[header.key]" type="text" class="w-full text-xs px-1 py-0.5" :placeholder="`Filter...`">
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="(item, index) in filteredAndSortedSales" :key="index">
                <td v-for="header in activeHeaders" :key="`cell-${index}-${header.key}`" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" :class="header.align === 'right' ? 'text-right' : ''">
                  {{ formatCell(item, header.key) }}
                </td>
              </tr>
              <tr v-if="filteredAndSortedSales.length === 0">
                <td :colspan="activeHeaders.length" class="text-center py-10 text-gray-500 dark:text-gray-400">No data to display. Please generate a report.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <div v-if="isLocationModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Locations</h2>
        <input v-model="locationSearchText" type="text" placeholder="Search locations..." class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto flex-grow">
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
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right flex-shrink-0">
        <button @click="isLocationModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
      </div>
    </div>
  </div>

  <div v-if="isOptionsModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Report Options</h2>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">View Mode</h3>
          <div class="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-slate-700 rounded-md">
            <button @click="viewMode = 'full'" :class="viewMode === 'full' ? 'bg-white dark:bg-slate-600 shadow' : ''" class="flex-1 px-3 py-1 text-sm rounded-md transition-colors">Full View</button>
            <button @click="viewMode = 'pivot'" :class="viewMode === 'pivot' ? 'bg-white dark:bg-slate-600 shadow' : ''" class="flex-1 px-3 py-1 text-sm rounded-md transition-colors">Pivoted View</button>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Optional Columns (Full View)</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="reportOptions.showCardType" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Card Type</span>
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
import { storeToRefs } from 'pinia';

const reportsStore = useReportsStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();
const { companyName, companyAddress } = storeToRefs(authStore);

const dateFrom = ref(new Date().toISOString().split('T')[0]);
const dateTo = ref(new Date().toISOString().split('T')[0]);

const isLocationModalOpen = ref(false);
const locationSearchText = ref('');
const selectedLocations = ref([]);

const sortKey = ref('INV_AMOUNT');
const sortOrder = ref('desc');
const isOptionsModalOpen = ref(false);
const reportOptions = ref({ showCardType: false });
const viewMode = ref('pivot');

const filters = ref({
    Locn_name: '',
    INV_DATE: '',
    INV_NO: '',
    INV_PAYTYPE: '',
    INV_CARD_TYPE: ''
});

const fullViewHeaders = [
  { key: 'Locn_name', label: 'Location', filterable: true },
  { key: 'INV_DATE', label: 'Date', filterable: true },
  { key: 'INV_NO', label: 'Invoice No', filterable: true },
  { key: 'INV_PAYTYPE', label: 'Payment Type', filterable: true },
  { key: 'INV_CARD_TYPE', label: 'Card Type', visible: computed(() => reportOptions.value.showCardType), filterable: true },
  { key: 'INV_AMOUNT', label: 'Amount', align: 'right' },
];

const pivotHeaders = computed(() => {
    const paymentTypes = [...new Set(reportsStore.salesSummaryWithPayment.map(item => item.INV_PAYTYPE))];
    return [
        { key: 'Locn_name', label: 'Location' },
        { key: 'INV_DATE', label: 'Date' },
        ...paymentTypes.map(pt => ({ key: pt, label: pt, align: 'right' })),
        { key: 'Total', label: 'Total', align: 'right' }
    ];
});

const activeHeaders = computed(() => {
    if (viewMode.value === 'full') {
        return fullViewHeaders.filter(h => {
            if (h.visible && typeof h.visible.value !== 'undefined') {
                return h.visible.value;
            }
            return h.visible !== false;
        });
    }
    return pivotHeaders.value;
});

const pivotedData = computed(() => {
    const grouped = reportsStore.salesSummaryWithPayment.reduce((acc, item) => {
        const key = `${item.Locn_name}|${formatDate(item.INV_DATE)}`;
        if (!acc[key]) {
            acc[key] = {
                Locn_name: item.Locn_name,
                INV_DATE: formatDate(item.INV_DATE),
                Total: 0,
            };
        }
        acc[key][item.INV_PAYTYPE] = (acc[key][item.INV_PAYTYPE] || 0) + item.INV_AMOUNT;
        acc[key].Total += item.INV_AMOUNT;
        return acc;
    }, {});
    return Object.values(grouped);
});

const filteredAndSortedSales = computed(() => {
  let data = viewMode.value === 'full' ? [...reportsStore.salesSummaryWithPayment] : pivotedData.value;

  if (viewMode.value === 'full') {
      data = data.filter(item => {
          return Object.keys(filters.value).every(key => {
              if (!filters.value[key]) return true;
              return String(item[key]).toLowerCase().includes(filters.value[key].toLowerCase());
          });
      });
  }

  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
});

const paymentTypeTotals = computed(() => {
    return reportsStore.salesSummaryWithPayment.reduce((acc, item) => {
        const type = item.INV_PAYTYPE;
        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type] += item.INV_AMOUNT;
        return acc;
    }, {});
});

const generateReport = () => {
  const locations = selectedLocations.value.length > 0
    ? selectedLocations.value.map(code => `'${code}'`).join(',')
    : "'X'"; 
  reportsStore.fetchSalesSummaryWithPayment(dateFrom.value, dateTo.value, locations);
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA');
};

const printReport = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(companyName.value, 14, 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const addressLines = companyAddress.value.split('\r\n').map(line => line.trim());
  doc.text(addressLines, 14, 22);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Sales Summary with Payment', doc.internal.pageSize.width / 2, 27, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date Range: ${dateFrom.value} to ${dateTo.value}`, doc.internal.pageSize.width / 2, 34, { align: 'center' });

  const headers = activeHeaders.value.map(h => h.label);
  const body = filteredAndSortedSales.value.map(item => {
      return activeHeaders.value.map(header => formatCell(item, header.key, true));
  });

  doc.autoTable({
    startY: 45,
    head: [headers],
    body: body,
    theme: 'striped',
    headStyles: { fillColor: [44, 62, 80] },
  });
  
  const pageCount = doc.internal.getNumberOfPages();
  const printTime = new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' });
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    doc.text(`Printed by: ${authStore.displayName} on ${printTime}`, doc.internal.pageSize.width - 6, 287, { align: 'right' });
    doc.text('Powered by Caspersoft', 14, 287);
  }

  doc.save(`sales_summary_payment_${dateFrom.value}_${dateTo.value}.pdf`);
};

const exportToExcel = () => {
    const data = filteredAndSortedSales.value.map(item => {
        const row = {};
        activeHeaders.value.forEach(header => {
            row[header.label] = formatCell(item, header.key);
        });
        return row;
    });

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Summary");
    window.XLSX.writeFile(workbook, `Sales_Summary_Payment_${dateFrom.value}_${dateTo.value}.xlsx`);
};

const downloadCrystalReport = () => {
    const baseUrl = window.config?.CRYSTAL_REPORT_BASE_URL || 'https://wnrv2.caspersoft.lk/reportapi/GetReport';
    const dbn = window.config?.CRYSTAL_REPORT_DBN || '123';
    const repName = 'rptDallySalesSumLocWithpay.rpt';

    const locs = selectedLocations.value.length > 0 
        ? selectedLocations.value.map(l => `'${l}'`).join(',')
        : "'X'";
    const locationFilter = ` AND h.inv_location in (${locs})`;

    const parameters = `filter: and h.INV_DATE between '${dateFrom.value}' and '${dateTo.value}'${locationFilter},filter2: `;

    const locationName = selectedLocations.value.length === 1 
        ? mastersStore.locations.find(l => l.locCode === selectedLocations.value[0])?.locName || 'General'
        : 'All Selected';

    const formula = `cashier:'${authStore.user.Username}',ComName:'${companyName.value}',dtFrom:'${dateFrom.value}',dtTo:'${dateTo.value}',location:'${locationName}',REPNAME:'Sales Summary With Payment',softCom:'Caspersoft',terminal:'99'`;

    const finalUrl = `${baseUrl}?repName=${repName}&dbn=${dbn}&parameters=${encodeURIComponent(parameters)}&formula=${encodeURIComponent(formula)}`;
    
    console.log('Crystal Report URL:', finalUrl);
    window.open(finalUrl, '_blank');
};

const filteredLocations = computed(() => {
    if (!locationSearchText.value) {
        return mastersStore.locations;
    }
    return mastersStore.locations.filter(loc => 
        loc.locName.toLowerCase().includes(locationSearchText.value.toLowerCase()) ||
        loc.master.toLowerCase().includes(locationSearchText.value.toLowerCase())
    );
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatCell = (item, key, forPdf = false) => {
    const value = item[key];
    if (key === 'INV_DATE') return formatDate(value);
    if (typeof value === 'number') return forPdf ? value.toFixed(2) : formatCurrency(value);
    return value || '';
};

onMounted(() => {
  mastersStore.fetchLocations();
  authStore.fetchCompany();
});
</script>
