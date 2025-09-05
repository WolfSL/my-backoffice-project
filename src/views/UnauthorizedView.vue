<template>
  <MainLayout>
    <div class="container mx-auto text-center py-20">
      <h1 class="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">You do not have the required permissions to view this page.</p>
      <router-link to="/" class="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Go to Dashboard
      </router-link>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/layouts/MainLayout.vue';
</script>
