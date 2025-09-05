<template>
  <MainLayout>
    <div v-if="hrisStore.successMessage"
      class="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform translate-x-0">
      {{ hrisStore.successMessage }}
    </div>
    <div v-if="hrisStore.operationError"
      class="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform translate-x-0">
      {{ hrisStore.operationError }}
    </div>

    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Employee Profiles</h1>
        <button @click="openNewEmployeeModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          New Employee
        </button>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <!-- Search Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 flex-shrink-0">
          <input v-model="filters.eId" type="text" placeholder="Search EID..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="filters.empName" type="text" placeholder="Search Name..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="filters.epfCode" type="text" placeholder="Search EPF Code..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          
          <select v-model="filters.Category" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
          </select>

          <select v-model="filters.Department" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Departments</option>
            <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">{{ dept }}</option>
          </select>

          <select v-model="filters.status" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="not">Inactive</option>
          </select>
        </div>

        <!-- Table -->
        <div v-if="hrisStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading employees...</p></div>
        <div v-else-if="hrisStore.error" class="text-center py-10 text-red-500 flex-grow">{{ hrisStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">EPF Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="emp in filteredEmployees" :key="emp.eId">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ emp.eId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-300">{{ emp.empName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ emp.epfCode }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ emp.Category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ emp.Department }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="emp.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ emp.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <!-- MODIFIED: Added .prevent to stop scroll jump -->
                  <button @click.prevent="openEditEmployeeModal(emp)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                </td>
              </tr>
               <tr v-if="filteredEmployees.length === 0">
                <td colspan="7" class="text-center py-10 text-gray-500 dark:text-gray-400">No employees found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <EmployeeProfileModal 
      v-if="isModalOpen" 
      :is-editing="isEditing"
      @close="isModalOpen = false"
    />
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import EmployeeProfileModal from '@/components/EmployeeProfileModal.vue';
import { useHrisStore } from '@/stores/hris';

const hrisStore = useHrisStore();

const isModalOpen = ref(false);
const isEditing = ref(false);

const filters = ref({
  eId: '',
  empName: '',
  epfCode: '',
  Category: '',
  Department: '',
  status: '',
});

const uniqueCategories = computed(() => {
    const categories = hrisStore.employees.map(emp => emp.Category);
    return [...new Set(categories)].sort();
});

const uniqueDepartments = computed(() => {
    const departments = hrisStore.employees.map(emp => emp.Department);
    return [...new Set(departments)].sort();
});

const filteredEmployees = computed(() => {
  return hrisStore.employees.filter(emp => {
    return Object.keys(filters.value).every(key => {
      if (filters.value[key] === '') return true;
      return String(emp[key]).toLowerCase().includes(filters.value[key].toLowerCase());
    });
  });
});

const openNewEmployeeModal = () => {
  isEditing.value = false;
  hrisStore.createBlankEmployee();
  isModalOpen.value = true;
};

const openEditEmployeeModal = (employee) => {
  isEditing.value = true;
  hrisStore.fetchEmployeeDetails(employee.eId, employee.location);
  isModalOpen.value = true;
};

onMounted(() => {
  hrisStore.fetchEmployees();
});
</script>
