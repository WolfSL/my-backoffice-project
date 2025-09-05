<template>
  <MainLayout>
    <div class="container mx-auto flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Invoice Detail Report</h1>
        <div class="flex items-center space-x-2">
          <button @click="isHelpModalOpen = true" class="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors" title="Help">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <button @click="isAiModalOpen = true" class="w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors" title="Ask AI">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.938V19h-2v-4.062a4.5 4.5 0 01-4-4.438V6.5A4.5 4.5 0 0110 2a4.5 4.5 0 014.5 4.5v2.5a4.5 4.5 0 01-4 4.438z" clip-rule="evenodd" />
            </svg>
          </button>
          <button @click="isOptionsModalOpen = true" class="w-10 h-10 flex items-center justify-center bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors" title="Options">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
          </button>
          <button @click="exportToExcel" class="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors" title="Export to Excel">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
          </button>
          <button @click="printReport" class="w-10 h-10 flex items-center justify-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" title="Print Report">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="flex items-center space-x-4 mb-4 flex-shrink-0">
            <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input v-model="dateFrom" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative flex-1">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input v-model="dateTo" type="date" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="relative flex-1">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <button @click="isLocationModalOpen = true" class="w-full text-left pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                    {{ selectedLocations.length }} location(s) selected
                </button>
            </div>
            <button @click="generateReport" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 h-10">Generate</button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 flex-shrink-0">
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Amount</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalAmount, false) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Gross</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalGross, false) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total Discount</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalDiscount, false) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-center">
                <h4 class="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total S/Charge</h4>
                <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ formatCurrency(totalServiceCharge, false) }}</p>
            </div>
        </div>

        <div class="flex justify-between items-center mb-2 flex-shrink-0">
            <div class="flex items-center space-x-4 text-xs">
                <button @click="setHighlightFilter('cancelled')" class="flex items-center p-1 rounded" :class="{'bg-purple-200 dark:bg-purple-800/50': activeHighlightFilter === 'cancelled'}">
                    <div class="w-4 h-4 bg-purple-200 dark:bg-purple-800/50 border border-purple-400 rounded-sm mr-2"></div>
                    <span class="text-gray-600 dark:text-gray-400">Cancelled Invoice</span>
                </button>
                <button @click="setHighlightFilter('voids')" class="flex items-center p-1 rounded" :class="{'bg-yellow-200 dark:bg-yellow-800/50': activeHighlightFilter === 'voids'}">
                    <div class="w-4 h-4 bg-yellow-200 dark:bg-yellow-800/50 border border-yellow-400 rounded-sm mr-2"></div>
                    <span class="text-gray-600 dark:text-gray-400">Contains Void Items</span>
                </button>
                <button v-if="activeHighlightFilter" @click="setHighlightFilter(null)" class="text-xs text-indigo-500 hover:underline">Clear Filter</button>
            </div>
            <div class="relative">
                <input v-model="globalSearch" type="text" placeholder="Search report..." class="w-64 pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
        
        <div v-if="reportsStore.isLoadingInvoiceDetail" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading report data...</p></div>
        <div v-else-if="reportsStore.errorInvoiceDetail" class="text-center py-10 text-red-500 flex-grow">{{ reportsStore.errorInvoiceDetail }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="w-12 px-4 py-2">
                  <button v-if="reportOptions.viewMode === 'expandable'" @click="toggleAllRows" class="p-1" :title="areAllExpanded ? 'Collapse All' : 'Expand All'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path v-if="areAllExpanded" fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </th>
                <th v-for="header in activeHeaders" :key="header.key" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" :class="header.align === 'right' ? 'text-right' : ''">
                  <div class="flex items-center" :class="header.align === 'right' ? 'justify-end' : ''">
                    <span>{{ header.label }}</span>
                    <button @click="sortBy(header.key)" class="ml-1">
                      <svg v-if="sortKey === header.key && sortOrder === 'asc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>
                      <svg v-else-if="sortKey === header.key && sortOrder === 'desc'" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                      <svg v-else class="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <template v-for="invoice in filteredAndSortedReport" :key="invoice.INV_NO">
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50" :class="{ 'bg-purple-100 dark:bg-purple-800/50': invoice.ISCANCEL === 1, 'bg-yellow-100 dark:bg-yellow-800/50': invoice.ISCANCEL !== 1 && invoice.hasVoidItem }">
                    <td class="px-4 py-2">
                        <button v-if="reportOptions.viewMode === 'expandable'" @click="toggleRow(invoice.INV_NO)" class="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform" :class="{'rotate-90': expandedRows.includes(invoice.INV_NO)}" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </td>
                    <td v-for="header in activeHeaders" :key="`cell-${invoice.INV_NO}-${header.key}`" class="px-4 py-2 whitespace-nowrap text-xs text-gray-800 dark:text-gray-300" :class="header.align === 'right' ? 'text-right' : ''">
                      {{ formatCell(invoice, header.key) }}
                    </td>
                </tr>
                <tr v-if="expandedRows.includes(invoice.INV_NO) || reportOptions.viewMode === 'viewAll'">
                    <td :colspan="activeHeaders.length + 1" class="p-4 bg-gray-100 dark:bg-slate-900">
                        <table class="min-w-full">
                            <thead class="bg-gray-200 dark:bg-slate-800">
                                <tr>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Item</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price Level</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price Group</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Qty</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Cost</th>
                                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Line Amount</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">KOT Time</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Slip No</th>
                                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">VSlip No</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-slate-700">
                                <tr v-for="item in invoice.items" :key="item.INV_LINENO" :class="itemRowClass(item)">
                                    <td class="px-4 py-2 text-xs">{{ item.INV_ITEM }} - {{ item.INV_DESC }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item.PriceLevel }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item.PriceGroup }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ item.INV_QTY }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(item.INV_PRICE, false) }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(item.INV_COST, false) }}</td>
                                    <td class="px-4 py-2 text-xs text-right">{{ formatCurrency(item.LINE_AMT, false) }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item.KOT_TIME ? new Date(item.KOT_TIME).toLocaleTimeString() : 'N/A' }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item.SLIP }}</td>
                                    <td class="px-4 py-2 text-xs">{{ item.VSPLIP }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
              </template>
              <tr v-if="filteredAndSortedReport.length === 0">
                <td :colspan="activeHeaders.length + 1" class="text-center py-10 text-gray-500 dark:text-gray-400">No data to display. Please generate or adjust filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <!-- Location Selector Modal -->
  <div v-if="isLocationModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
          <div class="p-5 border-b dark:border-slate-700">
              <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Locations</h2>
              <input v-model="locationSearchText" type="text" placeholder="Search locations..." class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          </div>
          <div class="p-6 overflow-y-auto">
              <ul>
                  <li v-for="loc in filteredLocations" :key="loc.locCode" class="py-2 border-b dark:border-slate-700">
                      <label class="flex items-center">
                          <input type="checkbox" :value="loc.locCode" v-model="selectedLocations" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                          <div class="ml-3">
                              <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ loc.locName }}</p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">{{ loc.master }}</p>
                          </div>
                      </label>
                  </li>
              </ul>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
              <button @click="isLocationModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
          </div>
      </div>
  </div>
  
  <!-- Options Modal -->
  <div v-if="isOptionsModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-5 border-b dark:border-slate-700">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Report Options</h2>
      </div>
      <div class="p-6 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">View Mode</h3>
            <div class="flex space-x-4">
                <label class="flex items-center">
                    <input type="radio" v-model="reportOptions.viewMode" value="expandable" class="h-4 w-4 text-indigo-600 border-gray-300">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Expandable View</span>
                </label>
                <label class="flex items-center">
                    <input type="radio" v-model="reportOptions.viewMode" value="viewAll" class="h-4 w-4 text-indigo-600 border-gray-300">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View All Details</span>
                </label>
            </div>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">Optional Columns</h3>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="option in optionalColumns" :key="option.key" class="flex items-center">
              <input type="checkbox" v-model="reportOptions[option.key]" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
        <button @click="isOptionsModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
      </div>
    </div>
  </div>
  
  <!-- AI Modal -->
    <div v-if="isAiModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col">
            <div class="p-5 border-b dark:border-slate-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Ask AI about this Report</h2>
            </div>
            <div class="p-6 overflow-y-auto flex-grow">
                <textarea v-model="aiQuery" placeholder="Ask a question about the current report data... e.g., 'Which location had the highest total amount?'" rows="4" class="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"></textarea>
                <div v-if="reportsStore.isAiLoading" class="mt-4 text-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Thinking...</p>
                </div>
                <div v-if="reportsStore.aiResponse" class="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div class="text-sm text-gray-800 dark:text-gray-200" v-html="reportsStore.aiResponse"></div>
                </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-between items-center">
                <div>
                    <button v-if="!reportsStore.isAiLoading && reportsStore.aiResponse" @click="handleResendAiQuery" class="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md text-sm">
                        Resend Last Query
                    </button>
                </div>
                <div class="flex space-x-4">
                    <button @click="isAiModalOpen = false" class="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-md">Close</button>
                    <button @click="handleAskAi" :disabled="!aiQuery || reportsStore.isAiLoading" class="px-4 py-2 bg-cyan-600 text-white rounded-md disabled:bg-cyan-400">Ask Question</button>
                </div>
            </div>
        </div>
    </div>
    
  <!-- Help Modal -->
    <div v-if="isHelpModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div class="p-5 border-b dark:border-slate-700">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Report Guide</h2>
            </div>
            <div class="p-6 overflow-y-auto flex-grow text-sm text-gray-700 dark:text-gray-300 space-y-4">
                <p>This report provides a detailed breakdown of all invoices within a selected date range and for specific locations.</p>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>Filtering:</strong> Use the date pickers and location selector to narrow down the data. Click 'Generate' to apply filters.</li>
                    <li><strong>KPIs:</strong> The cards at the top show a summary of the currently displayed data.</li>
                    <li><strong>Highlight Legend:</strong> Click on a color key (e.g., "Cancelled Invoice") to filter the table and show only those specific invoices.</li>
                    <li><strong>Sorting:</strong> Click on any column header to sort the data. Click again to reverse the order.</li>
                    <li><strong>Expanding:</strong> In "Expandable View", click the arrow on any row to see its line items. Use the button in the header to expand or collapse all rows at once.</li>
                    <li><strong>Options:</strong> Click the settings icon to toggle optional columns or switch to "View All" mode, which shows all line items by default.</li>
                    <li><strong>Ask AI:</strong> Click the AI icon to ask natural language questions about the report data (e.g., "What was the total amount for cancelled invoices?").</li>
                </ul>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right">
                <button @click="isHelpModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useReportsStore } from '@/stores/reports';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const reportsStore = useReportsStore();
const mastersStore = useMastersStore();
const authStore = useAuthStore();
const { isAiLoading, aiResponse } = storeToRefs(reportsStore);

const dateFrom = ref(new Date().toISOString().split('T')[0]);
const dateTo = ref(new Date().toISOString().split('T')[0]);

const isLocationModalOpen = ref(false);
const locationSearchText = ref('');
const selectedLocations = ref([]);
const isOptionsModalOpen = ref(false);
const expandedRows = ref([]);
const areAllExpanded = ref(false);
const isAiModalOpen = ref(false);
const isHelpModalOpen = ref(false);
const aiQuery = ref('');
const activeHighlightFilter = ref(null);
const globalSearch = ref('');

const sortKey = ref('INV_NO');
const sortOrder = ref('asc');
const filters = ref({});

const reportOptions = ref({
    showCashier: false,
    showSteward: false,
    viewMode: 'expandable', // 'expandable' or 'viewAll'
});

const optionalColumns = [
    { key: 'showCashier', label: 'Cashier' },
    { key: 'showSteward', label: 'Steward' },
];

const headers = ref([
  { key: 'INV_LOCATION', label: 'Location', visible: true, filterable: true },
  { key: 'INV_NO', label: 'Invoice No', visible: true, filterable: true },
  { key: 'INV_DATE', label: 'Date', visible: true, filterable: false },
  { key: 'INV_TIME', label: 'Time', visible: true, filterable: false },
  { key: 'INV_AMOUNT', label: 'Amount', visible: true, align: 'right' },
  { key: 'INV_GROSS', label: 'Gross', visible: true, align: 'right' },
  { key: 'INV_DISVAL', label: 'Discount', visible: true, align: 'right' },
  { key: 'INV_SC_AMT', label: 'S/Charge', visible: true, align: 'right' },
  { key: 'INV_CASHIER', label: 'Cashier', visible: computed(() => reportOptions.value.showCashier), filterable: true },
  { key: 'STEWARDNAME', label: 'Steward', visible: computed(() => reportOptions.value.showSteward), filterable: true },
]);

const activeHeaders = computed(() => headers.value.filter(h => h.visible === true || h.visible.value));

const groupedReportData = computed(() => {
    const invoices = {};
    reportsStore.invoiceDetailReport.forEach(item => {
        if (!invoices[item.INV_NO]) {
            invoices[item.INV_NO] = {
                ...item,
                items: [],
                hasVoidItem: false
            };
        }
        if (item.INV_VOID) {
            invoices[item.INV_NO].hasVoidItem = true;
        }
        invoices[item.INV_NO].items.push(item);
    });
    return Object.values(invoices);
});

const generateReport = () => {
  const locations = selectedLocations.value.length > 0 ? selectedLocations.value.map(code => `'${code}'`).join(',') : "'X'";
  reportsStore.fetchInvoiceDetailReport(dateFrom.value, dateTo.value, locations);
  filters.value = {};
  sortKey.value = 'INV_NO';
  sortOrder.value = 'asc';
  expandedRows.value = [];
  areAllExpanded.value = false;
};

const formatCell = (item, key) => {
    const value = item[key];
    switch(key) {
        case 'INV_DATE': return new Date(value).toLocaleDateString();
        case 'INV_TIME': return new Date(value).toLocaleTimeString();
        case 'INV_AMOUNT':
        case 'INV_GROSS':
        case 'INV_DISVAL':
        case 'INV_SC_AMT':
            return formatCurrency(value, false);
        default:
            return value;
    }
};

const formatCurrency = (value, withSymbol = true) => {
  if (typeof value !== 'number') return 'N/A';
  const options = withSymbol
    ? { style: 'currency', currency: 'LKR' }
    : { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-LK', options).format(value);
};

const filteredLocations = computed(() => {
    if (!locationSearchText.value) return mastersStore.locations;
    return mastersStore.locations.filter(loc =>
        loc.locName.toLowerCase().includes(locationSearchText.value.toLowerCase()) ||
        loc.master.toLowerCase().includes(locationSearchText.value.toLowerCase())
    );
});

const filteredAndSortedReport = computed(() => {
  let data = [...groupedReportData.value];

  if (activeHighlightFilter.value) {
      if (activeHighlightFilter.value === 'cancelled') {
          data = data.filter(inv => inv.ISCANCEL === 1);
      } else if (activeHighlightFilter.value === 'voids') {
          data = data.filter(inv => inv.hasVoidItem && inv.ISCANCEL !== 1);
      }
  }

  if (globalSearch.value) {
      const searchTerm = globalSearch.value.toLowerCase();
      data = data.filter(invoice => {
          if (invoice.INV_CASHIER?.toLowerCase().includes(searchTerm)) {
              return true;
          }
          return invoice.items.some(item => 
              item.INV_ITEM?.toLowerCase().includes(searchTerm) ||
              item.INV_DESC?.toLowerCase().includes(searchTerm)
          );
      });
  }

  data = data.filter(item => {
    return Object.keys(filters.value).every(key => {
      if (!filters.value[key] || !activeHeaders.value.find(h => h.key === key)?.filterable) return true;
      return String(item[key]).toLowerCase().includes(filters.value[key].toLowerCase());
    });
  });

  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const totalAmount = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.INV_AMOUNT, 0));
const totalGross = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.INV_GROSS, 0));
const totalDiscount = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.INV_DISVAL, 0));
const totalServiceCharge = computed(() => filteredAndSortedReport.value.reduce((sum, item) => sum + item.INV_SC_AMT, 0));

const toggleRow = (invNo) => {
    const index = expandedRows.value.indexOf(invNo);
    if (index > -1) {
        expandedRows.value.splice(index, 1);
    } else {
        expandedRows.value.push(invNo);
    }
};

const toggleAllRows = () => {
    if (areAllExpanded.value) {
        expandedRows.value = [];
    } else {
        expandedRows.value = filteredAndSortedReport.value.map(inv => inv.INV_NO);
    }
    areAllExpanded.value = !areAllExpanded.value;
};

const itemRowClass = (item) => {
  if (item.INV_VOID) {
    return item.SLIP === 0 
      ? 'bg-orange-100 dark:bg-orange-800/50' // Pre-KOT Void
      : 'bg-red-100 dark:bg-red-800/50';      // Regular Void
  }
  return '';
};

const setHighlightFilter = (filterType) => {
    if (activeHighlightFilter.value === filterType) {
        activeHighlightFilter.value = null; // Toggle off if already selected
    } else {
        activeHighlightFilter.value = filterType;
    }
};

const handleAskAi = () => {
    if (!aiQuery.value) return;
    reportsStore.askAiAboutInvoiceData(filteredAndSortedReport.value, aiQuery.value);
};

const handleResendAiQuery = () => {
    reportsStore.askAiAboutInvoiceData(filteredAndSortedReport.value, reportsStore.lastAiQuery);
};

const printReport = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Add Company Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(authStore.companyName, 14, 15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const addressLines = authStore.companyAddress.split('\r\n').map(line => line.trim());
    doc.text(addressLines, 14, 21);
    
    // Add Report Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice Detail Report (${dateFrom.value} to ${dateTo.value})`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
    const body = [];
    filteredAndSortedReport.value.forEach(invoice => {
        const invRow = {};
        activeHeaders.value.forEach(header => {
            invRow[header.key] = formatCell(invoice, header.key);
        });
        body.push(invRow);

        if (reportOptions.value.viewMode === 'viewAll') {
            invoice.items.forEach(item => {
                const itemRow = {
                    'INV_LOCATION': `  └ ${item.INV_ITEM} - ${item.INV_DESC}`,
                    'PriceLevel': item.PriceLevel,
                    'PriceGroup': item.PriceGroup,
                    'INV_QTY': item.INV_QTY,
                    'INV_PRICE': formatCurrency(item.INV_PRICE, false),
                    'INV_COST': formatCurrency(item.INV_COST, false),
                    'LINE_AMT': formatCurrency(item.LINE_AMT, false),
                };
                body.push(itemRow);
            });
        }
    });

    doc.autoTable({
        head: [activeHeaders.value.map(h => h.label)],
        body: body.map(row => activeHeaders.value.map(h => row[h.key] || '')),
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const y = doc.internal.pageSize.getHeight() - 10;
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        doc.text('Powered by Caspersoft', 14, y);
    }

    doc.save(`Invoice_Detail_Report_${dateFrom.value}_${dateTo.value}.pdf`);
};

const exportToExcel = () => {
    const dataToExport = filteredAndSortedReport.value.flatMap(invoice => {
        const headerData = { 'Invoice No': invoice.INV_NO, 'Date': new Date(invoice.INV_DATE).toLocaleDateString(), 'Amount': invoice.INV_AMOUNT };
        const itemRows = invoice.items.map(item => ({
            '': '  ->',
            'Item Code': item.INV_ITEM,
            'Description': item.INV_DESC,
            'Qty': item.INV_QTY,
            'Line Amount': item.LINE_AMT
        }));
        return [headerData, ...itemRows];
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice Details');
    XLSX.writeFile(workbook, `Invoice_Detail_Report_${dateFrom.value}_${dateTo.value}.xlsx`);
};

onMounted(() => {
  mastersStore.fetchLocations();
});
</script>
" in the canvas "vue-starter-invoice-detail-view".
