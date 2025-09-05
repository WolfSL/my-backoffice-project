<template>
  <MainLayout>
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Stock Taking</h1>
      </div>

      <div class="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-lg">
        <!-- Header Controls -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select v-model="selectedLocation"
            class="px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 rounded-md">
            <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}
            </option>
          </select>
          <button @click="initializeStock" :disabled="stockStore.isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {{ stockStore.isLoading ? 'Initializing...' : 'Initialize Stock' }}
          </button>
          <button @click="isUploadModalOpen = true"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Upload QB Stock
          </button>
          <!-- MODIFIED: Added View Stock Variance button -->
          <button @click="openVarianceReport"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            View Stock Variance
          </button>
        </div>

        <!-- Status & Date Selector -->
        <div v-if="stockStore.initializationStatus" class="mb-6 p-4 rounded-md"
          :class="isInitDateValid ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'">
          <p class="font-semibold"
            :class="isInitDateValid ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'">
            Stock Initialized on: {{ formattedInitTime }}
          </p>
          <p v-if="!isInitDateValid" class="text-sm text-red-700 dark:text-red-400 mt-1">
            Cannot take stock for this date. Please process the previous stock take and re-initialize.
          </p>
          <div v-else class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Stock Date</label>
            <input v-model="stockDate" type="date"
              class="mt-1 px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 rounded-md">
          </div>
        </div>

        <!-- Stock Taking Form -->
        <div v-if="isInitDateValid" class="border-t dark:border-slate-700 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div class="md:col-span-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Item</label>
              <div class="flex items-center mt-1">
                <input ref="barcodeInput" type="text" v-model="barcode" @keydown.enter.prevent="handleBarcodeEnter"
                  placeholder="Scan or type barcode..."
                  class="w-full px-3 py-2 rounded-l-md border-r-0 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600">
                <button @click="isItemModalOpen = true"
                  class="p-2.5 bg-gray-200 dark:bg-slate-600 rounded-r-md hover:bg-gray-300 dark:hover:bg-slate-500">...</button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select v-model="stockType" class="mt-1 w-full px-3 py-2 rounded-md dark:bg-slate-700 dark:border-slate-600">
                <option>NORMAL</option>
                <option>FOC</option>
                <option>ADJ</option>
                <option>REPLACE</option>
                <option>DAMAGE</option>
                <option>RETURN</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input ref="qtyInput" v-model.number="quantity" @keydown.enter.prevent="addStockTake" type="number"
                class="mt-1 w-full px-3 py-2 rounded-md dark:bg-slate-700 dark:border-slate-600">
            </div>
            <div class="md:col-span-2">
                 <button @click="addStockTake" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 h-10">Add</button>
            </div>
          </div>
          <p v-if="selectedItem" class="text-sm mt-2 text-green-600 dark:text-green-400">Selected: {{ selectedItem.Description }}
          </p>
        </div>

        <!-- Stock Take Table -->
        <div v-if="isInitDateValid" class="mt-6 overflow-x-auto">
          <div v-if="stockStore.isLoading" class="text-center py-10">
            <p>Loading stock take data...</p>
          </div>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Count</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="item in stockStore.stockTakeList" :key="item.id" :class="getRowClass(item)">
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.ItemCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.Description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.Comments }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right">{{ item.Count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.StkUser }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ new Date(item.time).toLocaleTimeString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </MainLayout>

  <!-- Item Search Modal -->
  <div v-if="isItemModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Search Item</h2>
        <input v-model="itemSearch" @input="searchItems" type="text" placeholder="Search by code or description..."
          class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto">
        <ul>
          <li v-for="item in stockStore.searchedItems" :key="item.itemCode" @click="selectItem(item)"
            class="py-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ item.itemDes }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.itemCode }} | SIH: {{ item.sih }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isItemModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
      </div>
    </div>
  </div>

  <!-- Upload QB Stock Modal -->
  <div v-if="isUploadModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col">
          <div class="p-5 border-b dark:border-slate-700">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Upload QB Stock</h2>
          </div>
          <div class="p-6 space-y-4">
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <select v-model="uploadLocation" class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 rounded-md">
                      <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}</option>
                  </select>
              </div>
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock Date</label>
                  <input type="date" v-model="uploadStockDate" class="mt-1 w-full px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600 rounded-md">
              </div>
              <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Excel File</label>
                  <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              </div>
              <div v-if="excelData.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ excelData.length }} records found in the Excel file.
              </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end space-x-4">
              <button @click="isUploadModalOpen = false" class="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-md">Cancel</button>
              <button @click="handleUpload" :disabled="!excelData.length || stockStore.isUploading" class="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-green-400">
                  {{ stockStore.isUploading ? 'Uploading...' : 'Upload' }}
              </button>
          </div>
      </div>
  </div>
  
  <!-- MODIFIED: Added Stock Variance Modal -->
  <StockVarianceModal 
    v-if="isVarianceModalOpen" 
    :location="selectedLocation" 
    :date="stockDate" 
    @close="isVarianceModalOpen = false" 
  />
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import StockVarianceModal from '@/components/StockVarianceModal.vue';
import { useStockStore } from '@/stores/transactions/stock';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';

const stockStore = useStockStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();

const selectedLocation = ref(authStore.user?.LocationCode || '');
const stockDate = ref(new Date().toISOString().split('T')[0]);

const barcode = ref('');
const stockType = ref('NORMAL');
const quantity = ref(null);
const selectedItem = ref(null);
const isItemModalOpen = ref(false);
const itemSearch = ref('');
const qtyInput = ref(null);
const barcodeInput = ref(null);

const isUploadModalOpen = ref(false);
const uploadLocation = ref(authStore.user?.LocationCode || '');
const uploadStockDate = ref(new Date().toISOString().split('T')[0]);
const excelData = ref([]);

const isVarianceModalOpen = ref(false);

const isInitDateValid = computed(() => {
  if (!stockStore.initializationStatus?.initTIme) return false;
  const initDate = new Date(stockStore.initializationStatus.initTIme);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return initDate >= sevenDaysAgo;
});

const formattedInitTime = computed(() => {
  if (!stockStore.initializationStatus?.initTIme) return 'N/A';
  return new Date(stockStore.initializationStatus.initTIme).toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
});

const getRowClass = (item) => {
    if (item.Comments !== 'NORMAL') {
        return 'bg-blue-50 dark:bg-blue-900/50';
    }
    return '';
};

const initializeStock = () => {
  stockStore.initializeStock(selectedLocation.value);
};

const fetchTakenStock = () => {
  stockStore.fetchStockTake(selectedLocation.value, stockDate.value);
};

const handleLocationChange = () => {
  stockStore.initializationStatus = null;
  stockStore.stockTakeList = [];
  fetchTakenStock();
};

const handleBarcodeEnter = async () => {
  if (!barcode.value) return;
  const item = await stockStore.getItemByBarcode(barcode.value, selectedLocation.value);
  if (item) {
    selectedItem.value = item;
    await nextTick();
    qtyInput.value?.focus();
  } else {
    alert('Item not found!');
    selectedItem.value = null;
  }
};

const searchItems = () => {
  stockStore.searchItems(selectedLocation.value, itemSearch.value || '-1');
};

const selectItem = (item) => {
  selectedItem.value = {
    ItemCode: item.itemCode,
    Description: item.itemDes
  };
  barcode.value = item.itemCode;
  isItemModalOpen.value = false;
};

const addStockTake = async () => {
  if (!selectedItem.value || !quantity.value || quantity.value <= 0) {
    alert('Please select an item and enter a valid quantity.');
    return;
  }
  await stockStore.saveStockTake(
    selectedItem.value.ItemCode,
    selectedLocation.value,
    quantity.value,
    stockDate.value,
    stockType.value
  );
  // Reset form and focus barcode input
  barcode.value = '';
  selectedItem.value = null;
  quantity.value = null;
  await nextTick();
  barcodeInput.value?.focus();
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ["Description", "Qty"] });
        if (jsonData[0] && jsonData[0].Description === 'Item Name' && jsonData[0].Qty === 'Qty') {
            jsonData.shift();
        }
        excelData.value = jsonData;
    };
    reader.readAsArrayBuffer(file);
};

const handleUpload = async () => {
    if (excelData.value.length === 0) {
        alert("No data found in the Excel file.");
        return;
    }
    const payload = {
        Location: uploadLocation.value,
        StkDate: uploadStockDate.value,
        UploadUser: authStore.user.Username,
        Items: excelData.value
    };
    await stockStore.uploadQbStock(payload);
    isUploadModalOpen.value = false;
    excelData.value = [];
};

const openVarianceReport = () => {
    isVarianceModalOpen.value = true;
};

watch(selectedLocation, () => {
    handleLocationChange();
});

watch(stockDate, () => {
    fetchTakenStock();
});

onMounted(() => {
  mastersStore.fetchLocations();
});
</script>
