<template>
  <MainLayout>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Petty Cash Report</h1>
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <select v-model="selectedLocation" class="px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
            <option v-for="loc in allowedLocations" :key="loc.id" :value="loc.id">{{ loc.locName }}</option>
          </select>
          <input v-model="fromDate" type="date" class="px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
          <input v-model="toDate" type="date" class="px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600">
          <button @click="generateReport" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Generate PDF</button>
          <button @click="exportToExcel" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Export Excel</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePettyCashStore } from '@/stores/transactions/pettycash';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/users';
import { useMastersStore } from '@/stores/masters';

const pettyCashStore = usePettyCashStore();
const authStore = useAuthStore();
const userStore = useUserStore();
const mastersStore = useMastersStore();

const selectedLocation = ref('');
const fromDate = ref(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
const toDate = ref(new Date().toISOString().split('T')[0]);

const allowedLocations = computed(() => {
    const firebaseUser = userStore.firebaseUsers.find(u => u.apiUser === authStore.user.Username);
    if (firebaseUser && firebaseUser.locations) {
        return pettyCashStore.locations.filter(loc => firebaseUser.locations.includes(loc.id));
    }
    return [];
});

const getReportData = async () => {
    await pettyCashStore.fetchTransactionLog(selectedLocation.value, fromDate.value, toDate.value);
    
    const closingBalance = pettyCashStore.pettyCashBalances[selectedLocation.value] || 0;
    const totalWithdrawals = pettyCashStore.transactionLog.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
    const totalAdditions = pettyCashStore.transactionLog.filter(t => t.type === 'add').reduce((sum, t) => sum + t.amount, 0);
    const openingBalance = closingBalance - totalAdditions + totalWithdrawals;

    let currentBalance = openingBalance;
    const openingRow = {
        DATE: fromDate.value,
        DESCRIPTION: 'Opening Balance',
        CODE: '',
        RECIPT: '',
        PAYMENT: '',
        BALANCE: openingBalance.toFixed(2),
        ...Object.fromEntries(pettyCashStore.withdrawalTypes.map(type => [type, '-']))
    };

    const transactionRows = [...pettyCashStore.transactionLog].reverse().map(log => {
        if(log.type === 'add') {
            currentBalance += log.amount;
        } else {
            currentBalance -= log.amount;
        }

        const row = {
            DATE: log.date?.toDate().toLocaleDateString(),
            DESCRIPTION: log.remark || log.checkNumber || log.withdrawType,
            CODE: '',
            RECIPT: log.type === 'add' ? log.amount.toFixed(2) : '-',
            PAYMENT: log.type === 'withdraw' ? log.amount.toFixed(2) : '-',
            BALANCE: currentBalance.toFixed(2),
        };
        
        pettyCashStore.withdrawalTypes.forEach(type => {
            row[type] = log.withdrawType === type ? log.amount.toFixed(2) : '-';
        });
        return row;
    });

    return {
        openingBalance,
        totalAdditions,
        totalWithdrawals,
        closingBalance,
        body: [openingRow, ...transactionRows]
    };
};

const generateReport = async () => {
    const reportData = await getReportData();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    const locationInfo = mastersStore.locations.find(l => l.locCode === selectedLocation.value);
    const reportDate = new Date().toLocaleDateString();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PETTY CASH REIMBURSEMENT', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`LOCATION: ${locationInfo?.locName || ''}`, 14, 28);
    doc.text(`DATE: ${reportDate}`, 14, 34);

    doc.autoTable({
        startY: 40,
        body: [
            ['PETTY CASH FLOAT', formatCurrency(15000)], // Placeholder
            ['Opening Balance', formatCurrency(reportData.openingBalance)],
            ['Up to Date Total Received', formatCurrency(reportData.totalAdditions)],
            ['Up to Date Total Expenses', formatCurrency(reportData.totalWithdrawals)],
            ['Current Balance', formatCurrency(reportData.closingBalance)],
        ],
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: { 1: { halign: 'right' } }
    });

    const headers = ['DATE', 'DESCRIPTION', 'CODE', 'RECIPT', 'PAYMENT', 'BALANCE', ...pettyCashStore.withdrawalTypes];
    
    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [headers],
        body: reportData.body.map(row => headers.map(h => row[h])),
        theme: 'grid',
        styles: { fontSize: 8 },
    });

    doc.save(`Petty_Cash_Report_${selectedLocation.value}.pdf`);
};

const exportToExcel = async () => {
    const reportData = await getReportData();
    const worksheet = XLSX.utils.json_to_sheet(reportData.body);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Petty Cash Report');
    XLSX.writeFile(workbook, `Petty_Cash_Report_${selectedLocation.value}.xlsx`);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

onMounted(() => {
  pettyCashStore.fetchLocationsFromFirebase();
  userStore.fetchFirebaseUsers().then(() => {
      if (allowedLocations.value.length > 0) {
          selectedLocation.value = allowedLocations.value[0].id;
      }
  });
  mastersStore.fetchLocations();
});
</script>
