import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import apiService from '@/services/apiService';

export const useAuthStore = defineStore('auth', () => {
  // === STATE ===
  // MODIFIED: Initialize user state from localStorage
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const companyName = ref('');
  const companyAddress = ref('');

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
        // MODIFIED: Save user to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
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
    // MODIFIED: Remove user from localStorage
    localStorage.removeItem('user');
    await router.push('/login');
  }
  
  async function fetchCompany() {
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
      companyName.value = 'My Company';
      companyAddress.value = '';
    }
  }

  function hasPermission(requiredPermission) {
    return permissions.value.includes(requiredPermission);
  }

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
