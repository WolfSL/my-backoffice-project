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
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Departments</h1>
        <button @click="openAddModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Department
        </button>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <input v-model="searchCode" type="text" placeholder="Search by code..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="searchDescription" type="text" placeholder="Search by description..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
        </div>

        <div v-if="mastersStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading departments...</p></div>
        <div v-else-if="mastersStore.error" class="text-center py-10 text-red-500 flex-grow">{{ mastersStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="dept in filteredDepartments" :key="dept.DeptCode">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ dept.DeptCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ dept.Description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ dept.CreateUser }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <router-link :to="{ name: 'sub-departments', query: { deptCode: dept.DeptCode } }" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Sub-Depts</router-link>
                  <button @click="openEditModal(dept)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                  <button @click="openDeleteModal(dept)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
              <tr v-if="filteredDepartments.length === 0"><td colspan="4" class="text-center py-10 text-gray-500 dark:text-gray-400">No departments match your criteria.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? 'Edit' : 'Add New' }} Department</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Department Code</label>
          <div v-if="!isEditing" class="mt-1 relative rounded-md shadow-sm">
            <input v-model="editableDepartment.DeptCode" type="text" required class="block w-full pr-20 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <button @click="getNextDeptCode" type="button" class="absolute inset-y-0 right-0 px-4 border-l dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-r-md">Get Next</button>
          </div>
          <input v-else v-model="editableDepartment.DeptCode" type="text" readonly required class="mt-1 bg-gray-100 dark:bg-slate-700 px-2 py-1">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input v-model="editableDepartment.Description" type="text" required class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
        </div>
      </form>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="closeModal" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md mr-2">Cancel</button>
        <button @click="handleSubmit" :disabled="mastersStore.isAdding || mastersStore.isUpdating" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">
          {{ isEditing ? (mastersStore.isUpdating ? 'Saving...' : 'Save Changes') : (mastersStore.isAdding ? 'Saving...' : 'Save Department') }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">Delete Department</h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this department? This action cannot be undone.</p>
          <p v-if="departmentToDelete" class="mt-2 font-semibold text-gray-700 dark:text-gray-300">{{ departmentToDelete.Description }}</p>
        </div>
      </div>
      <div class="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button @click="handleDelete" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
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

const searchCode = ref('');
const searchDescription = ref('');

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const departmentToDelete = ref(null);

const defaultDepartment = () => ({
  DeptCode: '',
  Description: '',
  CreateUser: authStore.displayName
});

const editableDepartment = ref(defaultDepartment());

const openAddModal = () => {
  isEditing.value = false;
  editableDepartment.value = defaultDepartment();
  isModalOpen.value = true;
};

const openEditModal = (dept) => {
  isEditing.value = true;
  editableDepartment.value = { ...dept };
  isModalOpen.value = true;
};

const openDeleteModal = (dept) => {
  departmentToDelete.value = dept;
  isDeleteModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const getNextDeptCode = () => {
  const maxCode = mastersStore.departments.reduce((max, d) => {
    const codeNum = parseInt(d.DeptCode, 10);
    return !isNaN(codeNum) && codeNum > max ? codeNum : max;
  }, 0);
  editableDepartment.value.DeptCode = (maxCode + 1).toString();
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await mastersStore.updateDepartment(editableDepartment.value);
    } else {
      await mastersStore.addDepartment(editableDepartment.value);
    }
    closeModal();
  } catch (error) { /* Handled in store */ }
};

const handleDelete = async () => {
  if (!departmentToDelete.value) return;
  await mastersStore.deleteDepartment(departmentToDelete.value.DeptCode);
  isDeleteModalOpen.value = false;
  departmentToDelete.value = null;
};

const filteredDepartments = computed(() => {
  return mastersStore.departments.filter(dept => {
    const codeMatch = dept.DeptCode.toLowerCase().includes(searchCode.value.toLowerCase());
    const descMatch = dept.Description.toLowerCase().includes(searchDescription.value.toLowerCase());
    return codeMatch && descMatch;
  });
});

onMounted(() => {
  mastersStore.fetchDepartments();
});
</script>
