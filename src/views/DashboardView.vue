<template>
  <MainLayout>
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h1>
        <div class="flex items-center space-x-2">
            <button @click="isSettingsModalOpen = true" class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-700" title="Customize Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <button v-if="installPrompt" @click="triggerInstall" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                Install App
            </button>
        </div>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div class="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Select Date Range</h3>
          <div class="flex items-center flex-wrap gap-4">
            <div class="relative flex-1 min-w-[200px]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg
                  class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd" />
                </svg></div><input type="date" id="dateFrom" v-model="dateFrom" @change="handleDataRefresh"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300">
            </div>
            <div class="relative flex-1 min-w-[200px]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg
                  class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd" />
                </svg></div><input type="date" id="dateTo" v-model="dateTo" @change="handleDataRefresh"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300">
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col justify-center">
          <h3 class="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">Customers</h3>
          <p v-if="dashboardStore.isCusCountLoading"
            class="text-3xl font-bold text-gray-800 dark:text-gray-200 animate-pulse">...</p>
          <p v-else class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ dashboardStore.customerCount }}</p>
        </div>
        <div @click="isAiModalOpen = true"
          class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex items-center cursor-pointer hover:shadow-xl transition-shadow">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-4"><svg xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg></div>
          <div>
            <h3 class="text-gray-500 dark:text-gray-400 uppercase text-sm font-semibold">AI Insights</h3>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">Analysis</p>
          </div>
        </div>
      </div>

      <!-- coppied from here -->
       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <template v-for="widget in dashboardStore.widgetConfig" :key="widget.id">
            <div v-if="widget.visible" :class="getWidgetClass(widget.id)">
                <div v-if="widget.id === 'salesSummary'" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
                    <div class="flex justify-between items-center mb-4 flex-shrink-0"><h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Sales Summary</h2><button @click="downloadSalesSummaryPDF" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="Download PDF"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button></div>
                    <div v-if="dashboardStore.isSalesSummaryLoading" class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2 animate-pulse"><div v-for="i in 6" :key="`ss-skel-${i}`" class="flex items-center p-2 rounded-lg bg-gray-200 dark:bg-slate-700 h-12"><div class="h-4 w-4 bg-gray-300 dark:bg-slate-600 rounded mr-3"></div><div class="flex-1 space-y-2"><div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-3/4"></div><div class="h-2 bg-gray-300 dark:bg-slate-600 rounded w-1/4"></div></div><div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/5"></div></div></div>
                    <div v-if="!dashboardStore.isSalesSummaryLoading && dashboardStore.error" class="text-center text-red-500 py-8">{{ dashboardStore.error }}</div>
                    <div v-if="!dashboardStore.isSalesSummaryLoading && !dashboardStore.error" class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2"><div v-for="item in dashboardStore.salesSummary" :key="item.INV_LOCATION" :class="['flex items-center p-2 rounded-lg border transition-all', item.amt === 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-500/30' : 'bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-slate-700']"><div class="pr-3"><input type="checkbox" :value="item.INV_LOCATION" :checked="dashboardStore.selectedLocations.includes(item.INV_LOCATION)" @change="handleSelectionChange(item.INV_LOCATION)" class="h-4 w-4 text-indigo-600 border-gray-300 dark:border-slate-500 rounded bg-gray-100 dark:bg-slate-600 focus:ring-indigo-500"></div><div class="flex-1"><p class="font-medium text-sm text-gray-800 dark:text-gray-200">{{ item.locName }}</p><p class="text-xs text-gray-500 dark:text-gray-400">{{ calculatePercentage(item.amt) }}%</p></div><div class="text-right px-3"><p class="font-semibold text-base text-gray-900 dark:text-gray-100">{{ formatCurrency(item.amt) }}</p></div><div class="pl-1"><button @click="openXReport(item.INV_LOCATION)" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg></button></div></div></div>
                    <div class="flex justify-between items-center p-3 rounded-lg bg-gray-800 dark:bg-slate-700 text-white font-semibold mt-4 text-sm flex-shrink-0"><span>Total Sales</span><span>{{ formatCurrency(dashboardStore.totalSales) }}</span></div>
                </div>
                <div v-if="widget.id === 'supplierSales'" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
                    <div class="flex justify-between items-center mb-4 flex-shrink-0"><h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Supplier Sales Summary</h2><button @click="downloadSupplierSalesPDF" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="Download PDF"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button></div>
                    <div v-if="dashboardStore.isSupplierSalesLoading" class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2 animate-pulse"><div v-for="i in 6" :key="`sup-skel-${i}`" class="p-3 rounded-lg bg-gray-200 dark:bg-slate-700 h-16"><div class="flex justify-between items-start"><div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-2/3"></div><div class="h-4 bg-gray-300 dark:bg-slate-600 rounded w-1/4"></div></div><div class="flex justify-between items-end mt-2"><div class="h-2 bg-gray-300 dark:bg-slate-600 rounded w-1/3"></div><div class="h-2 bg-gray-300 dark:bg-slate-600 rounded w-1/4"></div></div></div></div>
                    <div v-if="!dashboardStore.isSupplierSalesLoading && dashboardStore.error" class="text-center text-red-500 py-8">{{ dashboardStore.error }}</div>
                    <div v-if="!dashboardStore.isSupplierSalesLoading && !dashboardStore.error" class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2"><div v-for="item in dashboardStore.supplierSales" :key="item.supName" class="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700"><div class="flex justify-between items-start"><p class="font-medium text-sm text-gray-800 dark:text-gray-200 flex-1 pr-4">{{ item.supName }}</p><p class="font-semibold text-base text-gray-900 dark:text-gray-100">{{ formatCurrency(item.amt) }}</p></div><div class="flex justify-between items-end mt-1 text-xs text-gray-500 dark:text-gray-400"><span>{{ item.pr.toFixed(2) }}% of Sales</span><span>{{ item.ltr.toLocaleString('en-US') }} ml</span></div></div></div>
                <div class="flex justify-between items-center p-3 rounded-lg bg-gray-800 dark:bg-slate-700 text-white  mt-4 text-sm flex-shrink-0"><span>Sales and Supplier Sales may differ due to service/c & final bill discounts.</span></div>
                  </div>
                <div v-if="widget.id === 'channelSales'" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
                    <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 flex-shrink-0">Channel Wise Sales Summary</h2>
                    <div v-if="dashboardStore.isChannelWiseSalesLoading" class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2 animate-pulse">
                        <div v-for="i in 4" :key="`chan-skel-${i}`" class="p-3 rounded-lg bg-gray-200 dark:bg-slate-700 h-24"></div>
                    </div>
                    <div v-else class="space-y-2 flex-grow h-auto md:h-[32rem] overflow-y-auto pr-2">
                        <div v-for="item in dashboardStore.channelWiseSales" :key="item.INV_LOCATION" class="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700">
                            <p class="font-medium text-sm text-gray-800 dark:text-gray-200">{{ item.Locn_name }}</p>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                                <div class="flex justify-between"><span>TakeAway:</span><span class="font-semibold">{{ formatCurrency(item.TakeAway) }}</span></div>
                                <div class="flex justify-between"><span>DineIn:</span><span class="font-semibold">{{ formatCurrency(item.DineIn) }}</span></div>
                                <div class="flex justify-between"><span>Delivery:</span><span class="font-semibold">{{ formatCurrency(item.Delivery) }}</span></div>
                                <div class="flex justify-between"><span>Pickme:</span><span class="font-semibold">{{ formatCurrency(item.Pickme) }}</span></div>
                                <div class="flex justify-between"><span>Uber:</span><span class="font-semibold">{{ formatCurrency(item.Uber) }}</span></div>
                                <div class="flex justify-between font-bold text-sm pt-1 border-t dark:border-slate-600 mt-1 col-span-2"><span>Total:</span><span>{{ formatCurrency(item.Total) }}</span></div>
                            </div>
                            <div class="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600">
                                <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-red-500 dark:text-red-400">
                                    <div class="flex justify-between"><span>Cancelled:</span><span class="font-semibold">{{ item.CancelInvCount }} ({{ formatCurrency(item.CancelInvAmt) }})</span></div>
                                    <div class="flex justify-between"><span>Voids:</span><span class="font-semibold">{{ item.VoidCount }} ({{ formatCurrency(item.VoidAmt) }})</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="widget.id === 'hourlySales'" class="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Hourly Sales Performance</h2>
                    <div v-if="dashboardStore.isHourlySalesLoading" class="animate-pulse"><div class="grid grid-cols-[auto_repeat(12,_minmax(0,_1fr))] gap-1 text-xs"><div class="h-5"></div><div v-for="i in 12" :key="`h-skel-${i}`" class="h-5 bg-gray-200 dark:bg-slate-700 rounded-sm"></div><template v-for="j in 7" :key="`d-skel-${j}`"><div class="h-5"></div><div v-for="k in 12" :key="`c-skel-${k}`" class="h-5 bg-gray-200 dark:bg-slate-700 rounded-sm"></div></template></div></div>
                    <HourlySalesHeatmap v-else :sales-data="dashboardStore.hourlySalesData" :theme="theme" />
                </div>
                <div v-if="widget.id === 'cashFlow'" class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <div class="flex justify-between items-center mb-4"><h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Cash Flow</h2><select v-model="cashFlowPeriod" @change="handleCashFlowPeriodChange" class="border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"><option value="365">Last 365 Days</option><option value="financial_year">This Financial Year</option><option value="last_financial_year">Last Financial Year</option><option value="90">Last 90 Days</option><option value="60">Last 60 Days</option><option value="30">Last 30 Days</option></select></div>
                    <div class="h-80"><div v-if="dashboardStore.isCashFlowLoading" class="h-full w-full rounded-lg bg-gray-200 dark:bg-slate-700 p-4 animate-pulse"><div class="h-full w-full border-l-2 border-b-2 border-gray-300 dark:border-slate-600 flex items-end"><svg class="w-full h-full" preserveAspectRatio="none"><path d="M0,150 C50,100 150,180 250,120 S350,50 400,100" stroke="#a0aec0" stroke-width="4" fill="none" vector-effect="non-scaling-stroke"/></svg></div></div><CashFlowChart v-else :chart-data="dashboardStore.cashFlowData" /></div>
                </div>
            </div>
        </template>
      </div>
     
    </div>
  </MainLayout>

  <div v-if="isAiModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">AI Insights & Analysis</h2><button
          @click="isAiModalOpen = false" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div class="p-6 flex-grow overflow-y-auto bg-gray-50 dark:bg-slate-900 space-y-6">
        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Sales Forecast</h3><button
              @click="dashboardStore.generateSalesForecast()" :disabled="dashboardStore.isForecastLoading"
              class="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400">Generate</button>
          </div>
          <div class="p-3 bg-gray-100 dark:bg-slate-700 rounded min-h-[60px]">
            <div v-if="dashboardStore.isForecastLoading" class="animate-pulse space-y-2">
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
            </div>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400 italic">{{ dashboardStore.aiForecast || 'Generate a forecast based on cash flow data.' }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Supplier Analysis</h3><button
              @click="dashboardStore.generateSupplierAnalysis()" :disabled="dashboardStore.isSupplierAnalysisLoading"
              class="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400">Generate</button>
          </div>
          <div class="p-3 bg-gray-100 dark:bg-slate-700 rounded min-h-[60px]">
            <div v-if="dashboardStore.isSupplierAnalysisLoading" class="animate-pulse space-y-2">
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
            </div>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400 italic">{{ dashboardStore.supplierAnalysis ||
              'Generate an analysis of supplier performance.' }}</p>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-700 dark:text-gray-300">Peak Hours Analysis</h3><button
              @click="dashboardStore.generateHourlyAnalysis()" :disabled="dashboardStore.isHourlyAnalysisLoading"
              class="px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400">Generate</button>
          </div>
          <div class="p-3 bg-gray-100 dark:bg-slate-700 rounded min-h-[60px]">
            <div v-if="dashboardStore.isHourlyAnalysisLoading" class="animate-pulse space-y-2">
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-5/6"></div>
              <div class="h-3 bg-gray-300 dark:bg-slate-600 rounded w-full"></div>
            </div>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400 italic">{{ dashboardStore.hourlyAnalysis ||
              'Generate an analysis of peak business hours.' }}</p>
          </div>
        </div>
      </div>
      <div class="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 text-right"><button
          @click="isAiModalOpen = false"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Close</button></div>
    </div>
  </div>

  <div v-if="dashboardStore.isXReportModalOpen"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">X-Report Details</h2><button
          @click="dashboardStore.closeXReportModal()" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <div class="p-6 overflow-y-auto">
        <div v-if="dashboardStore.isXReportLoading" class="text-center py-10">Loading report...</div>
        <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description
              </th>
              <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            <tr v-for="reportItem in dashboardStore.xReportData" :key="reportItem.ID">
              <td class="px-4 py-2 whitespace-nowrap" :class="getXReportRowClass(reportItem.DESCRIPTION)">{{ reportItem.DESCRIPTION.replace(/[*|-]/g, '') }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">{{
                formatCurrency(reportItem.AMOUNT) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right"><button
          @click="dashboardStore.closeXReportModal()"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Close</button></div>
    </div>
  </div>

  <DashboardSettingsModal v-if="isSettingsModalOpen" @close="isSettingsModalOpen = false" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import CashFlowChart from '@/components/CashFlowChart.vue';
import HourlySalesHeatmap from '@/components/HourlySalesHeatmap.vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme'; // MODIFIED: Import theme store
import { storeToRefs } from 'pinia';
import DashboardSettingsModal from '@/components/DashboardSettingsModal.vue';

const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const themeStore = useThemeStore(); // MODIFIED: Initialize theme store
const { companyName, companyAddress } = storeToRefs(authStore);
const { theme } = storeToRefs(themeStore); // MODIFIED: Get theme reactively

const dateFrom = ref(new Date().toISOString().split('T')[0]);
const dateTo = ref(new Date().toISOString().split('T')[0]);
const cashFlowPeriod = ref('365');
const isAiModalOpen = ref(false);
const isSettingsModalOpen = ref(false);

const formatDate = (date) => date.toISOString().split('T')[0];

const formatCurrency = (value, withSymbol = true) => {
  if (typeof value !== 'number') return 'N/A';
  const options = withSymbol
    ? { style: 'currency', currency: 'LKR' }
    : { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-LK', options).format(value);
};

const calculatePercentage = (amount) => {
  if (dashboardStore.totalSales === 0) return 0;
  const percentage = (amount / dashboardStore.totalSales) * 100;
  return percentage.toFixed(2);
};

const openXReport = (locCode) => {
  dashboardStore.fetchXReport(dateFrom.value, dateTo.value, locCode);
};

const getXReportRowClass = (description) => {
    if (description.includes('*')) {
        return 'font-bold text-gray-900 dark:text-gray-100';
    }
    if (description.includes('-')) {
        return 'text-sm text-gray-500 dark:text-gray-400 pl-8';
    }
    return 'text-sm text-gray-800 dark:text-gray-300';
};

const handleSelectionChange = (locationCode) => {
  dashboardStore.toggleLocationSelection(locationCode);
  dashboardStore.fetchCusCount(dateFrom.value, dateTo.value);
  dashboardStore.fetchSupplierSales(dateFrom.value, dateTo.value);
  dashboardStore.fetchHourlySales(dateFrom.value, dateTo.value);
  handleCashFlowPeriodChange();
};

const handleDataRefresh = () => {
  dashboardStore.fetchSalesSummary(dateFrom.value, dateTo.value);
  dashboardStore.fetchSupplierSales(dateFrom.value, dateTo.value);
  dashboardStore.fetchCusCount(dateFrom.value, dateTo.value);
  dashboardStore.fetchHourlySales(dateFrom.value, dateTo.value);
  dashboardStore.fetchChannelWiseSales(dateFrom.value, dateTo.value);
};

const getWidgetClass = (widgetId) => {
    if (widgetId === 'cashFlow') {
        return 'lg:col-span-2';
    }
    return '';
};

const handleCashFlowPeriodChange = () => {
  let toDate = new Date();
  let fromDate = new Date();
  const period = cashFlowPeriod.value;

  if (period === 'financial_year') {
    const currentMonth = toDate.getMonth();
    const currentYear = toDate.getFullYear();
    fromDate.setFullYear(currentMonth < 3 ? currentYear - 1 : currentYear);
    fromDate.setMonth(3);
    fromDate.setDate(1);
  } else if (period === 'last_financial_year') {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const lastFyEndYear = currentMonth < 3 ? currentYear - 1 : currentYear;

    fromDate = new Date(lastFyEndYear - 1, 3, 1);
    toDate = new Date(lastFyEndYear, 2, 31);
  } else {
    fromDate.setDate(toDate.getDate() - parseInt(period));
  }

  dashboardStore.fetchCashFlow(formatDate(fromDate), formatDate(toDate));
};

const downloadSalesSummaryPDF = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(companyName.value, 14, 22);
  doc.setFontSize(10);
  const addressLines = companyAddress.value.split('\r\n').map(line => line.trim());
  doc.text(addressLines, 14, 30);

  doc.setFontSize(12);
  doc.text(`Sales Summary Report (${dateFrom.value} to ${dateTo.value})`, 14, 45);

  const tableColumn = ["Location", "Amount (LKR)", "Percentage (%)"];
  const tableRows = [];

  dashboardStore.salesSummary.forEach(item => {
    const rowData = [
      item.locName,
      formatCurrency(item.amt, false),
      calculatePercentage(item.amt)
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'striped',
    headStyles: { fillColor: [44, 62, 80] },
  });

  let finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Sales', 14, finalY + 10);
  doc.text(formatCurrency(dashboardStore.totalSales), 200, finalY + 10, { align: 'right' });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    doc.text('Powered by Caspersoft', 14, 287);
  }

  doc.save(`sales_summary_${dateFrom.value}_${dateTo.value}.pdf`);
};

const downloadSupplierSalesPDF = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(companyName.value, 14, 22);
  doc.setFontSize(10);
  const addressLines = companyAddress.value.split('\r\n').map(line => line.trim());
  doc.text(addressLines, 14, 30);

  doc.setFontSize(12);
  doc.text(`Supplier Sales Summary Report (${dateFrom.value} to ${dateTo.value})`, 14, 45);

  const tableColumn = ["Supplier", "Amount (LKR)", "%", "Liters (ml)"];
  const tableRows = [];

  dashboardStore.supplierSales.forEach(item => {
    const rowData = [
      item.supName,
      formatCurrency(item.amt, false),
      item.pr.toFixed(2),
      item.ltr.toLocaleString('en-US')
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 55,
    theme: 'striped',
    headStyles: { fillColor: [44, 62, 80] },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, 287, { align: 'center' });
    doc.text('Powered by Caspersoft', 14, 287);
  }

  doc.save(`supplier_sales_summary_${dateFrom.value}_${dateTo.value}.pdf`);
};

onMounted(() => {
  authStore.fetchCompany();
  handleDataRefresh();
  handleCashFlowPeriodChange();
});
</script>
