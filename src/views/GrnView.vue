<template>
    <MainLayout>
        <div class="container mx-auto">
            <div v-if="grnStore.isLoading" class="text-center py-20">
                <p class="dark:text-gray-400">Loading GRN...</p>
            </div>
            <div v-else-if="grnStore.error" class="text-center py-20 text-red-500">
                <p>{{ grnStore.error }}</p>
                <router-link to="/transactions/grn" class="mt-4 inline-block text-indigo-500 hover:underline">Go
                    Back</router-link>
            </div>
            <div v-else-if="grnStore.activeGRN">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? `Edit GRN
                        #${grnStore.activeGRN.TNo}` : 'New GRN' }}</h1>
                    <router-link to="/transactions/grn"
                        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        Back to List
                    </router-link>
                </div>

                <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <!-- GRN Header -->
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium">GRN No.</label>
                            <input v-model="grnStore.activeGRN.TNo" type="text" readonly
                                class="mt-1 w-full px-2 py-1.5 bg-gray-100">
                        </div>
                        <div>
                            <label class="block text-sm font-medium">GRN Date</label>
                            <input v-model="grnStore.activeGRN.TDate" type="date" class="mt-1 w-full px-2 py-1.5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Purchase Order No.</label>
                            <button @click="openPoModal" class="mt-1 w-full text-left px-3 py-2 border rounded-md">
                                {{ grnStore.activeGRN.OrdNo || 'Select PO' }}
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Location</label>
                            <button @click="isLocationModalOpen = true"
                                class="mt-1 w-full text-left px-3 py-2 border rounded-md">
                                {{ selectedLocationName || 'Select Location' }}
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Supplier</label>
                            <button @click="isSupplierModalOpen = true"
                                class="mt-1 w-full text-left px-3 py-2 border rounded-md">
                                {{ selectedSupplierName || 'Select Supplier' }}
                            </button>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Invoice No.</label>
                            <input v-model="grnStore.activeGRN.InNo" type="text" class="mt-1 w-full px-2 py-1.5">
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Invoice Date</label>
                            <input v-model="grnStore.activeGRN.InDate" type="date" class="mt-1 w-full px-2 py-1.5">
                        </div>
                    </div>

                    <!-- GRN Items -->
                    <div class="mt-8">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-semibold">GRN Items</h2>
                            <button @click="isItemSelectorOpen = true"
                                class="px-4 py-2 bg-green-600 text-white rounded-md">Add Item</button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full">
                                <!-- Table for items will go here -->
                            </table>
                        </div>
                    </div>

                    <div class="flex justify-end mt-8">
                        <button @click="handleSave" :disabled="grnStore.isSubmitting"
                            class="px-6 py-2 bg-indigo-600 text-white rounded-md">
                            {{ grnStore.isSubmitting ? 'Saving...' : 'Save GRN' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>

    <!-- Item Selector Modal -->
    <div v-if="isItemSelectorOpen"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
            <div class="p-5 border-b">
                <h2 class="text-xl font-bold">Select Item</h2>
                <input v-model="itemSearch" @input="searchItems" type="text" placeholder="Search for items..."
                    class="w-full mt-2 p-2 border rounded">
            </div>
            <div class="p-4 overflow-y-auto">
                <ul>
                    <li v-for="item in mastersStore.transactionItems" :key="item.ItemCode" @click="selectItem(item)"
                        class="p-2 hover:bg-gray-100 cursor-pointer">
                        {{ item.ItemDescription }}
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- ADD THESE MODALS -->
    <div v-if="isLocationModalOpen"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
            <div class="p-5 border-b dark:border-slate-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Location</h2>
                <input v-model="locationSearch" type="text" placeholder="Search locations..."
                    class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            </div>
            <div class="p-6 overflow-y-auto">
                <ul>
                    <li v-for="loc in filteredLocations" :key="loc.locCode" @click="selectLocation(loc)"
                        class="py-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ loc.locName }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ loc.master }}</p>
                    </li>
                </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
                <button @click="isLocationModalOpen = false"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
            </div>
        </div>
    </div>
    <div v-if="isSupplierModalOpen"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
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
                <button @click="isSupplierModalOpen = false"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
            </div>
        </div>
    </div>

    <!-- ADD THIS MODAL -->
    <div v-if="isPoModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
            <div class="p-5 border-b">
                <h2 class="text-xl font-bold">Select Purchase Order</h2>
            </div>
            <div class="p-4 overflow-y-auto">
                <table class="min-w-full">
                    <thead>
                        <tr>
                            <th class="text-left">PO No</th>
                            <th class="text-left">Date</th>
                            <th class="text-left">Supplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="po in poStore.purchaseOrders" :key="po.uniqueId" @click="selectPO(po)"
                            class="cursor-pointer hover:bg-gray-100">
                            <td>{{ po.PONo }}</td>
                            <td>{{ new Date(po['PO Date']).toLocaleDateString() }}</td>
                            <td>{{ po.Supplier }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
            <button @click="isPoModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { useGrnStore } from '@/stores/transactions/grn';
import { useMastersStore } from '@/stores/masters';
import { usePoStore } from '@/stores/transactions/po';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const grnStore = useGrnStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();
const poStore = usePoStore();

const isItemSelectorOpen = ref(false);
const itemSearch = ref('');
const isLocationModalOpen = ref(false);
const locationSearch = ref('');
const isSupplierModalOpen = ref(false);
const supplierSearch = ref('');
const isPoModalOpen = ref(false);


const isEditing = computed(() => !!route.params.tNo);

const handleSave = async () => {
    const savedTNo = await grnStore.saveGRN();
    if (savedTNo && !isEditing.value) {
        router.push(`/transactions/grn/edit/${savedTNo}/${grnStore.activeGRN.Loc}`);
    }
};

const searchItems = () => {
    mastersStore.fetchItemsForTransactions(itemSearch.value, grnStore.activeGRN.Loc);
};

const selectItem = (item) => {
    // Logic to add item to GRN details will go here
    isItemSelectorOpen.value = false;
};

const selectedLocationName = computed(() => {
    if (!grnStore.activeGRN?.Loc) return '';
    const location = mastersStore.locations.find(l => l.locCode === grnStore.activeGRN.Loc);
    return location?.locName || '';
});

const selectedSupplierName = computed(() => {
    if (!grnStore.activeGRN?.SupCode) return '';
    const supplier = mastersStore.suppliers.find(s => s.id === grnStore.activeGRN.SupCode);
    return supplier?.Descreption || '';
});

const filteredLocations = computed(() => {
    if (!locationSearch.value) return mastersStore.locations;
    return mastersStore.locations.filter(l =>
        l.locName.toLowerCase().includes(locationSearch.value.toLowerCase())
    );
});

const filteredSuppliers = computed(() => {
    if (!supplierSearch.value) return mastersStore.suppliers;
    return mastersStore.suppliers.filter(s =>
        s.Descreption.toLowerCase().includes(supplierSearch.value.toLowerCase())
    );
});

const selectLocation = (location) => {
    if (grnStore.activeGRN) {
        grnStore.activeGRN.Loc = location.locCode;
    }
    isLocationModalOpen.value = false;
};

const selectSupplier = (supplier) => {
    if (grnStore.activeGRN) {
        grnStore.activeGRN.SupCode = supplier.id;
    }
    isSupplierModalOpen.value = false;
};

const openPoModal = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    const toDate = new Date().toISOString().split('T')[0];

    poStore.fetchPurchaseOrders(
        'Date',
        authStore.user.LocationCode,
        grnStore.activeGRN.Loc,
        fromDate,
        toDate
    );
    isPoModalOpen.value = true;
};

const selectPO = (po) => {
    if (grnStore.activeGRN) {
        grnStore.activeGRN.OrdNo = po.PONo;
        // You might want to auto-fill other fields here, like supplier
        grnStore.activeGRN.SupCode = mastersStore.suppliers.find(s => s.Descreption === po.Supplier)?.id || '';
    }
    isPoModalOpen.value = false;
};

onMounted(() => {
    const { tNo, loc } = route.params;
    grnStore.initializeGRN(tNo, loc);
    mastersStore.fetchLocations();
    mastersStore.fetchSuppliers();
});
</script>
