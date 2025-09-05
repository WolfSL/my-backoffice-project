<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900 font-sans">
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/30 z-30 md:hidden"></div>

    <!-- Sidebar -->
    <aside @mouseenter="isSidebarExpanded = true" @mouseleave="isSidebarExpanded = false" :class="[
      isSidebarExpanded ? 'lg:w-64' : 'lg:w-20',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
      class="fixed inset-y-0 left-0 z-40 bg-gray-900/80 backdrop-blur-lg text-white flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 bg-black/20 flex-shrink-0">
        <img v-if="!isSidebarExpanded" src="/pwa-512x512.png" alt="Logo" class="h-25 w-25">
        <h2 v-if="isSidebarExpanded" class="text-2xl font-semibold transition-opacity duration-300 whitespace-nowrap"
          :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">CasperPOS</h2>
      </div>

      <!-- Navigation Links -->
      <nav class="mt-6 flex-grow overflow-y-auto">
        <div v-for="item in menuItems" :key="item.name">
          <div v-if="shouldShowMenuItem(item)">
          <router-link v-if="!item.children" :to="item.path"
            class="flex items-center px-6 py-3 text-gray-100 hover:bg-black/40" active-class="bg-indigo-800">
            <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
            <span class="mx-4 transition-opacity duration-300 whitespace-nowrap"
              :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">{{ item.name }}</span>
          </router-link>
          <div v-else>
            <button @click="toggleSubMenu(item.name)"
              class="w-full flex items-center justify-between px-6 py-3 text-gray-100 hover:bg-black/40">
              <div class="flex items-center">
                <component :is="item.icon" class="h-6 w-6 flex-shrink-0" />
                <span class="mx-4 transition-opacity duration-300 whitespace-nowrap"
                  :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'">{{ item.name }}</span>
              </div>
              <ChevronDownIcon v-if="isSidebarExpanded" class="h-5 w-5 transition-transform duration-300"
                :class="openMenus[item.name] ? 'rotate-180' : ''" />
            </button>
            <div v-if="openMenus[item.name] && isSidebarExpanded" class="bg-black/20">
              <router-link v-for="child in item.children" :key="child.name" :to="child.path"
                class="flex items-center py-3 pl-14 pr-6 text-gray-300 hover:bg-black/40 hover:text-white"
                active-class="text-indigo-300">
                <span>{{ child.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
        </div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col overflow-hidden md:ml-20">
      <header
        class="flex items-center justify-between px-6 py-1.5 bg-white dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700">
        <div class="flex items-center">
          <button @click="isSidebarOpen = !isSidebarOpen"
            class="text-gray-500 dark:text-gray-400 focus:outline-none md:hidden">
            <Bars3Icon class="h-6 w-6" />
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="authStore.syncLocationsToFirebase()" :disabled="authStore.isSyncing"
            class="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none"
            title="Sync Data">
            <ArrowPathIcon class="h-6 w-6" :class="{ 'animate-spin': authStore.isSyncing }" />
          </button>
          <button @click="themeStore.toggleTheme"
            class="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none"
            title="Toggle Theme">
            <SunIcon v-if="themeStore.theme === 'dark'" class="h-6 w-6" />
            <MoonIcon v-else class="h-6 w-6" />
          </button>
          <div class="relative">
            <button @click="isNotificationsOpen = !isNotificationsOpen"
              class="relative p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
              <BellIcon class="h-6 w-6" />
              <span v-if="dashboardStore.notificationCount > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">{{
                  dashboardStore.notificationCount }}</span>
            </button>
            <div v-if="isNotificationsOpen" @click="isNotificationsOpen = false"
              class="fixed inset-0 h-full w-full z-10"></div>
            <div v-if="isNotificationsOpen"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-700 rounded-lg shadow-xl overflow-hidden z-20">
              <div
                class="py-2 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-600">
                Notifications</div>
              <div v-if="dashboardStore.isNotificationsLoading"
                class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
              <div v-else class="max-h-96 overflow-y-auto">
                <div v-for="(group, type) in groupedNotifications" :key="type">
                  <h3
                    class="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-slate-900">
                    {{ type }}</h3>
                  <ul>
                    <li v-for="(item, index) in group" :key="index"
                      class="p-4 border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600">
                      <p class="font-semibold text-sm text-gray-800 dark:text-gray-200">{{ item.Location }}</p>
                      <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1"><span>Count: {{
                        item.invcount }}</span><span>Amount: {{ formatCurrency(item.amt) }}</span></div>
                    </li>
                  </ul>
                </div>
                <div v-if="dashboardStore.notificationCount === 0"
                  class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">No new notifications.</div>
              </div>
            </div>
          </div>
          <div class="relative">
            <button @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
              <UserCircleIcon class="h-6 w-6" />
              <span class="font-semibold text-sm ml-2 hidden md:block">{{ authStore.displayName }}</span>
            </button>
            <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false" class="fixed inset-0 h-full w-full z-10"></div>
            <div v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-20">
              <a href="#" @click.prevent="authStore.logout()"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">
                <ArrowRightOnRectangleIcon class="h-5 w-5 mr-2" />
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-slate-900 p-4">
        <slot></slot>
      </main>
    </div>
  </div>
  <PwaPrompt />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useDashboardStore } from '@/stores/dashboard';
import { useThemeStore } from '@/stores/theme';
import PwaPrompt from '@/components/PwaPrompt.vue';
import {
  HomeIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
  ChevronDownIcon,
  Bars3Icon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';


const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const themeStore = useThemeStore();
const router = useRouter();

const isSidebarOpen = ref(false);
const isSidebarExpanded = ref(false);
const isUserMenuOpen = ref(false);
const isNotificationsOpen = ref(false);
const openMenus = ref({});

const menuItems = ref([
  { name: 'Dashboard', path: '/', icon: HomeIcon, permission: 'DASHBOARD#VIEW' },
  {
    name: 'Transactions',
    icon: ShoppingCartIcon,
    permission: 'TRANSACTIONS#VIEW',
    children: [
      { name: 'Purchase Order', path: '/transactions/purchase-orders', permission: 'PO#VIEW' },
      { name: 'Goods Received Note', path: '/transactions/grn', permission: 'GRN#VIEW' },
      { name: 'Stock Taking', path: '/transactions/stock-taking', permission: 'ST#VIEW' },
    ]
  },
  {
    name: 'Masters',
    icon: ArchiveBoxIcon,
    permission: 'MASTERS#VIEW',
    children: [
      { name: 'Suppliers', path: '/masters/suppliers', permission: 'MASTERS#VIEW' },
      { name: 'Departments', path: '/masters/departments', permission: 'MASTERS#VIEW' },
      { name: 'Sub-Departments', path: '/masters/sub-departments', permission: 'MASTERS#VIEW' },
      { name: 'Items', path: '/masters/items', permission: 'MASTERS#VIEW' },
    ]
  },
  {
    name: 'Petty Cash',
    icon: BanknotesIcon,
    permission: 'PC#VIEW',
    children: [
      { name: 'Manage Petty Cash', path: '/transactions/petty-cash', permission: 'PC#VIEW' },

    ]
  },
  {
    name: 'HRIS',
    icon: UserGroupIcon,
    permission: 'HRIS#VIEW',
    children: [
      { name: 'Employee Profile', path: '/hris/employee-profile', permission: 'HRIS#VIEW' },
      { name: 'User Management', path: '/transactions/user-management', permission: 'ADMIN#USERS' },
    ]
  },
  { name: 'Reports', path: '/reports', icon: DocumentChartBarIcon, permission: 'REPORTS#VIEW' },
]);

const shouldShowMenuItem = (item) => {

    return authStore.hasPermission(item.permission);
  

};

const toggleSubMenu = (name) => {
  openMenus.value[name] = !openMenus.value[name];
};

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

const groupedNotifications = computed(() => {
  return dashboardStore.voidCancelData.reduce((acc, item) => {
    (acc[item.type] = acc[item.type] || []).push(item);
    return acc;
  }, {});
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
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
