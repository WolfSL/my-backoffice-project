<template>
  <MainLayout>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Reports</h1>

      <!-- Sales Reports Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-indigo-500 pb-2 mb-6">
          Sales Reports
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Item Wise Sales Summary Card -->
           <!-- <router-link to="/masters/items" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Items</span></router-link> -->
          <router-link to="/reports/item-sales-summary" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-200">Item Wise Sales Summary</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">A detailed breakdown of sales by individual item.</p>
          </router-link>
          
          <!-- MODIFIED: Added new card for Sales Summary w/ Payment -->
          <router-link to="/reports/sales-summary-payment" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-200">Sales Summary w/ Payment</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">View sales transactions grouped by payment type.</p>
          </router-link>
        </div>
      </section>

      <!-- Stock Reports Section -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-indigo-500 pb-2 mb-6">
          Product & Stock Reports
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Placeholder for future stock reports -->
           <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg opacity-50">
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-200">Stock Levels</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Current inventory levels by location (coming soon).</p>
          </div>
        </div>
      </section>

    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/MainLayout.vue';
</script>
