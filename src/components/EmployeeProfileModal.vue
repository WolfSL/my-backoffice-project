<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? 'Edit Employee Profile' : 'New Employee Profile' }}</h2>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <input type="checkbox" v-model="isActive" id="employee-active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
            <label for="employee-active" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <button @click="$emit('close')" class="p-2 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">&times;</button>
        </div>
      </div>
      
      <div v-if="hrisStore.activeEmployee" class="p-6 flex-grow overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <select v-model="hrisStore.activeEmployee.loc" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              <option value="">Select Location</option>
              <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Machine ID</label>
            <input v-model="hrisStore.activeEmployee.mId" type="text" placeholder="Machine ID" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Emp ID</label>
            <input v-model="hrisStore.activeEmployee.eId" type="text" placeholder="Emp ID" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">EPF No</label>
            <input v-model="hrisStore.activeEmployee.epfCode" type="text" placeholder="EPF No" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name with Initials</label>
            <input v-model="hrisStore.activeEmployee.empName" type="text" placeholder="Name with Initials" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
            <input v-model="hrisStore.activeEmployee.displyName" type="text" placeholder="Display Name" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div class="md:col-span-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input v-model="hrisStore.activeEmployee.fullName" type="text" placeholder="Full Name" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <div class="mt-1 flex items-center space-x-2">
              <div class="flex-grow px-2 py-1 w-full bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 border rounded-md min-h-[30px]">
                {{ selectedCategoryName || 'None Selected' }}
              </div>
              <button @click="isCategoryModalOpen = true" class="px-4 py-1 bg-gray-200 dark:bg-slate-600 rounded-md">...</button>
            </div>
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
            <div class="mt-1 flex items-center space-x-2">
              <div class="flex-grow px-2 py-1 w-full bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 border rounded-md min-h-[30px]">
                {{ selectedDepartmentName || 'None Selected' }}
              </div>
              <button @click="isDepartmentModalOpen = true" class="px-4 py-1 bg-gray-200 dark:bg-slate-600 rounded-md">...</button>
            </div>
          </div>
        </div>

        <div class="border-b border-gray-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" 
              :class="[activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              {{ tab }}
            </button>
          </nav>
        </div>

        <div class="pt-6">
          <div v-if="activeTab === 'Salary'">
            </div>
          <div v-if="activeTab === 'Contact Info'">
            </div>
          <div v-if="activeTab === 'Bank Details'">
            </div>
        </div>
      </div>
      
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end items-center space-x-4">
        <button @click="$emit('close')" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md">Cancel</button>
        <button @click="handleSave" :disabled="hrisStore.isSubmitting" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">
          {{ hrisStore.isSubmitting ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="isCategoryModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Category</h2>
        <input v-model="categorySearch" type="text" placeholder="Search categories..."
          class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto">
        <ul>
          <li v-for="cat in filteredCategories" :key="cat.catCode" @click="selectCategory(cat)"
            class="py-2 px-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer rounded">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ cat.catDes }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end">
        <button @click="isCategoryModalOpen = false" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md">Close</button>
      </div>
    </div>
  </div>

  <div v-if="isDepartmentModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Department</h2>
        <input v-model="departmentSearch" type="text" placeholder="Search departments..."
          class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto">
        <ul>
          <li v-for="dep in filteredDepartments" :key="dep.depCode" @click="selectDepartment(dep)"
            class="py-2 px-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer rounded">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ dep.depDes }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end">
        <button @click="isDepartmentModalOpen = false" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md">Close</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHrisStore } from '@/stores/hris';
import { useMastersStore } from '@/stores/masters';

const props = defineProps({
  isEditing: Boolean,
});
const emit = defineEmits(['close']);

const hrisStore = useHrisStore();
const mastersStore = useMastersStore();
const activeTab = ref('Salary');
const tabs = ['Salary', 'Contact Info', 'Bank Details'];

// --- Main Modal Logic ---

const isActive = computed({
  get() {
    return hrisStore.activeEmployee?.status === 'A';
  },
  set(value) {
    if (hrisStore.activeEmployee) {
      hrisStore.activeEmployee.status = value ? 'A' : 'N';
    }
  }
});

const handleSave = async () => {
  const success = await hrisStore.saveEmployee(props.isEditing);
  if (success) {
    emit('close');
  }
};

onMounted(() => {
  hrisStore.fetchCategories();
  hrisStore.fetchDepartments();
  mastersStore.fetchLocations();
});


// --- NEW LOGIC FOR CATEGORY SELECTION MODAL ---

const isCategoryModalOpen = ref(false);
const categorySearch = ref('');

const selectedCategoryName = computed(() => {
  if (!hrisStore.activeEmployee?.catCode) return '';
  const selected = hrisStore.categories.find(c => c.catCode === hrisStore.activeEmployee.catCode);
  return selected ? selected.catDes : '';
});

const filteredCategories = computed(() => {
  if (!categorySearch.value) {
    return hrisStore.categories;
  }
  return hrisStore.categories.filter(cat =>
    cat.catDes.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

function selectCategory(category) {
  hrisStore.activeEmployee.catCode = category.catCode;
  isCategoryModalOpen.value = false;
  categorySearch.value = '';
}


// --- NEW LOGIC FOR DEPARTMENT SELECTION MODAL ---

const isDepartmentModalOpen = ref(false);
const departmentSearch = ref('');

const selectedDepartmentName = computed(() => {
  if (!hrisStore.activeEmployee?.department) return '';
  const selected = hrisStore.departments.find(d => d.depCode === hrisStore.activeEmployee.department);
  return selected ? selected.depDes : '';
});

const filteredDepartments = computed(() => {
  if (!departmentSearch.value) {
    return hrisStore.departments;
  }
  return hrisStore.departments.filter(dep =>
    dep.depDes.toLowerCase().includes(departmentSearch.value.toLowerCase())
  );
});

function selectDepartment(department) {
  hrisStore.activeEmployee.department = department.depCode;
  isDepartmentModalOpen.value = false;
  departmentSearch.value = '';
}
</script>