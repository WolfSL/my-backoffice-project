<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Goods Received Notes</h1>
        <router-link to="/transactions/grn/new" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          New GRN
        </router-link>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div v-if="grnStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading GRNs...</p></div>
        <div v-else-if="grnStore.error" class="text-center py-10 text-red-500 flex-grow">{{ grnStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GRN No.</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Amount</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="grn in grnStore.grnList" :key="grn.TNo">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ grn.TNo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ new Date(grn.TDate).toLocaleDateString() }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ grn.Loc }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ grn.SupCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-gray-200">{{ formatCurrency(grn.NetAmt) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <router-link :to="`/transactions/grn/edit/${grn.TNo}/${grn.Loc}`" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</router-link>
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
import { onMounted } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useGrnStore } from '@/stores/transactions/grn';

const grnStore = useGrnStore();

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

onMounted(() => {
  grnStore.fetchGrnList();
});
</script>
