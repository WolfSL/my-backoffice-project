import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router'; // Import the router to redirect after login
import apiService from '@/services/apiService';

// Define the authentication store
export const useAuthStore = defineStore('auth', () => {
  // === STATE ===
  const user = ref(null);
  const companyName = ref('');
  const companyAddress = ref(''); // New state for company address

  // === GETTERS ===
  const isLoggedIn = computed(() => !!user.value);
  const displayName = computed(() => user.value?.DisplayName || 'Guest');
  const permissions = computed(() => {
    if (user.value && user.value.Tags) {
      return user.value.Tags.split(',');
    }
    return [];
  });

  // === ACTIONS ===
  async function login(username, password) {
    try {
      const response = await apiService.login(username, password);
      const userData = response.data?.[0];
      if (userData && userData.Status === true) {
        user.value = userData;
        await router.push('/');
      } else {
        throw new Error(userData ? 'User is not active.' : 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function logout() {
    user.value = null;
    await router.push('/login');
  }
  
  async function fetchCompany() {
    // Avoid re-fetching if data already exists
    if (companyName.value) return;
    try {
      const response = await apiService.getCompany();
      const companyData = response.data?.[0];
      if (companyData) {
        companyName.value = companyData.COMPANY || 'My Company';
        companyAddress.value = companyData.ADDRESS || '';
      }
    } catch (error) {
      console.error('Failed to fetch company details:', error);
      companyName.value = 'My Company'; // Set a fallback name on error
      companyAddress.value = '';
    }
  }

  function hasPermission(requiredPermission) {
    return permissions.value.includes(requiredPermission);
  }

  // Expose new state and action
  return {
    user,
    companyName,
    companyAddress,
    isLoggedIn,
    displayName,
    permissions,
    login,
    logout,
    hasPermission,
    fetchCompany
  };
});
