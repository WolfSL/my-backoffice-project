<template>
  <MainLayout>
    <div v-if="successMessage" class="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ successMessage }}
    </div>
    <div v-if="operationError" class="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ operationError }}
    </div>

    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Suppliers</h1>
        <button @click="openAddModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Supplier
        </button>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <input v-model="searchName" type="text" placeholder="Search by name..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="searchAddress" type="text" placeholder="Search by address..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <select v-model="statusFilter" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div v-if="mastersStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading suppliers...</p></div>
        <div v-else-if="mastersStore.error" class="text-center py-10 text-red-500 flex-grow">{{ mastersStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ supplier.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ supplier.Descreption }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ supplier.Address }}</td>
                <td class="px-6 py-4 whitespace-nowrap"><span :class="supplier.ActiveStatus ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">{{ supplier.ActiveStatus ? 'Active' : 'Inactive' }}</span></td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ supplier.CreatUser }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button @click="openEditModal(supplier)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                  <button @click="openDeleteModal(supplier)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
              <tr v-if="filteredSuppliers.length === 0"><td colspan="6" class="text-center py-10 text-gray-500 dark:text-gray-400">No suppliers match your criteria.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <div v-if="isAddModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center"><h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Add New Supplier</h2><button @click="isAddModalOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button></div>
      <form @submit.prevent="handleAddNewSupplier" class="p-6 overflow-y-auto space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Code</label><div class="mt-1 relative rounded-md shadow-sm"><input v-model="newSupplier.SupplierCode" type="text" required class="block w-full pr-20 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><button @click="getNextSupplierCode" type="button" class="absolute inset-y-0 right-0 px-4 border-l dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-r-md">Get Next</button></div></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name / Surname</label><input v-model="newSupplier.Surname" type="text" required class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label><input v-model="newSupplier.Address" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telephone No.</label><input v-model="newSupplier.TPNo" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><p v-if="validationErrors.phone" class="text-xs text-red-600 mt-1">{{ validationErrors.phone }}</p></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label><input v-model="newSupplier.Contactperson" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input v-model="newSupplier.Email" type="email" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email }}</p></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Credit Limit</label><input v-model.number="newSupplier.CreditLimit" type="number" step="0.01" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Terms (Days)</label><input v-model.number="newSupplier.Terms" type="number" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Number</label><input v-model="newSupplier.Tax_number" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div class="flex items-center"><input v-model="newSupplier.ActiveStatus" id="activeStatus" type="checkbox" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"><label for="activeStatus" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label></div>
        <div v-if="mastersStore.operationError" class="text-red-500 text-sm">{{ mastersStore.operationError }}</div>
      </form>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isAddModalOpen = false" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md mr-2">Cancel</button>
        <button @click="handleAddNewSupplier" :disabled="mastersStore.isAdding" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">{{ mastersStore.isAdding ? 'Saving...' : 'Save Supplier' }}</button>
      </div>
    </div>
  </div>

  <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center"><h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Edit Supplier</h2><button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button></div>
      <form @submit.prevent="handleUpdateSupplier" class="p-6 overflow-y-auto space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier Code</label><input :value="editingSupplier.SupplierCode" type="text" readonly class="mt-1 bg-gray-100 dark:bg-slate-700 px-2 py-1"></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name / Surname</label><input v-model="editingSupplier.Surname" type="text" required class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label><input v-model="editingSupplier.Address" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telephone No.</label><input v-model="editingSupplier.TPNo" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><p v-if="validationErrors.phone" class="text-xs text-red-600 mt-1">{{ validationErrors.phone }}</p></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label><input v-model="editingSupplier.Contactperson" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input v-model="editingSupplier.Email" type="email" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email }}</p></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Credit Limit</label><input v-model.number="editingSupplier.CreditLimit" type="number" step="0.01" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Terms (Days)</label><input v-model.number="editingSupplier.Terms" type="number" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
            <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax Number</label><input v-model="editingSupplier.Tax_number" type="text" class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div class="flex items-center"><input v-model="editingSupplier.ActiveStatus" id="editActiveStatus" type="checkbox" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"><label for="editActiveStatus" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label></div>
        <div v-if="mastersStore.operationError" class="text-red-500 text-sm">{{ mastersStore.operationError }}</div>
      </form>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isEditModalOpen = false" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md mr-2">Cancel</button>
        <button @click="handleUpdateSupplier" :disabled="mastersStore.isUpdating" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">{{ mastersStore.isUpdating ? 'Saving...' : 'Save Changes' }}</button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">Delete Supplier</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this supplier? This action cannot be undone.</p>
          <p v-if="supplierToDelete" class="mt-2 font-semibold text-gray-700 dark:text-gray-300">{{ supplierToDelete.Descreption }}</p>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button @click="handleDeleteSupplier" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
        <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const mastersStore = useMastersStore();
const authStore = useAuthStore();
const { successMessage, operationError } = storeToRefs(mastersStore);

const searchName = ref('');
const searchAddress = ref('');
const statusFilter = ref('all');
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const validationErrors = ref({});
const supplierToDelete = ref(null);

const defaultSupplier = () => ({
  SupplierCode: '', Surname: '', Address: '', Contactperson: '', TPNo: '', Email: '',
  CreditLimit: 0, Terms: 0, Tax_number: '', CreatUser: authStore.displayName, ActiveStatus: true
});

const newSupplier = ref(defaultSupplier());
const editingSupplier = ref(null);

const openAddModal = () => {
  newSupplier.value = defaultSupplier();
  validationErrors.value = {};
  isAddModalOpen.value = true;
};

const openEditModal = (supplier) => {
  editingSupplier.value = JSON.parse(JSON.stringify({
    SupplierCode: supplier.id, Surname: supplier.Descreption, Address: supplier.Address,
    Contactperson: supplier.Contactperson || '', TPNo: supplier.TPNo || '', Email: supplier.Email || '',
    CreditLimit: supplier.CreditLimit || 0, Terms: supplier.Terms || 0, Tax_number: supplier.Tax_number || '',
    ActiveStatus: supplier.ActiveStatus
  }));
  validationErrors.value = {};
  isEditModalOpen.value = true;
};

const openDeleteModal = (supplier) => {
  supplierToDelete.value = supplier;
  isDeleteModalOpen.value = true;
};

const getNextSupplierCode = () => {
  const maxId = mastersStore.suppliers.reduce((max, s) => {
    const idNum = parseInt(s.id, 10);
    return !isNaN(idNum) && idNum > max ? idNum : max;
  }, 0);
  newSupplier.value.SupplierCode = (maxId + 1).toString().padStart(3, '0');
};

const validateForm = (supplier) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9\s+()-]+$/;
  if (supplier.Email && !emailRegex.test(supplier.Email)) { errors.email = 'Please enter a valid email address.'; }
  if (supplier.TPNo && !phoneRegex.test(supplier.TPNo)) { errors.phone = 'Please enter a valid phone number.'; }
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const handleAddNewSupplier = async () => {
  if (!validateForm(newSupplier.value)) return;
  try {
    await mastersStore.addSupplier(newSupplier.value);
    isAddModalOpen.value = false;
  } catch (error) { /* Handled in store */ }
};

const handleUpdateSupplier = async () => {
  if (!validateForm(editingSupplier.value)) return;
  try {
    await mastersStore.updateSupplier(editingSupplier.value);
    isEditModalOpen.value = false;
  } catch (error) { /* Handled in store */ }
};

const handleDeleteSupplier = async () => {
  if (!supplierToDelete.value) return;
  await mastersStore.deleteSupplier(supplierToDelete.value.id);
  isDeleteModalOpen.value = false;
  supplierToDelete.value = null;
};

const filteredSuppliers = computed(() => {
  let suppliers = mastersStore.suppliers;
  if (searchName.value) { suppliers = suppliers.filter(s => s.Descreption.toLowerCase().includes(searchName.value.toLowerCase())); }
  if (searchAddress.value) { suppliers = suppliers.filter(s => s.Address.toLowerCase().includes(searchAddress.value.toLowerCase())); }
  if (statusFilter.value !== 'all') { const isActive = statusFilter.value === 'active'; suppliers = suppliers.filter(s => s.ActiveStatus === isActive); }
  return suppliers;
});

onMounted(() => {
  mastersStore.fetchSuppliers();
});
</script>
