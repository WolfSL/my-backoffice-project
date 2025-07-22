<template>
  <div class="w-full">
    <div class="grid grid-cols-[auto_repeat(12,_minmax(0,_1fr))] gap-1 text-xs">
      <!-- Header Row -->
      <div></div> <!-- This empty div aligns with the day names column below -->
      <div v-for="block in timeBlocks" :key="block.name" class="font-semibold text-center text-gray-500 dark:text-gray-400">
        {{ String(Math.min(...block.hours)).padStart(2, '0') }}
      </div>
      
      <!-- Data Rows -->
      <template v-for="(day, dayIndex) in daysOfWeek" :key="day">
        <div class="font-semibold text-right text-gray-500 dark:text-gray-400 pr-2">{{ day }}</div>
        <div v-for="(block, blockIndex) in timeBlocks" :key="`${day}-${block.name}`"
             :style="{ backgroundColor: getColor(dayIndex, blockIndex) }"
             :title="`Sales on ${day} (${String(Math.min(...block.hours)).padStart(2, '0')}-${String(Math.max(...block.hours)).padStart(2, '0')}h): ${formatCurrency(getSales(dayIndex, blockIndex))}`"
             class="h-5 w-full rounded-sm transition-colors duration-300">
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  salesData: {
    type: Array,
    required: true
  },
  // MODIFIED: Added theme prop
  theme: {
    type: String,
    default: 'light'
  }
});

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNameToIndex = {
  'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

const timeBlocks = [
  { name: '00-01', hours: [0, 1] }, { name: '02-03', hours: [2, 3] },
  { name: '04-05', hours: [4, 5] }, { name: '06-07', hours: [6, 7] },
  { name: '08-09', hours: [8, 9] }, { name: '10-11', hours: [10, 11] },
  { name: '12-13', hours: [12, 13] }, { name: '14-15', hours: [14, 15] },
  { name: '16-17', hours: [16, 17] }, { name: '18-19', hours: [18, 19] },
  { name: '20-21', hours: [20, 21] }, { name: '22-23', hours: [22, 23] }
];

const processedData = computed(() => {
  const grid = Array(7).fill(0).map(() => Array(12).fill(0));
  
  props.salesData.forEach(item => {
    const dayIndex = dayNameToIndex[item.day_name];
    const hour = item.hour;
    
    if (dayIndex !== undefined && hour !== undefined) {
      const blockIndex = timeBlocks.findIndex(block => block.hours.includes(hour));
      if (blockIndex !== -1) {
        grid[dayIndex][blockIndex] += item.total_sales;
      }
    }
  });
  return grid;
});

const maxSales = computed(() => {
  const max = Math.max(...processedData.value.flat());
  return max === 0 ? 1 : max;
});

const getSales = (dayIndex, blockIndex) => {
  return processedData.value[dayIndex][blockIndex];
};

// MODIFIED: Updated getColor to be theme-aware
const getColor = (dayIndex, blockIndex) => {
  const sales = getSales(dayIndex, blockIndex);
  
  if (props.theme === 'dark') {
    if (sales === 0) return '#1e293b'; // Dark slate for no sales
    const intensity = Math.min(sales / maxSales.value, 1.0);
    if (intensity < 0.25) return '#4c1d95'; // Violet
    if (intensity < 0.5) return '#6d28d9';
    if (intensity < 0.75) return '#8b5cf6';
    return '#a78bfa'; // Lightest Violet
  } else {
    // Light theme colors (original)
    if (sales === 0) return '#ebedf0';
    const intensity = Math.min(sales / maxSales.value, 1.0);
    if (intensity < 0.25) return '#c6e48b';
    if (intensity < 0.5) return '#7bc96f';
    if (intensity < 0.75) return '#239a3b';
    return '#196127';
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};
</script>
