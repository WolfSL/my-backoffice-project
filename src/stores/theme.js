import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref(localStorage.getItem('theme') || 'light');

  // Actions
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  function applyTheme() {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme.value);
  }

  // Watch for changes and apply them
  watch(theme, applyTheme, { immediate: true });

  return {
    theme,
    toggleTheme
  };
});
