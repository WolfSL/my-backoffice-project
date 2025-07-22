<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// This component expects a 'chartData' prop
const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (chartCanvas.value && props.chartData.length > 0) {
    const ctx = chartCanvas.value.getContext('2d');
    
    // MODIFIED: Check for 'day' property first, then fall back to 'month'
    const labels = props.chartData.map(d => d.day || d.month);
    const data = props.chartData.map(d => d.flow);

    chartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cash Flow',
          data: data,
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'K';
                }
                return value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
};

// Watch for changes in the chartData prop and re-render
watch(() => props.chartData, () => {
  renderChart();
}, { deep: true });

onMounted(() => {
  renderChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>
