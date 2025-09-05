<template>
  <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md flex flex-col">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Customize Dashboard</h2>
      </div>
      <div class="p-6 overflow-y-auto">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Drag and drop to reorder widgets. Use the toggles to show or hide them.</p>
        <div ref="draggableContainer" class="space-y-2">
          <div v-for="(widget, index) in localConfig" :key="widget.id" 
               class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700 rounded-lg cursor-grab"
               draggable="true"
               @dragstart="onDragStart(index)"
               @dragover.prevent
               @drop="onDrop(index)">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ widget.name }}</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="widget.visible" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end space-x-4">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 dark:bg-slate-600 rounded-md">Cancel</button>
        <button @click="saveAndClose" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';

const emit = defineEmits(['close']);
const dashboardStore = useDashboardStore();
const localConfig = ref(JSON.parse(JSON.stringify(dashboardStore.widgetConfig)));
const draggedIndex = ref(null);

const onDragStart = (index) => {
  draggedIndex.value = index;
};

const onDrop = (targetIndex) => {
  const draggedItem = localConfig.value.splice(draggedIndex.value, 1)[0];
  localConfig.value.splice(targetIndex, 0, draggedItem);
};

const saveAndClose = () => {
  dashboardStore.widgetConfig = localConfig.value;
  dashboardStore.saveWidgetConfig();
  emit('close');
};
</script>
