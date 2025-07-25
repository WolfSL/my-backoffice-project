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
          <button @click="isTransactionsOpen = !isTransactionsOpen" class="w-full flex items-center justify-between px-6 py-3 text-gray-100 hover:bg-black/40">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h4M8 7a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2h-4a2 2 0 01-2-2z" /></svg>
              <span class="mx-3 transition-opacity duration-300 whitespace-nowrap" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">Transactions</span>
            </div>
            <svg v-if="isSidebarExpanded" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300" :class="isTransactionsOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <div v-if="isTransactionsOpen && isSidebarExpanded" class="bg-black/20">
            <router-link to="/transactions/purchase-orders" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Purchase Order</span></router-link>
          </div>
        </div>
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
            <router-link to="/masters/items" class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"><span>Items</span></router-link>
          </div>
        </div>

        
        <router-link to="/reports" class="flex items-center px-6 py-3 text-gray-100 hover:bg-black/40">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <span class="mx-3 transition-opacity duration-300 whitespace-nowrap" :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">Reports</span>
        </router-link>
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
          <div class="relative hidden md:block ml-2">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
            </span>
            <input v-model="searchQuery" @focus="showSearchResults = true" class="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-indigo-500" type="text" placeholder="Search pages...">
            <div v-if="showSearchResults && searchResults.length > 0" class="absolute mt-2 w-full bg-white dark:bg-slate-700 rounded-md shadow-lg z-20">
              <ul>
                <li v-for="route in searchResults" :key="route.name" @click="navigateTo(route.name)" class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer">
                  {{ route.meta.title }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <button @click="themeStore.toggleTheme" class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none" :class="themeStore.theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'">
            <span class="sr-only">Toggle Theme</span>
            <span class="inline-flex items-center justify-center w-4 h-4 transform bg-white rounded-full transition-transform" :class="themeStore.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'">
              <svg v-if="themeStore.theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.464A1 1 0 106.465 13.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-1.414-2.12a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
            </span>
          </button>

          <div class="relative ml-4">
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
      
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-4">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDashboardStore } from '@/stores/dashboard';
import { useThemeStore } from '@/stores/theme';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const themeStore = useThemeStore();
const router = useRouter();

const isSidebarOpen = ref(false);
const isSidebarExpanded = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const isMastersOpen = ref(false);
const isTransactionsOpen = ref(false);

const searchQuery = ref('');
const searchResults = ref([]);
const showSearchResults = ref(false);

const availableRoutes = computed(() => {
  return router.getRoutes().filter(route => route.meta && route.meta.title && route.meta.requiresAuth);
});

watch(searchQuery, (newQuery) => {
  if (newQuery) {
    searchResults.value = availableRoutes.value.filter(route => 
      route.meta.title.toLowerCase().includes(newQuery.toLowerCase())
    );
  } else {
    searchResults.value = [];
  }
});

const navigateTo = (routeName) => {
  router.push({ name: routeName });
  searchQuery.value = '';
  showSearchResults.value = false;
};

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
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showSearchResults.value = false;
    }
  });
});
</script>
