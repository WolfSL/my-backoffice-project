<template>
  <MainLayout>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">User Management</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- User List -->
        <div class="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Users</h2>
          <div class="mb-4">
            <input v-model="userSearch" type="text" placeholder="Search users..." class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-700 dark:border-slate-600">
          </div>
          <div v-if="userStore.isLoading" class="text-center">Loading...</div>
          <ul v-else class="space-y-2 max-h-[60vh] overflow-y-auto">
            <li v-for="user in filteredApiUsers" :key="user.Username" 
                @click="selectUser(user)"
                class="p-2 rounded-md cursor-pointer"
                :class="selectedUser?.Username === user.Username ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-slate-700'">
              {{ user.DisplayName }}
            </li>
          </ul>
        </div>

        <!-- Permission Editor -->
        <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <div v-if="!selectedUser">
            <p class="text-gray-500">Select a user to manage their permissions.</p>
          </div>
          <div v-else>
            <h2 class="text-xl font-semibold mb-4">Permissions for {{ selectedUser.DisplayName }}</h2>
            
            <!-- Location Management -->
            <div class="mb-6">
              <h3 class="font-semibold mb-2">Allowed Locations</h3>
              <div class="mb-2 border-b pb-2 dark:border-slate-700">
                  <label class="flex items-center">
                      <input type="checkbox" v-model="selectAllLocations" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                      <span class="ml-2 text-sm font-medium">Select All Locations</span>
                  </label>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label v-for="loc in mastersStore.locations" :key="loc.locCode" class="flex items-center">
                  <input type="checkbox" :value="loc.locCode" v-model="editableLocations" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                  <span class="ml-2 text-sm">{{ loc.locName }}</span>
                </label>
              </div>
            </div>

            <!-- Permission Management -->
            <div>
              <h3 class="font-semibold mb-4">Application Permissions</h3>
              <div class="space-y-4">
                <div v-for="group in availablePermissions" :key="group.group">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300 border-b dark:border-slate-700 pb-1 mb-2">{{ group.group }}</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <label v-for="perm in group.permissions" :key="perm.id" class="flex items-center">
                      <input type="checkbox" :value="perm.id" v-model="editablePermissions" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                      <span class="ml-2 text-sm">{{ perm.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 text-right">
              <button @click="savePermissions" class="px-6 py-2 bg-indigo-600 text-white rounded-md">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useUserStore } from '@/stores/users';
import { useMastersStore } from '@/stores/masters';

const userStore = useUserStore();
const mastersStore = useMastersStore();

const selectedUser = ref(null);
const editableLocations = ref([]);
const editablePermissions = ref([]);
const userSearch = ref('');

const availablePermissions = ref([
  { 
    group: 'General',
    permissions: [
      { id: 'MASTERS#VIEW', label: 'View Masters' },
      { id: 'REPORTS#VIEW', label: 'View Reports' },
      { id: 'DASHBOARD#VIEW', label: 'View Dashboard' },
      { id: 'SETTINGS#VIEW', label: 'View Settings' },
      { id: 'TRANSACTIONS#VIEW', label: 'View Transactions' },

    ]
  },
  {
    group: 'Purchase Order',
    permissions: [
      { id: 'PO#VIEW', label: 'View POs' },
      { id: 'PO#NEW', label: 'Create POs' },
      { id: 'PO#EDIT', label: 'Edit POs' },
      { id: 'PO#AP', label: 'Approve POs' },
      { id: 'PO#PRO', label: 'Process POs' },
    ]
  },
  {
    group: 'Goods Received Note',
    permissions: [
      { id: 'GRN#VIEW', label: 'View GRNs' },
      { id: 'GRN#NEW', label: 'Create GRNs' },
      { id: 'GRN#EDIT', label: 'Edit GRNs' },
    ]
  },
  {
    group: 'Stock Taking',
    permissions: [
      { id: 'ST#VIEW', label: 'View Stock Taking' },
      { id: 'ST#INIT', label: 'Initialize Stock' },
      { id: 'ST#UPLOAD', label: 'Upload QB Stock' },
    ]
  },
{
    group: 'Petty Cash',
    permissions: [
      { id: 'PC#VIEW', label: 'View Petty Cash' },
      { id: 'PC#SET_OPENING', label: 'Set Opening Balance' },
      { id: 'PC#ADD_CASH', label: 'Add Cash' },
      { id: 'PC#WITHDRAW', label: 'Withdraw Cash' },
      { id: 'PC#REPORTS', label: 'Petty Cash Reports' },
    ]
  },
  {
    group: 'HRIS',
    permissions: [
      { id: 'HRIS#VIEW', label: 'View Employees' },
      { id: 'HRIS#EDIT', label: 'Edit Employees' },
      { id: 'HRIS#REPORTS', label: 'View HRIS Reports' },
    ]
  },
  {
    group: 'Admin',
    permissions: [
      { id: 'ADMIN#USERS', label: 'Manage Users' },
    ]
  }
]);

const filteredApiUsers = computed(() => {
    if (!userSearch.value) {
        return userStore.apiUsers;
    }
    const searchTerm = userSearch.value.toLowerCase();
    return userStore.apiUsers.filter(user => 
        user.DisplayName.toLowerCase().includes(searchTerm) ||
        user.Username.toLowerCase().includes(searchTerm)
    );
});

const selectAllLocations = computed({
  get() {
    return mastersStore.locations.length > 0 && editableLocations.value.length === mastersStore.locations.length;
  },
  set(value) {
    if (value) {
      editableLocations.value = mastersStore.locations.map(loc => loc.locCode);
    } else {
      editableLocations.value = [];
    }
  }
});

const selectUser = (user) => {
  selectedUser.value = user;
  const firebaseUser = userStore.firebaseUsers.find(fu => fu.apiUser === user.Username);
  if (firebaseUser) {
    editableLocations.value = firebaseUser.locations || [];
    editablePermissions.value = firebaseUser.permissions || [];
  } else {
    editableLocations.value = [];
    editablePermissions.value = [];
  }
};

const savePermissions = async () => {
  if (!selectedUser.value) return;
  
  let firebaseUser = userStore.firebaseUsers.find(fu => fu.apiUser === selectedUser.value.Username);
  if (!firebaseUser) {
    alert("Cannot save permissions for a user who has never logged in via Firebase.");
    return;
  }

  await userStore.updateUserPermissions(firebaseUser.id, editablePermissions.value, editableLocations.value);
  alert('Permissions updated successfully!');
};

onMounted(() => {
  userStore.fetchApiUsers();
  userStore.fetchFirebaseUsers();
  mastersStore.fetchLocations();
});
</script>
