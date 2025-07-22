<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900 font-sans">
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden"></div>

    <aside
      @mouseenter="isSidebarExpanded = true"
      @mouseleave="isSidebarExpanded = false"
      :class="[ isSidebarExpanded ? 'md:w-64' : 'md:w-20', isSidebarOpen ? 'translate-x-0' : '-translate-x-full' ]"
      class="fixed inset-y-0 left-0 z-40 bg-gray-900/80 backdrop-blur-lg text-white flex flex-col transition-all duration-300 ease-in-out md:translate-x-0"
    >
      <div class="relative flex items-center justify-end h-16 px-4 bg-black/20 flex-shrink-0">
        <h2 class="absolute left-6 text-2xl font-semibold transition-opacity duration-300 whitespace-nowrap pointer-events-none" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">CasperPOS</h2>
        <div class="p-2 rounded-lg text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300" :class="isSidebarExpanded ? '' : 'rotate-180'" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
         </div>
      </div>

      <nav class="mt-6 flex-grow">
        <router-link to="/" class="flex items-center px-6 py-3 text-gray-100 hover:bg-black/40">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span class="mx-3 transition-opacity duration-300 whitespace-nowrap" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">Dashboard</span>
        </router-link>
        <div>
          <button @click="isMastersOpen = !isMastersOpen" class="w-full flex items-center justify-between px-6 py-3 text-gray-100 hover:bg-black/40">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0M12 21v-8M20 7s0 0 0 0" /></svg>
              <span class="mx-3 transition-opacity duration-300 whitespace-nowrap" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">Masters</span>
            </div>
            <svg v-if="isSidebarExpanded" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" :class="isMastersOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div v-if="isMastersOpen && isSidebarExpanded" class="bg-black/20">
            <router-link to="/masters/suppliers" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Suppliers</span></router-link>
            <router-link to="/masters/departments" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Departments</span></router-link>
            <router-link to="/masters/sub-departments" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Sub-Departments</span></router-link>
            <!-- MODIFIED: Added new link for items -->
            <router-link to="/masters/items" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Items</span></router-link>
          </div>
        </div>
      </nav>
      <div class="px-6 py-4 flex-shrink-0">
         <div class="text-center text-xs text-gray-500 mt-4 transition-opacity duration-300 whitespace-nowrap" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">
            Powered by Caspersoft
         </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden md:ml-20">
      <header class="flex items-center justify-between px-6 py-1.5 bg-white dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
        <div class="flex items-center">
          <button @click="isSidebarOpen = !isSidebarOpen" class="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
          <div class="relative hidden md:block ml-4">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center"><svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg></span>
            <input class="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-indigo-500" type="text" placeholder="Search pages...">
          </div>
        </div>
        <div class="flex items-center">
          <button @click="themeStore.toggleTheme" class="relative p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
            <svg v-if="themeStore.theme === 'light'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
          <div class="relative ml-2">
            <button @click="isNotificationsOpen = !isNotificationsOpen" class="relative p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
              <svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
              <span v-if="dashboardStore.notificationCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">{{ dashboardStore.notificationCount }}</span>
            </button>
            <div v-if="isNotificationsOpen" @click="isNotificationsOpen = false" class="fixed inset-0 h-full w-full z-10"></div>
            <div v-if="isNotificationsOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
              <div class="py-2 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-600">Notifications</div>
              <div v-if="dashboardStore.isNotificationsLoading" class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              <div v-else class="max-h-96 overflow-y-auto">
                <div v-for="(group, type) in groupedNotifications" :key="type"><h3 class="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-slate-900">{{ type }}</h3><ul><li v-for="(item, index) in group" :key="index" class="p-4 border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"><p class="font-semibold text-sm text-gray-800 dark:text-gray-200">{{ item.Location }}</p><div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1"><span>Count: {{ item.invcount }}</span><span>Amount: {{ formatCurrency(item.amt) }}</span></div></li></ul></div>
                <div v-if="dashboardStore.notificationCount === 0" class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No new notifications.</div>
              </div>
            </div>
          </div>
          <div class="relative ml-2">
            <button @click="isUserMenuOpen = !isUserMenuOpen" class="flex items-center p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg>
              <span class="font-semibold text-sm ml-2 hidden md:block">{{ authStore.displayName }}</span>
            </button>
            <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false" class="fixed inset-0 h-full w-full z-10"></div>
            <div v-if="isUserMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-20">
              <a href="#" @click.prevent="authStore.logout()" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" /></svg>Logout</a>
            </div>
          </div>
        </div>
      </header>
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useDashboardStore } from '@/stores/dashboard';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const themeStore = useThemeStore();

const isSidebarOpen = ref(false);
const isSidebarExpanded = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const isMastersOpen = ref(false);

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

const groupedNotifications = computed(() => {
  return dashboardStore.voidCancelData.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  dashboardStore.fetchVoidCancel(today, today);
});
</script>
