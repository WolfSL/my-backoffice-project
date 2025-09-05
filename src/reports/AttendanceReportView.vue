<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Attendance Report</h1>
        <div class="flex items-center space-x-2">
          <button @click="exportToExcel"
            class="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Export to Excel">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <button @click="printReport"
            class="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            title="Print Report">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <!-- Filters -->
        <div class="flex items-center space-x-4 mb-4 flex-shrink-0">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <select v-model="selectedLocation"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}
              </option>
            </select>
          </div>
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <input v-model="fromDate" type="date"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <input v-model="toDate" type="date"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <button @click="generateReport"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 h-10">Generate</button>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
          <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
            <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Work Hours</h4>
            <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatNumber(totalWorkHours) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
            <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total OT</h4>
            <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatNumber(totalOT) }}</p>
          </div>

          
        </div>

        <!-- Table -->
        <div v-if="hrisStore.isLoading" class="text-center py-10 flex-grow">
          <p class="dark:text-gray-400">Loading attendance data...</p>
        </div>
        <div v-else-if="hrisStore.error" class="text-center py-10 text-red-500 flex-grow">{{ hrisStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th v-for="header in headers" :key="header.key"
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  :class="header.align === 'right' ? 'text-right' : ''">
                  <div class="flex items-center" :class="header.align === 'right' ? 'justify-end' : ''">
                    <span>{{ header.label }}</span>
                    <button @click="sortBy(header.key)" class="ml-1">
                      <svg v-if="sortKey === header.key && sortOrder === 'asc'" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                      <svg v-else-if="sortKey === header.key && sortOrder === 'desc'" class="h-4 w-4" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <svg v-else class="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </button>
                  </div>
                </th>
              </tr>
              <tr class="bg-gray-100 dark:bg-slate-700/50">
                <th v-for="header in headers" :key="`filter-${header.key}`" class="px-2 py-1">
                  <input v-if="header.filterable" v-model="filters[header.key]" type="text"
                    class="w-full text-xs px-1 py-0.5" :placeholder="`Filter...`">
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="record in filteredAndSortedRecords" :key="`${record.eid}-${record.rDate}`">
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ record.sot }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ record.eid }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ record.empName }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ formatDate(record.rDate) }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ record.sTime }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm">{{ record.eTime }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-right">{{ record.ot }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-right">{{ (record.shiftDiff) }}</td>
              </tr>
              <tr v-if="filteredAndSortedRecords.length === 0">
                <td :colspan="headers.length" class="text-center py-10 text-gray-500 dark:text-gray-400">No attendance
                  data to display.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useHrisStore } from '@/stores/hris';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';

const hrisStore = useHrisStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();

const selectedLocation = ref(authStore.user?.LocationCode || '');
const fromDate = ref(new Date().toISOString().split('T')[0]);
const toDate = ref(new Date().toISOString().split('T')[0]);
const sortKey = ref('rDate');
const sortOrder = ref('asc');
const filters = ref({
  sot: '',
  eid: '',
  empName: '',
});

const headers = [
  { key: 'sot', label: 'SOT', filterable: true },
  { key: 'eid', label: 'EID', filterable: true },
  { key: 'empName', label: 'Name', filterable: true },
  { key: 'rDate', label: 'Date', filterable: false },
  { key: 'sTime', label: 'In Time', filterable: false },
  { key: 'eTime', label: 'Out Time', filterable: false },
  { key: 'ot', label: 'OT', align: 'right' },

  { key: 'shiftDiff', label: 'Work Hours', align: 'right' },
];

const generateReport = () => {
  hrisStore.fetchAttendanceReport(selectedLocation.value, fromDate.value, toDate.value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-CA');
};

const formatTime = (timeString) => {
  console.log(timeString);
  if (!timeString) return 'N/A';
  return new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// const formatShiftDiff = (minutes) => {
//     if (typeof minutes !== 'number') return 'N/A';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
// };

const filteredAndSortedRecords = computed(() => {
  let data = [...hrisStore.attendanceRecords];

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

const formatNumber = (value) => {
    if (typeof value !== 'number') return 'N/A';
    return value.toFixed(2);
};


const totalWorkHours = computed(() => filteredAndSortedRecords.value.reduce((sum, item) => sum + item.shiftDiff, 0));
const totalOT = computed(() => filteredAndSortedRecords.value.reduce((sum, item) => sum + item.ot, 0));

const totalLateMinutes = computed(() => filteredAndSortedRecords.value.reduce((sum, item) => sum + item.late, 0));

const printReport = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Attendance Report', 14, 15);
  doc.autoTable({
    head: [headers.map(h => h.label)],
    body: filteredAndSortedRecords.value.map(item => headers.map(h => {
      if (h.key === 'rDate') return formatDate(item.rDate);
      if (h.key === 'sTime' || h.key === 'eTime') return formatTime(item[h.key]);
      if (h.key === 'shiftDiff') return (item.shiftDiff);
      return item[h.key];
    })),
    startY: 20,
  });
  doc.save('attendance_report.pdf');
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredAndSortedRecords.value.map(item => {
    const row = {};
    headers.forEach(h => {
      if (h.key === 'rDate') row[h.label] = formatDate(item.rDate);
      else if (h.key === 'sTime' || h.key === 'eTime') row[h.label] = formatTime(item[h.key]);
      else if (h.key === 'shiftDiff') row[h.label] = (item.shiftDiff);
      else row[h.label] = item[h.key];
    });
    return row;
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
  XLSX.writeFile(workbook, 'Attendance_Report.xlsx');
};

onMounted(() => {
  mastersStore.fetchLocations();
  generateReport();
});
</script>
