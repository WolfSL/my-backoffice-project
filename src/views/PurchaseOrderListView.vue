<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Purchase Orders</h1>
        <router-link to="/transactions/purchase-order/new" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          New Purchase Order
        </router-link>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 items-end flex-shrink-0">
          <div class="lg:col-span-2 flex items-center space-x-2">
            <select v-model="filterType" @change="handleFilterChange" class="w-48 px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="date-range">Date Range</option>
              <option value="draft">Draft POs</option>
            </select>
            <div v-if="filterType === 'date-range'" class="flex items-center space-x-2">
              <input v-model="dateFrom" type="date" @change="handleFilterChange" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              <input v-model="dateTo" type="date" @change="handleFilterChange" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            </div>
          </div>
          <div class="lg:col-span-3 flex justify-end">
            <div class="flex items-center space-x-4 text-xs dark:text-gray-300">
              <div class="flex items-center"><span class="h-3 w-3 rounded-full bg-green-200 dark:bg-green-700 mr-2"></span>Emailed</div>
              <div class="flex items-center"><span class="h-3 w-3 rounded-full bg-yellow-200 dark:bg-yellow-700 mr-2"></span>Approved</div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <input v-model="filters.poNo" type="text" placeholder="Search PO Number..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <input v-model="filters.location" type="text" placeholder="Search Location..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <input v-model="filters.supplier" type="text" placeholder="Search Supplier..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
        </div>
        
        <div v-if="poStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading purchase orders...</p></div>
        <div v-else-if="poStore.error" class="text-center py-10 text-red-500 flex-grow">{{ poStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PO No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('PO Date')">PO Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('LocName')">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('Supplier')">Supplier</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="po in filteredAndSortedPOs" :key="po.uniqueId" :class="getRowClass(po.colorx)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ po.PONo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ new Date(po['PO Date']).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ po.LocName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ po.Supplier }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ po.QTY.toFixed(2) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ formatCurrency(po.Amt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link :to="`/transactions/purchase-order/edit/${po.PONo}/${po.location}/${po.DocType}`" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Edit
                  </router-link>
                </td>
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
import { usePoStore } from '@/stores/transactions/po';
import { useAuthStore } from '@/stores/auth';

const poStore = usePoStore();
const authStore = useAuthStore();

const filterType = ref('this-month');
const dateFrom = ref('');
const dateTo = ref('');

const filters = ref({
    poNo: '',
    location: '',
    supplier: ''
});
const sortKey = ref('PO Date');
const sortOrder = ref('desc');

const getRowClass = (colorx) => {
    if (colorx === 'COL#1') return 'bg-green-50 dark:bg-green-900/50';
    if (colorx === 'COL#2') return 'bg-yellow-50 dark:bg-yellow-900/50';
    return '';
};

const handleFilterChange = () => {
    let from, to;
    const today = new Date();
    if (filterType.value === 'this-month') {
        from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (filterType.value === 'last-month') {
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
        to = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
    } else if (filterType.value === 'date-range') {
        from = dateFrom.value;
        to = dateTo.value;
    }
    
    const type = filterType.value === 'draft' ? 'Draft' : 'Date';
    poStore.fetchPurchaseOrders(type, authStore.user.Username, authStore.user.LocationCode, from, to);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

const filteredAndSortedPOs = computed(() => {
    let data = [...poStore.purchaseOrders];

    // MODIFIED: Added null/undefined checks to prevent crashes
    data = data.filter(po => {
        const poNoMatch = (po.PONo || '').toString().toLowerCase().includes(filters.value.poNo.toLowerCase());
        const locMatch = (po.LocName || '').toLowerCase().includes(filters.value.location.toLowerCase());
        const supMatch = (po.Supplier || '').toLowerCase().includes(filters.value.supplier.toLowerCase());
        return poNoMatch && locMatch && supMatch;
    });

    if (sortKey.value) {
        data.sort((a, b) => {
            let valA = a[sortKey.value];
            let valB = b[sortKey.value];
            
            if (sortKey.value === 'PO Date') {
                return sortOrder.value === 'asc' 
                    ? new Date(valA) - new Date(valB) 
                    : new Date(valB) - new Date(valA);
            }

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

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};


onMounted(() => {
    handleFilterChange();
});
</script>
