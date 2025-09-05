<template>
  <MainLayout>
    <div v-if="poStore.successMessage"
      class="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform translate-x-0">
      {{ poStore.successMessage }}
    </div>
    <div v-if="poStore.operationError"
      class="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform translate-x-0">
      {{ poStore.operationError }}
    </div>

    <div class="container mx-auto">
      <div v-if="poStore.isLoading" class="text-center py-20">
        <p class="dark:text-gray-400">Loading Purchase Order...</p>
      </div>
      <div v-else-if="poStore.error" class="text-center py-20 text-red-500">
        <p>{{ poStore.error }}</p>
        <router-link to="/transactions/purchase-orders" class="mt-4 inline-block text-indigo-500 hover:underline">Go
          Back</router-link>
      </div>
      <div v-else-if="poStore.activePO">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? `Edit Purchase Order
              #${poStore.activePO.grnNo}` : 'New Purchase Order' }}</h1>
            <div class="mt-2 flex items-center">
              <span :class="statusColorClass" class="px-3 py-1 text-xs font-bold text-white rounded-full">
                {{ poStatus }}
              </span>
              <span v-if="poStore.activePO.processedUser" class="text-xs text-gray-500 dark:text-gray-400 ml-4">
                Processed by {{ poStore.activePO.processedUser }} on {{ new
                  Date(poStore.activePO.processedDate).toLocaleDateString() }}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button v-if="isEditing" @click="printPurchaseOrder"
              class="p-2 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <router-link to="/transactions/purchase-orders"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Back to List
            </router-link>
          </div>
        </div>

        <!-- PO Details Form -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 border-b dark:border-slate-700 pb-6 mb-6">
            <!-- Supplier -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
              <button @click="isSupplierModalOpen = true" :disabled="isProcessed"
                class="mt-1 w-full text-left px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-900">
                {{ selectedSupplierName || 'Select a supplier...' }}
              </button>
            </div>
            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <select v-model="poStore.activePO.discode" :disabled="isProcessed"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
                <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}
                </option>
              </select>
            </div>
            <!-- PO Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">PO Number</label>
              <input :value="poStore.activePO.grnNo" type="text" readonly
                class="mt-1 w-full px-2 py-1.5 bg-gray-100 dark:bg-slate-900 dark:border-slate-700">
            </div>
            <!-- Order Period -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Period (Days)</label>
              <input v-model.number="poStore.activePO.poPeriod" :disabled="isProcessed" type="number"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
            </div>
            <!-- PO Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">PO Date</label>
              <input v-model="poStore.activePO.grnDate" :disabled="isProcessed" type="date"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
            </div>
            <!-- Delivery Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Date</label>
              <input v-model="poStore.activePO.dlvDate" :disabled="isProcessed" type="date"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
            </div>
          </div>

          <!-- Supplier Agent Details -->
          <div v-if="poStore.supplierDetails" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Agent</label>
              <input v-model="poStore.supplierDetails.supName" :disabled="isProcessed" type="text"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Agent Email</label>
              <input v-model="poStore.supplierDetails.supAgentMail" :disabled="isProcessed" type="email"
                class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900">
            </div>
            <div class="self-end">
              <button @click="handleUpdateAgent" :disabled="isProcessed"
                class="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-400">Save
                Agent Info</button>
            </div>
          </div>

          <!-- PO Item Details Section -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">PO Items</h2>
              <button @click="isItemSelectorOpen = true" :disabled="isProcessed"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd" />
                </svg>
                Add Item
              </button>
            </div>
            <div class="space-y-4">
              <div v-for="(item, index) in poStore.activePO.grnPrnDets" :key="item.serial"
                class="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg shadow-sm">
                <div class="flex flex-wrap items-start justify-between">
                  <div class="flex-grow pr-8">
                    <h3 class="font-bold text-gray-800 dark:text-gray-200">{{ item.itemCode }}: {{ item.itemDes }}</h3>
                    <div class="flex items-center mt-2 text-xs space-x-4">
                      <div>
                        <label class="font-semibold text-gray-500">Last Purch Date:</label>
                        <p class="dark:text-gray-300">{{ formatDate(item.lpd) }}</p>
                      </div>
                      <div>
                        <label class="font-semibold text-gray-500">Last Purch Qty/Cost:</label>
                        <p class="dark:text-gray-300">{{ item.lpq || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4 flex-shrink-0">
                    <div class="grid grid-cols-4 gap-x-4 gap-y-1 text-xs text-center">
                      <span class="text-gray-500">SIH</span>
                      <span class="text-gray-500">Avg/Day</span>
                      <span class="text-gray-500">Next Period</span>
                      <span class="text-gray-500">Predicted</span>
                      <p class="font-semibold dark:text-gray-300">{{ item.sih || 0 }}</p>
                      <p class="font-semibold dark:text-gray-300">{{ (item.avgDay || 0).toFixed(2) }}</p>
                      <p class="font-semibold dark:text-gray-300">{{ ((poStore.activePO.poPeriod || 0) * (item.avgDay
                        || 0)).toFixed(2) }}</p>
                      <p class="font-semibold dark:text-gray-300">{{ calculatePredictedQty(item) }}</p>
                    </div>
                    <div class="pl-4">
                      <label class="text-sm font-bold text-gray-700 dark:text-gray-300 text-center block mb-1">Order
                        Qty</label>
                      <input :ref="el => qtyInputs[index] = el" v-model.number="item.itQty" :disabled="isProcessed"
                        type="number" @change="updateItemAmount(item)" @keydown.enter.prevent="focusNextQtyInput(index)"
                        class="w-24 text-center font-bold text-lg dark:bg-slate-800 dark:border-slate-600 rounded-md disabled:bg-gray-100 dark:disabled:bg-slate-900">
                    </div>
                  </div>
                  <div class="flex flex-col items-center justify-start ml-4">
                    <button @click="toggleItemDetails(item.serial)"
                      class="text-gray-500 hover:text-indigo-600 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    <button @click="poStore.removeItemFromPO(item.itemCode)" :disabled="isProcessed"
                      class="text-gray-500 hover:text-red-500 p-1 rounded-full mt-1 disabled:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div v-if="expandedItemSerial === item.serial"
                  class="mt-4 pt-3 border-t border-gray-200 dark:border-slate-600">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <label class="font-semibold text-gray-500">Buffer Days:</label>
                      <p class="dark:text-gray-300">{{ item.bufdays || 0 }}</p>
                    </div>
                    <div>
                      <label class="font-semibold text-gray-500">Buffer Qty:</label>
                      <p class="dark:text-gray-300">{{ ((item.bufdays || 0) * (item.avgDay || 0)).toFixed(2) }}</p>
                    </div>
                    <div>
                      <label class="font-semibold text-gray-500">Unit Price:</label>
                      <input v-model.number="item.unitPrice" :disabled="isProcessed" type="number"
                        @change="updateItemAmount(item)"
                        class="w-24 text-right dark:bg-slate-800 dark:border-slate-600 rounded-md disabled:bg-gray-100 dark:disabled:bg-slate-900">
                    </div>
                    <div>
                      <label class="font-semibold text-gray-500">Total Amount:</label>
                      <p class="dark:text-gray-300 font-bold">{{ formatCurrency(item.amount) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!poStore.activePO.grnPrnDets || poStore.activePO.grnPrnDets.length === 0"
                class="text-center py-10 text-gray-500 dark:text-gray-400">
                No items added yet. Use the "Add Item" button to begin.
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
            <textarea v-model="poStore.activePO.remarks" :disabled="isProcessed" rows="3"
              class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 disabled:bg-gray-100 dark:disabled:bg-slate-900"></textarea>
          </div>

          <div class="mt-8 pt-6 border-t dark:border-slate-700">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Total Quantity</label>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalPoQty }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Total Literage</label>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ totalPoLiterage.toFixed(2) }} L</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</label>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalPoAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-8">
            <button v-if="!isEditing" @click="handleSave(true)" :disabled="poStore.isSubmitting"
              class="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300">
              {{ poStore.isSubmitting ? 'Processing...' : 'Auto-Generate PO' }}
            </button>
            <button v-if="poStore.activePO.status === 'D'" @click="handleSave(false)" :disabled="poStore.isSubmitting"
              class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
              {{ poStore.isSubmitting ? 'Saving...' : (isEditing ? 'Update Draft' : 'Save as Draft') }}
            </button>
            <button v-if="isEditing && poStore.activePO.status === 'D'" @click="poStore.approvePurchaseOrder()"
              :disabled="poStore.isSubmitting"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
              {{ poStore.isSubmitting ? 'Approving...' : 'Approve' }}
            </button>
            <button v-if="isEditing && poStore.activePO.status === 'A'" @click="poStore.processPurchaseOrder()"
              :disabled="poStore.isSubmitting"
              class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400">
              {{ poStore.isSubmitting ? 'Processing...' : 'Process' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>

  <div v-if="isSupplierModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Supplier</h2>
        <input v-model="supplierSearch" type="text" placeholder="Search suppliers..."
          class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto">
        <ul>
          <li v-for="sup in filteredSuppliers" :key="sup.id" @click="selectSupplier(sup)"
            class="py-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ sup.Descreption }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ sup.Address }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isSupplierModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
      </div>
    </div>
  </div>

  <div v-if="isItemSelectorOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select PO Item</h2>
        <input v-model="itemSearchText" @input="searchItems" type="text" placeholder="Search for items..."
          class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto">
        <ul>
          <li v-for="item in mastersStore.transactionItems" :key="item.ItemCode" @click="selectItem(item)"
            class="py-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ item.ItemDescription }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.ItemCode }} | Cost: {{
              formatCurrency(item.cost) }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isItemSelectorOpen = false"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
      </div>
    </div>
  </div>
  
  <div v-if="isCeftModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
          <div class="p-5 border-b dark:border-slate-700">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">CEFT Transfer Details</h2>
          </div>
          <div class="p-6 overflow-y-auto space-y-4">
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                  <input v-model.number="ceftDetails.amount" type="number" class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
              </div>
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Value Date</label>
                  <input v-model="ceftDetails.date" type="date" class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
              </div>
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reference Code</label>
                  <input v-model="ceftDetails.refCode" type="text" class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
              </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right flex justify-between items-center">
              <button @click="isCeftModalOpen = false" class="px-4 py-2 bg-gray-600 text-white rounded-md">Cancel</button>
              <button @click="generateCeftPdf" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Print CEFT PDF</button>
          </div>
      </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePoStore } from '@/stores/transactions/po';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const poStore = usePoStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();

const isSupplierModalOpen = ref(false);
const supplierSearch = ref('');
const isItemSelectorOpen = ref(false);
const itemSearchText = ref('');
const expandedItemSerial = ref(null);
const qtyInputs = ref([]);
const isCustomMenuOpen = ref(false);
const isCeftModalOpen = ref(false); 

const ceftDetails = ref({
    amount: 0,
    date: new Date().toISOString().substring(0, 10),
    refCode: '',
});

const isEditing = computed(() => !!route.params.poNo);
const isProcessed = computed(() => poStore.activePO?.status === 'P');

const poStatus = computed(() => {
  if (!poStore.activePO) return '';
  switch (poStore.activePO.status) {
    case 'D': return 'Draft';
    case 'A': return 'Approved';
    case 'P': return 'Processed';
    default: return 'Unknown';
  }
});

const statusColorClass = computed(() => {
  if (!poStore.activePO) return 'bg-gray-500';
  switch (poStore.activePO.status) {
    case 'D': return 'bg-yellow-500';
    case 'A': return 'bg-blue-500';
    case 'P': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
});

const selectedSupplier = computed(() => {
    if (!poStore.activePO?.supCode) return null;
    return mastersStore.suppliers.find(s => s.id === poStore.activePO.supCode);
});

const selectedSupplierName = computed(() => {
  return selectedSupplier.value?.Descreption || '';
});

const filteredSuppliers = computed(() => {
  if (!supplierSearch.value) return mastersStore.suppliers;
  return mastersStore.suppliers.filter(s =>
    s.Descreption.toLowerCase().includes(supplierSearch.value.toLowerCase())
  );
});

const totalPoQty = computed(() => {
  return poStore.activePO?.grnPrnDets.reduce((sum, item) => sum + (item.itQty || 0), 0) || 0;
});

const totalPoLiterage = computed(() => {
  const totalMl = poStore.activePO?.grnPrnDets.reduce((sum, item) => {
    const volume = parseFloat(item.locCode) || 0;
    const qty = item.itQty || 0;
    return sum + (volume * qty);
  }, 0) || 0;
  return totalMl / 1000;
});

const totalPoAmount = computed(() => {
  return poStore.activePO?.grnPrnDets.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
});


const selectSupplier = (supplier) => {
  if (poStore.activePO) {
    poStore.activePO.supCode = supplier.id;
  }
  isSupplierModalOpen.value = false;
};

const searchItems = () => {
  const locCode = poStore.activePO?.discode;
  if (locCode) {
    mastersStore.fetchItemsForTransactions(itemSearchText.value, locCode);
  }
};

const selectItem = (item) => {
  poStore.addItemToPO(item);
  isItemSelectorOpen.value = false;
  itemSearchText.value = '';
};

const updateItemAmount = (item) => {
  item.amount = (item.itQty || 0) * (item.unitPrice || 0);
};

const formatCurrency = (value, withSymbol = true) => {
  if (typeof value !== 'number') return 'N/A';
  const options = withSymbol
    ? { style: 'currency', currency: 'LKR' }
    : { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-LK', options).format(value);
};

const formatDate = (dateString) => {
  if (!dateString || dateString.startsWith('2000-01-01')) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US');
};

const calculatePredictedQty = (item) => {
  if (!poStore.activePO || !item) return 0;
  const period = poStore.activePO.poPeriod || 0;
  const bufdays = item.bufdays || 0;
  const avgDay = item.avgDay || 0;
  const sih = item.sih || 0;

  const demand = (period + bufdays) * avgDay;
  const predicted = demand - sih;
  return Math.max(0, predicted).toFixed(2);
};

const toggleItemDetails = (serial) => {
  if (expandedItemSerial.value === serial) {
    expandedItemSerial.value = null;
  } else {
    expandedItemSerial.value = serial;
  }
};

const focusNextQtyInput = (currentIndex) => {
  const nextIndex = currentIndex + 1;
  if (nextIndex < qtyInputs.value.length) {
    qtyInputs.value[nextIndex]?.focus();
  }
};

const handleUpdateAgent = () => {
  if (poStore.activePO && poStore.supplierDetails) {
    poStore.updateSupplierAgent(
      poStore.activePO.discode,
      poStore.activePO.supCode,
      poStore.supplierDetails.supName,
      poStore.supplierDetails.supAgentMail
    );
  }
};

const handleSave = async (isAutoCreate) => {
  if (!poStore.activePO.supCode || !poStore.activePO.discode) {
    poStore.setOperationError('Please select a supplier and location.');
    return;
  }
  await poStore.savePurchaseOrder(isAutoCreate, isEditing.value);
  if (poStore.activePO.grnNo && !isEditing.value) {
    router.replace(`/transactions/purchase-order/edit/${poStore.activePO.grnNo}/${poStore.activePO.discode}/2`);
  }
};

const handleAiFill = () => {
    console.log("Auto-filling order values by AI...");
    alert("AI Auto-fill not yet implemented.");
    isCustomMenuOpen.value = false;
};

const handlePrintCeft = async () => {
    if (!poStore.activePO?.supCode) {
        alert("Please select a supplier first.");
        return;
    }
    await mastersStore.fetchSupplierBankDetails(poStore.activePO.supCode);
    
    ceftDetails.value.amount = totalPoAmount.value;
    ceftDetails.value.refCode = poStore.supplierDetails?.RefCode || selectedSupplier.value?.RefCode || '';

    isCeftModalOpen.value = true;
    isCustomMenuOpen.value = false;
};

const generateCeftPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const po = poStore.activePO;
    const location = mastersStore.locations.find(l => l.locCode === po.discode);
    const supplierBank = mastersStore.supplierBankDetails;

    // --- Header ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(location?.master || 'Company Name', 14, 20);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (location?.PvNo) doc.text(`(PV ${location.PvNo})`, 14, 25);
    const address = location?.Address?.split('\r\n').map(l => l.trim()) || ['Company Address'];
    doc.text(address, 14, 30);

    // --- Bank Details ---
    let y = 50;
    const date = new Date(ceftDetails.value.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.text(date, 14, y);
    y += 10;
    doc.text("The Manager", 14, y); y+=5;
    doc.text(location?.BankName || "Your Bank Name", 14, y); y+=5;
    doc.text(location?.BankAddress || "Your Bank Address", 14, y);

    // --- Title ---
    y += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CEFT TRANSFER', doc.internal.pageSize.getWidth() / 2, y, { align: 'center'});
    
    // --- Transaction Details Table ---
    y += 10;
    const amountInWords = numberToWords.toWords(ceftDetails.value.amount);
    const body = [
        ["Ordering Customer's Name", ":-", location?.master || ''],
        ["Address", ":-", address.join(', ')],
        ["Account No.", ":-", location?.BankAcc || ''],
        ["Amount in figures", ":-", `Rs. ${ceftDetails.value.amount.toFixed(2)}`],
        ["Amount in words", ":-", `${amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1)} Only.`],
        ["Value Date", ":-", date],
        ["Purpose/details of transaction", ":-", "Payment for Purchase"],
    ];
    doc.autoTable({
        startY: y,
        body: body,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: { 1: { cellWidth: 5 }, 2: { cellWidth: 'auto' } },
    });

    // --- Beneficiary Details Table ---
    y = doc.lastAutoTable.finalY + 10;
    const beneficiaryBody = [
        ["Beneficiary's Name", ":-", supplierBank?.beneficiaryName || selectedSupplierName.value],
        ["Bank & Branch Name", ":-", supplierBank?.bankName || ''],
        ["Account No.", ":-", supplierBank?.accountNo || ''],
        ["Reference Code", ":-", ceftDetails.value.refCode ? `${ceftDetails.value.refCode} (Please mention the reference code)`: ''],
    ];
    doc.autoTable({
        startY: y,
        body: beneficiaryBody,
        theme: 'plain',
        styles: { fontSize: 10 },
        columnStyles: { 1: { cellWidth: 5 }, 2: { cellWidth: 'auto' } },
    });

    isCeftModalOpen.value = false;
    doc.save(`CEFT_Transfer_PO_${po.grnNo}.pdf`);
};

const printPurchaseOrder = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const po = poStore.activePO;
  const printWithAmount = window.config?.PO_PRINT_TYPE === 'with_amount';
  const selectedLocation = mastersStore.locations.find(l => l.locCode === po.discode);

  const headerName = (selectedLocation?.master || authStore.companyName || 'Your Company').toString();
  const headerAddressRaw = selectedLocation?.Address || authStore.companyAddress || '';
  const headerAddress = (typeof headerAddressRaw === 'string') ? headerAddressRaw : '';

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(headerName, 14, 20);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const addressLines = headerAddress.split('\r\n').map(line => line.trim());
  doc.text(addressLines, 14, 26);
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PURCHASE ORDER', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`#${po.grnNo}`, 196, 20, { align: 'right' });
  doc.text(po.grnDate, 196, 26, { align: 'right' });

  let y = 55;
  doc.setFont('helvetica', 'bold');
  doc.text('Supplier:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(selectedSupplierName.value, 35, y);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Supplier Email:', 14, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(poStore.supplierDetails?.supAgentMail || 'N/A', 40, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Remark:', 14, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(po.remarks || 'N/A', 35, y + 12);

  y += 20;
  const headers = ['#', 'Description', 'Volume (ML)', 'Qty', 'Literage'];
  if (printWithAmount) {
    headers.push('Unit Price', 'Amount');
  }

  const itemsToPrint = po.grnPrnDets.filter(item => item.itQty > 0);

  const body = itemsToPrint.map((item, index) => {
    const row = [
      index + 1,
      item.itemDes,
      parseFloat(item.locCode).toFixed(3),
      item.itQty.toFixed(2),
      ((parseFloat(item.locCode) * item.itQty) / 1000).toFixed(2)
    ];
    if (printWithAmount) {
      row.push(item.unitPrice.toFixed(2), item.amount.toFixed(2));
    }
    return row;
  });

  const filteredQty = itemsToPrint.reduce((sum, item) => sum + (item.itQty || 0), 0);
  const filteredLiterage = itemsToPrint.reduce((sum, item) => sum + ((parseFloat(item.locCode) * (item.itQty || 0)) / 1000), 0);
  const filteredAmount = itemsToPrint.reduce((sum, item) => sum + (item.amount || 0), 0);

  const footerRow = [['', '', 'Total', filteredQty.toFixed(2), filteredLiterage.toFixed(2)]];
  if (printWithAmount) {
    footerRow[0].push('', formatCurrency(filteredAmount, false));
  }
   
  doc.autoTable({
    startY: y,
    head: [headers],
    body: body,
    foot: footerRow,
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: 20 },
    footStyles: { fontStyle: 'bold', halign: 'right' },
    styles: { fontSize: 8 },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    }
  });

  // --- Footer ---
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  doc.text(`Prepared by: ${po.createUser || 'N/A'}`, 14, footerY);

  if (po.status === 'A' || po.status === 'P') {
    const approvedText = `Approved by: ${po.updateuser || 'N/A'}`;
    const approvedDate = po.updatedate ? ` on ${formatDate(po.updatedate)}` : '';
    doc.text(approvedText + approvedDate, 75, footerY);
  }
  
  if (po.status === 'P') {
    const processedText = `Processed by: ${po.processedUser || 'N/A'}`;
    const processedDate = po.processedDate ? ` on ${formatDate(po.processedDate)}` : '';
    doc.text(processedText + processedDate, 140, footerY);
  }
  
  const finalY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(new Date().toLocaleString(), 14, finalY);
  doc.text('Powered by: Caspersoft', 196, finalY, { align: 'right' });


  doc.save(`PO_${po.grnNo}.pdf`);
};

const handleEmailPO = () => {
    if (poStore.activePO.status !== 'P') {
        poStore.setOperationError('You can only email a Processed Purchase Order.');
        return;
    }
    const doc = generatePoPdfDocument();
    const pdfBlob = doc.output('blob');
    poStore.emailPurchaseOrder(pdfBlob);
};

watch(
  () => route.params,
  (newParams, oldParams) => {
      if(newParams.poNo !== oldParams.poNo) {
        poStore.initializePO(newParams.poNo, newParams.disCode, newParams.docType);
      }
  },
  { deep: true }
);

watch(
  () => [poStore.activePO?.supCode, poStore.activePO?.discode],
  ([supCode, locCode]) => {
    if (supCode && locCode) {
      poStore.fetchSupplierDetails(locCode, supCode);
    } else {
      poStore.supplierDetails = null;
    }
  },
  { deep: true }
);

onMounted(() => {
  mastersStore.fetchSuppliers();
  mastersStore.fetchLocations();
  const { poNo, disCode, docType } = route.params;
  poStore.initializePO(poNo, disCode, docType);
});

onUnmounted(() => {
  poStore.clearActivePO();
});
</script>
<script>
export default {
  name: 'PurchaseOrderView',
  props: {
    poNo: String,
    disCode: String,
    docType: String
  }
}
</script>
