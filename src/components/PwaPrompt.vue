<template>
  <div v-if="showInstallButton || showRefreshButton"
    class="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4">
    
    <!-- Install Button -->
    <div v-if="showInstallButton" class="flex items-center space-x-3">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Install App?</p>
      <button @click="installPWA"
        class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Install</button>
      <button @click="dismissInstall" class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700">&times;</button>
    </div>

    <!-- Refresh Button -->
    <div v-if="showRefreshButton" class="flex items-center space-x-3">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">New version available!</p>
      <button @click="updatePWA"
        class="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Reload</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // MODIFIED: Added 'computed' to the import
import { useRegisterSW } from 'virtual:pwa-register/vue';

const installPrompt = ref(null);
const showInstallButton = ref(false);

// Logic for showing the install button
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt.value = e;
    showInstallButton.value = true;
  });
});

const installPWA = async () => {
  if (!installPrompt.value) return;
  const result = await installPrompt.value.prompt();
  if (result.outcome === 'accepted') {
    showInstallButton.value = false;
    installPrompt.value = null;
  }
};

const dismissInstall = () => {
  showInstallButton.value = false;
  installPrompt.value = null;
};

// Logic for showing the update/refresh button
const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW();

const showRefreshButton = computed(() => needRefresh.value);

const updatePWA = () => {
  updateServiceWorker();
};
</script>
