<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Item Wise Sales Summary</h1>
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

        <div v-if="reportsStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.error" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.error }}</div>
        <div v-else class="overflow-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-2">
            <div class="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Quantity</p>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalQty }}</p>
            </div>
            <div class="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">Total Amount</p>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalAmount) }}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg">
                <p class="text-xs text-green-600 dark:text-green-400 uppercase">Total Profit</p>
                <p class="text-xl font-bold text-green-800 dark:text-green-300">{{ formatCurrency(totalProfit) }}</p>
            </div>
          </div>

          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th v-for="header in visibleHeaders" :key="header.key" class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" :class="header.align === 'right' ? 'text-right' : 'text-left'">
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
                <th v-for="header in visibleHeaders" :key="`filter-${header.key}`" class="px-6 py-2">
                  <input v-if="header.filterable" v-model="filters[header.key]" type="text" class="w-full text-xs px-1 py-0.5" :placeholder="`Filter...`">
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="(item, index) in filteredAndSortedSales" :key="index">
                <td v-for="header in visibleHeaders" :key="`cell-${index}-${header.key}`" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" :class="header.align === 'right' ? 'text-right' : ''">
                  {{ formatCell(item, header.key) }}
                </td>
              </tr>
              <tr v-if="filteredAndSortedSales.length === 0">
                <td :colspan="visibleHeaders.length" class="text-center py-10 text-gray-500 dark:text-gray-400">No data to display. Please generate or adjust filters.</td>
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
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Optional Columns</h3>
          <div class="space-y-2">
            <label v-for="option in optionalColumns" :key="option.key" class="flex items-center">
              <input type="checkbox" v-model="reportOptions[option.key]" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
            </label>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Group By (for PDF)</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" v-model="groupBy" value="Supplier" class="h-4 w-4 text-indigo-600 border-gray-300">
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Supplier</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="groupBy" value="SubDepartment" class="h-4 w-4 text-indigo-600 border-gray-300">
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Sub-Department</span>
            </label>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isOptionsModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
      </div>
    </div>
  </div>

  <!-- MODIFIED: Added Alert Modal -->
  <div v-if="isAlertModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">Information</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ alertMessage }}</p>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 text-right">
        <button @click="isAlertModalOpen = false" type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-md">OK</button>
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

const sortKey = ref('ItemAmount');
const sortOrder = ref('desc');
const filters = ref({
  Location: '',
  Supplier: '',
  SubDepartment: '',
  ItemCode: '',
  ItemDescription: '',
  PriceLevel: '',
  PriceGroup: '',
});

const isOptionsModalOpen = ref(false);
const reportOptions = ref({
  showSubDepartment: false,
  showAvgRate: false,
  showAvgCost: false,
  showDiscount: false,
  showPriceLevel: false,
  showPriceGroup: false,
});
const groupBy = ref('Supplier');

// MODIFIED: Added state for the alert modal
const isAlertModalOpen = ref(false);
const alertMessage = ref('');

const optionalColumns = [
    { key: 'showSubDepartment', label: 'Sub-Department' },
    { key: 'showAvgRate', label: 'Avg. Rate' },
    { key: 'showAvgCost', label: 'Avg. Cost' },
    { key: 'showDiscount', label: 'Discount' },
    { key: 'showPriceLevel', label: 'Price Level' },
    { key: 'showPriceGroup', label: 'Price Group' },
];

const headers = [
  { key: 'Location', label: 'Location', filterable: true, visible: true },
  { key: 'Supplier', label: 'Supplier', filterable: true, visible: true },
  { key: 'SubDepartment', label: 'Sub-Dept', filterable: true, visible: computed(() => reportOptions.value.showSubDepartment) },
  { key: 'ItemCode', label: 'Item Code', filterable: true, visible: true },
  { key: 'ItemDescription', label: 'Item Description', filterable: true, visible: true },
  { key: 'PriceLevel', label: 'Price Level', filterable: true, visible: computed(() => reportOptions.value.showPriceLevel) },
  { key: 'PriceGroup', label: 'Price Group', filterable: true, visible: computed(() => reportOptions.value.showPriceGroup) },
  { key: 'ItemQuantity', label: 'Quantity', filterable: false, visible: true, align: 'right' },
  { key: 'Discount', label: 'Discount', filterable: false, visible: computed(() => reportOptions.value.showDiscount), align: 'right' },
  { key: 'ItemAmount', label: 'Amount', filterable: false, visible: true, align: 'right' },
  { key: 'AvgRate', label: 'Avg. Rate', filterable: false, visible: computed(() => reportOptions.value.showAvgRate), align: 'right' },
  { key: 'AvgCost', label: 'Avg. Cost', filterable: false, visible: computed(() => reportOptions.value.showAvgCost), align: 'right' },
  { key: 'GP_Percentage', label: 'GP %', filterable: false, visible: true, align: 'right' },
];

const visibleHeaders = computed(() => headers.filter(h => h.visible === true || h.visible.value));

const generateReport = () => {
  const locations = selectedLocations.value.length > 0
    ? selectedLocations.value.map(code => `'${code}'`).join(',')
    : "'X'"; 
  reportsStore.fetchItemWiseSales(dateFrom.value, dateTo.value, locations);
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

const formatNumber = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toFixed(2);
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
  doc.text('Item Wise Sales Summary', doc.internal.pageSize.width / 2, 27, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date Range: ${dateFrom.value} to ${dateTo.value}`, doc.internal.pageSize.width / 2, 34, { align: 'center' });

  const reportData = filteredAndSortedSales.value;
  const grandTotalAmount = reportData.reduce((sum, item) => sum + item.ItemAmount, 0);

  const groupedData = reportData.reduce((acc, item) => {
    const location = item.Location;
    const groupKey = item[groupBy.value];
    if (!acc[location]) { acc[location] = { items: {}, total: 0 }; }
    if (!acc[location].items[groupKey]) { acc[location].items[groupKey] = { items: [], total: 0 }; }
    acc[location].items[groupKey].items.push(item);
    acc[location].items[groupKey].total += item.ItemAmount;
    acc[location].total += item.ItemAmount;
    return acc;
  }, {});

  let y = 45;

  const pdfTableHeaders = visibleHeaders.value.filter(h => h.key !== 'Location' && h.key !== 'Supplier' && h.key !== 'SubDepartment');
  const pdfHeaders = pdfTableHeaders.map(h => h.label);
  const pdfColumnStyles = {};
  pdfTableHeaders.forEach((h, i) => {
      if(h.align === 'right') {
          pdfColumnStyles[i] = { halign: 'right' };
      }
  });

  for (const locationName in groupedData) {
    const locationData = groupedData[locationName];
    const locationPercentage = grandTotalAmount > 0 ? (locationData.total / grandTotalAmount * 100).toFixed(2) : 0;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${locationName} - Total: ${formatNumber(locationData.total)} (${locationPercentage}%)`, 14, y);
    y += 7;

    for (const groupKey in locationData.items) {
      const groupData = locationData.items[groupKey];
      const groupPercentage = locationData.total > 0 ? (groupData.total / locationData.total * 100).toFixed(2) : 0;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(`${groupKey} - Total: ${formatNumber(groupData.total)} (${groupPercentage}%)`, 14, y);
      y += 2;
      doc.setTextColor(0, 0, 0);

      const tableBody = groupData.items.map(item => {
        return pdfTableHeaders.map(header => {
            const value = item[header.key];
            if (['ItemAmount', 'AvgRate', 'AvgCost', 'Discount'].includes(header.key)) {
                return formatNumber(value);
            }
            if (header.key === 'GP_Percentage') {
                return `${(value || 0).toFixed(2)}%`;
            }
            return value;
        });
      });
      
      doc.autoTable({
        startY: y,
        head: [pdfHeaders],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [220, 220, 220], textColor: 20 },
        styles: { fontSize: 8 },
        columnStyles: pdfColumnStyles,
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Totals:', 14, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Quantity: ${totalQty.value}`, 14, y);
  doc.text(`Total Amount: ${formatNumber(totalAmount.value)}`, 105, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 167, 69);
  doc.text(`Total Profit: ${formatNumber(totalProfit.value)}`, 14, y);

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

  doc.save(`item_sales_summary_${dateFrom.value}_${dateTo.value}.pdf`);
};

const downloadCrystalReport = () => {
    // MODIFIED: Added validation check
    if (selectedLocations.value.length !== 1) {
        alertMessage.value = "Please select exactly one location to generate a Crystal Report.";
        isAlertModalOpen.value = true;
        return;
    }

    const baseUrl = window.config?.CRYSTAL_REPORT_BASE_URL || 'https://wnrv2.caspersoft.lk/reportapi/GetReport';
    const dbn = window.config?.CRYSTAL_REPORT_DBN || '123';
    const repName = 'rptItemWiseSales.rpt';

    const locs = `'${selectedLocations.value[0]}'`;

    const parameters = `filter: and h.INV_DATE between '${dateFrom.value}' and '${dateTo.value}' AND h.inv_location in (${locs}),filter2: `;

    const locationName = mastersStore.locations.find(l => l.locCode === selectedLocations.value[0])?.locName || 'General';

    const formula = `comname:'${companyName.value}',dtfrom:'${dateFrom.value}',dtto:'${dateTo.value}',location:'${locationName}',repName:'Item Wise Sales Report'`;

    const finalUrl = `${baseUrl}?repName=${repName}&dbn=${dbn}&parameters=${encodeURIComponent(parameters)}&formula=${encodeURIComponent(formula)}`;
    
    console.log('Crystal Report URL:', finalUrl);
    window.open(finalUrl, '_blank');
};

const exportToExcel = () => {
    const data = filteredAndSortedSales.value.map(item => {
        const row = {};
        visibleHeaders.value.forEach(header => {
            const value = item[header.key];
            if (['ItemQuantity', 'ItemAmount', 'AvgRate', 'AvgCost', 'Discount', 'GP_Percentage'].includes(header.key)) {
                row[header.label] = typeof value === 'number' ? value : 0;
            } else {
                row[header.label] = value;
            }
        });
        return row;
    });

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Item Sales");
    window.XLSX.writeFile(workbook, `Item_Sales_Summary_${dateFrom.value}_${dateTo.value}.xlsx`);
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

const filteredAndSortedSales = computed(() => {
  let data = [...reportsStore.itemWiseSales];

  data = data.filter(item => {
    return Object.keys(filters.value).every(key => {
      if (!filters.value[key]) return true;
      return String(item[key]).toLowerCase().includes(filters.value[key].toLowerCase());
    });
  });

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

const totalQty = computed(() => filteredAndSortedSales.value.reduce((sum, item) => sum + item.ItemQuantity, 0));
const totalAmount = computed(() => filteredAndSortedSales.value.reduce((sum, item) => sum + item.ItemAmount, 0));
const totalProfit = computed(() => filteredAndSortedSales.value.reduce((sum, item) => sum + (item.ItemAmount - (item.AvgCost * item.ItemQuantity)), 0));

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const formatCell = (item, key) => {
    const value = item[key];
    switch(key) {
        case 'ItemAmount':
        case 'AvgRate':
        case 'AvgCost':
        case 'Discount':
            return formatCurrency(value);
        case 'GP_Percentage':
            return `${(value || 0).toFixed(2)}%`;
        default:
            return value;
    }
};

onMounted(() => {
  mastersStore.fetchLocations();
  authStore.fetchCompany();
});
</script>
