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
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Sub-Departments</h1>
        <button @click="openAddModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Sub-Department
        </button>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          <input v-model="searchDescription" type="text" placeholder="Search by description..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <select v-model="departmentFilter" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Departments</option>
            <option v-for="dept in mastersStore.departments" :key="dept.DeptCode" :value="dept.DeptCode">{{ dept.Description }}</option>
          </select>
           <select v-model="statusFilter" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div v-if="mastersStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading...</p></div>
        <div v-else-if="mastersStore.error" class="text-center py-10 text-red-500 flex-grow">{{ mastersStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="subDept in filteredSubDepartments" :key="subDept.SubDeptCode">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ subDept.SubDeptCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ subDept.Description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ subDept.Department }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="subDept.Active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ subDept.Active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button @click="openEditModal(subDept)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                  <button @click="openDeleteModal(subDept)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
              <tr v-if="filteredSubDepartments.length === 0"><td colspan="5" class="text-center py-10 text-gray-500 dark:text-gray-400">No sub-departments match your criteria.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center"><h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? 'Edit' : 'Add New' }} Sub-Department</h2><button @click="closeModal" class="text-gray-400 hover:text-gray-600">&times;</button></div>
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub-Dept Code</label>
            <div v-if="!isEditing" class="mt-1 relative rounded-md shadow-sm">
              <input v-model="editableSubDepartment.SubDeptCode" type="text" required class="block w-full pr-20 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              <button @click="getNextSubDeptCode" type="button" class="absolute inset-y-0 right-0 px-4 border-l dark:border-slate-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 rounded-r-md">Get Next</button>
            </div>
            <input v-else v-model="editableSubDepartment.SubDeptCode" type="text" :readonly="isEditing" required class="mt-1 bg-gray-100 dark:bg-slate-700 px-2 py-1">
          </div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Order</label><input v-model.number="editableSubDepartment.DisplayOrder" type="number" required class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        </div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label><input v-model="editableSubDepartment.Description" type="text" required class="mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Parent Department</label>
          <select v-model="editableSubDepartment.Deptlink" required class="w-full mt-1 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option disabled value="">Please select one</option>
            <option v-for="dept in mastersStore.departments" :key="dept.DeptCode" :value="dept.DeptCode">{{ dept.Description }}</option>
          </select>
        </div>
        <div class="flex items-center"><input v-model="editableSubDepartment.Active" id="activeStatus" type="checkbox" class="h-4 w-4 text-indigo-600 border-gray-300 rounded"><label for="activeStatus" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Active</label></div>
      </form>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="closeModal" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md mr-2">Cancel</button>
        <button @click="handleSubmit" :disabled="mastersStore.isAdding || mastersStore.isUpdating" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">{{ isEditing ? (mastersStore.isUpdating ? 'Saving...' : 'Save Changes') : (mastersStore.isAdding ? 'Saving...' : 'Save') }}</button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6"><h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">Delete Sub-Department</h3><div class="mt-2"><p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this sub-department?</p><p v-if="subDepartmentToDelete" class="mt-2 font-semibold text-gray-700 dark:text-gray-300">{{ subDepartmentToDelete.Description }}</p></div></div>
      <div class="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button @click="handleDelete" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
        <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const mastersStore = useMastersStore();
const authStore = useAuthStore();
const { successMessage, operationError } = storeToRefs(mastersStore);
const route = useRoute();

const searchDescription = ref('');
const departmentFilter = ref('all');
const statusFilter = ref('all');

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const subDepartmentToDelete = ref(null);

const defaultSubDepartment = () => ({
  SubDeptCode: '', Description: '', Deptlink: '', DisplayOrder: 1, Active: true, CreateUser: authStore.displayName
});

const editableSubDepartment = ref(defaultSubDepartment());

const openAddModal = () => {
  isEditing.value = false;
  editableSubDepartment.value = defaultSubDepartment();
  isModalOpen.value = true;
};

const openEditModal = (subDept) => {
  isEditing.value = true;
  editableSubDepartment.value = { ...subDept };
  isModalOpen.value = true;
};

const openDeleteModal = (subDept) => {
  subDepartmentToDelete.value = subDept;
  isDeleteModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const getNextSubDeptCode = () => {
  const maxCode = mastersStore.subDepartments.reduce((max, d) => {
    const codeNum = parseInt(d.SubDeptCode, 10);
    return !isNaN(codeNum) && codeNum > max ? codeNum : max;
  }, 0);
  editableSubDepartment.value.SubDeptCode = (maxCode + 1).toString();
};

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await mastersStore.updateSubDepartment(editableSubDepartment.value);
    } else {
      await mastersStore.addSubDepartment(editableSubDepartment.value);
    }
    closeModal();
  } catch (error) { /* Handled in store */ }
};

const handleDelete = async () => {
  if (!subDepartmentToDelete.value) return;
  await mastersStore.deleteSubDepartment(subDepartmentToDelete.value.SubDeptCode);
  isDeleteModalOpen.value = false;
  subDepartmentToDelete.value = null;
};

const filteredSubDepartments = computed(() => {
  return mastersStore.subDepartments.filter(subDept => {
    const descMatch = subDept.Description.toLowerCase().includes(searchDescription.value.toLowerCase());
    const deptMatch = departmentFilter.value === 'all' || subDept.Deptlink === departmentFilter.value;
    const statusMatch = statusFilter.value === 'all' || subDept.Active === (statusFilter.value === 'active');
    return descMatch && deptMatch && statusMatch;
  });
});

onMounted(() => {
  mastersStore.fetchSubDepartments();
  mastersStore.fetchDepartments();
  if (route.query.deptCode) {
    departmentFilter.value = route.query.deptCode;
  }
});
</script>
