<template>
  <MainLayout>
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Petty Cash Management</h1>
      </div>

      <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium">Location</label>
                <select v-model="selectedLocation" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                  <option v-for="loc in allowedLocations" :key="loc.id" :value="loc.id">{{ loc.locName }}</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium">From Date</label>
                <input v-model="fromDate" type="date" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
            </div>
            <div>
                <label class="block text-sm font-medium">To Date</label>
                <input v-model="toDate" type="date" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column: Forms -->
        <div class="md:col-span-1 space-y-6">
          <div v-if="authStore.hasPermission('PC#SET_OPENING')" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Set Opening Balance</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Amount</label>
                    <input v-model.number="openingBalanceAmount" type="number" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                </div>
                <button @click="handleSetOpeningBalance" :disabled="pettyCashStore.isLoading" class="w-full px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center disabled:bg-blue-400">
                    <svg v-if="pettyCashStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ pettyCashStore.isLoading ? 'Setting...' : 'Set Balance' }}
                </button>
            </div>
          </div>
          
          <div v-if="authStore.hasPermission('PC#ADD_CASH')" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Add Cash</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Amount</label>
                    <input v-model.number="addCashAmount" type="number" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                </div>
                <div>
                    <label class="block text-sm font-medium">Check Number</label>
                    <input v-model="checkNumber" type="text" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                </div>
                <button @click="handleAddCash" :disabled="pettyCashStore.isLoading" class="w-full px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center disabled:bg-green-400">
                    <svg v-if="pettyCashStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ pettyCashStore.isLoading ? 'Adding...' : 'Add Cash' }}
                </button>
            </div>
          </div>

          <div v-if="authStore.hasPermission('PC#WITHDRAW')" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4">Withdraw Cash</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Amount</label>
                    <input v-model.number="withdrawAmount" type="number" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                </div>
                <div>
                    <label class="block text-sm font-medium">Withdrawal Type</label>
                    <select v-model="withdrawType" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                        <option v-for="type in pettyCashStore.withdrawalTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium">Remark</label>
                    <input v-model="withdrawRemark" type="text" class="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                </div>
                <div>
                    <label class="block text-sm font-medium">Image (Optional)</label>
                    <input type="file" @change="handleFileSelect" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                <button @click="handleWithdraw" :disabled="pettyCashStore.isLoading" class="w-full px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center disabled:bg-red-400">
                    <svg v-if="pettyCashStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ pettyCashStore.isLoading ? 'Processing...' : 'Withdraw' }}
                </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Summary -->
        <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Petty Cash Summary</h2>
          <div v-if="pettyCashStore.isLoading" class="text-center py-10">Loading...</div>
          <div v-else>
            <div class="grid grid-cols-2 gap-4 mb-4 text-center">
                <div class="bg-gray-100 dark:bg-slate-700 p-3 rounded">
                    <p class="text-sm text-gray-500">Opening Balance</p>
                    <p class="text-lg font-bold">{{ formatCurrency(openingBalance) }}</p>
                </div>
                <div class="bg-gray-100 dark:bg-slate-700 p-3 rounded">
                    <p class="text-sm text-gray-500">Closing Balance</p>
                    <p class="text-lg font-bold">{{ formatCurrency(closingBalance) }}</p>
                </div>
            </div>
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead class="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium">Date</th>
                        <th class="px-4 py-2 text-left text-xs font-medium">Type</th>
                        <th class="px-4 py-2 text-left text-xs font-medium">Details</th>
                        <th class="px-4 py-2 text-right text-xs font-medium">Amount</th>
                        <th class="px-4 py-2 text-center text-xs font-medium">Image</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                    <tr v-for="log in pettyCashStore.transactionLog" :key="log.id">
                        <td class="px-4 py-2 text-sm">{{ log.date?.toDate().toLocaleDateString() }}</td>
                        <td class="px-4 py-2 text-sm capitalize" :class="log.type === 'add' ? 'text-green-500' : 'text-red-500'">{{ log.type }}</td>
                        <td class="px-4 py-2 text-sm">{{ log.remark || log.checkNumber || log.withdrawType }}</td>
                        <td class="px-4 py-2 text-sm text-right">{{ formatCurrency(log.amount) }}</td>
                        <td class="px-4 py-2 text-center">
                            <button v-if="log.imageUrl" @click="previewImage = log.imageUrl" class="text-indigo-500 hover:underline text-xs">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Image Preview Modal -->
    <div v-if="previewImage" @click="previewImage = null" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
        <img :src="previewImage" class="max-w-full max-h-full rounded-lg">
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePettyCashStore } from '@/stores/transactions/pettycash';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/users';

const pettyCashStore = usePettyCashStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const selectedLocation = ref('');
const openingBalanceAmount = ref(0);
const addCashAmount = ref(0);
const checkNumber = ref('');
const withdrawAmount = ref(0);
const withdrawRemark = ref('');
const withdrawType = ref('TRAVELLING');
const fromDate = ref(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
const toDate = ref(new Date().toISOString().split('T')[0]);
const selectedFile = ref(null);
const previewImage = ref(null);

const withdrawalTypes = ['TRAVELLING', 'UNLOADING', 'STATIONARY', 'STAFF WELFARE', 'MAINTAIN', 'OTHER'];

let unsubscribe;

const allowedLocations = computed(() => {
    if (!authStore.user || !Array.isArray(pettyCashStore.locations)) return [];
    
    const firebaseUser = userStore.firebaseUsers.find(u => u.apiUser === authStore.user.Username);
    if (firebaseUser && firebaseUser.locations) {
        return pettyCashStore.locations.filter(loc => firebaseUser.locations.includes(loc.id));
    }
    return [];
});

const closingBalance = computed(() => {
    return pettyCashStore.pettyCashBalances[selectedLocation.value] || 0;
});

const totalAdditions = computed(() => {
    if (!Array.isArray(pettyCashStore.transactionLog)) return 0;
    return pettyCashStore.transactionLog
        .filter(log => log.type === 'add')
        .reduce((sum, log) => sum + log.amount, 0);
});

const totalWithdrawals = computed(() => {
    if (!Array.isArray(pettyCashStore.transactionLog)) return 0;
    return pettyCashStore.transactionLog
        .filter(log => log.type === 'withdraw')
        .reduce((sum, log) => sum + log.amount, 0);
});

const openingBalance = computed(() => {
    return closingBalance.value - totalAdditions.value + totalWithdrawals.value;
});

const handleSetOpeningBalance = async () => {
  if (selectedLocation.value && openingBalanceAmount.value >= 0) {
    await pettyCashStore.setOpeningBalance(selectedLocation.value, openingBalanceAmount.value);
    await pettyCashStore.fetchTransactionLog(selectedLocation.value, fromDate.value, toDate.value);
    openingBalanceAmount.value = 0;
  }
};

const handleAddCash = async () => {
  if (selectedLocation.value && addCashAmount.value > 0 && checkNumber.value) {
    await pettyCashStore.addPettyCash(selectedLocation.value, addCashAmount.value, checkNumber.value);
    await pettyCashStore.fetchTransactionLog(selectedLocation.value, fromDate.value, toDate.value);
    addCashAmount.value = 0;
    checkNumber.value = '';
  }
};

const handleFileSelect = (event) => {
    selectedFile.value = event.target.files[0];
};

const handleWithdraw = async () => {
  if (selectedLocation.value && withdrawAmount.value > 0 && withdrawRemark.value) {
    await pettyCashStore.withdrawPettyCash(
        selectedLocation.value, 
        withdrawAmount.value, 
        withdrawType.value, 
        withdrawRemark.value, 
        selectedFile.value
    );
    await pettyCashStore.fetchTransactionLog(selectedLocation.value, fromDate.value, toDate.value);
    withdrawAmount.value = 0;
    withdrawRemark.value = '';
    selectedFile.value = null;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

watch([selectedLocation, fromDate, toDate], ([loc, from, to]) => {
    if (loc && from && to) {
        pettyCashStore.fetchTransactionLog(loc, from, to);
    }
}, { immediate: true });

onMounted(() => {
  pettyCashStore.fetchLocationsFromFirebase();
  userStore.fetchFirebaseUsers().then(() => {
      if (allowedLocations.value.length > 0) {
          selectedLocation.value = allowedLocations.value[0].id;
      }
  });
  unsubscribe = pettyCashStore.subscribeToBalances();
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>
