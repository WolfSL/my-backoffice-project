<template>
  <MainLayout>
    <div v-if="successMessage" class="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ successMessage }}
    </div>
    <div v-if="operationError" class="fixed top-5 right-5 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ operationError }}
    </div>

    <div class="container mx-auto flex flex-col h-full">
      <div class="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">Manage Items</h1>
        <button @click="openAddModal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Item
        </button>
      </div>

      <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 flex-shrink-0">
          <input v-model="filterCode" type="text" placeholder="Search Code..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <input v-model="filterDescription" type="text" placeholder="Search Description..." class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
          <select v-model="filterDepartment" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Departments</option>
            <option v-for="dept in mastersStore.departments" :key="dept.DeptCode" :value="dept.Description">{{ dept.Description }}</option>
          </select>
          <select v-model="filterSubDepartment" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Sub-Departments</option>
            <option v-for="subDept in mastersStore.subDepartments" :key="subDept.SubDeptCode" :value="subDept.Description">{{ subDept.Description }}</option>
          </select>
          <select v-model="filterSupplier" class="px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <option value="">All Suppliers</option>
            <option v-for="supplier in mastersStore.suppliers" :key="supplier.id" :value="supplier.Descreption">{{ supplier.Descreption }}</option>
          </select>
        </div>

        <div v-if="mastersStore.isLoading" class="text-center py-10 flex-grow"><p class="dark:text-gray-400">Loading items...</p></div>
        <div v-else-if="mastersStore.error" class="text-center py-10 text-red-500 flex-grow">{{ mastersStore.error }}</div>
        <div v-else class="overflow-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sub-Dept</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                <th class="sticky right-0 bg-gray-50 dark:bg-slate-700 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="item in filteredItems" :key="item.code">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{{ item.code }}</td>
                <td class="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 max-w-xs whitespace-normal break-words">{{ item.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.department }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.subDepartment }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ item.supplier }}</td>
                <td class="sticky right-0 bg-white dark:bg-slate-800 px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">Edit</button>
                  <button @click="openDeleteModal(item)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
              <tr v-if="filteredItems.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500 dark:text-gray-400">No items match your criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>

  <!-- Add/Edit Item Modal -->
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <div class="pl-5 pr-5 pt-2 pb-1 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ isEditing ? 'Edit Product' : 'New Product' }}</h2>
        <!-- <button @click="isModalOpen = false" class="p-2 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">&times;</button> -->
        <div class="flex items-center space-x-2">
          <!-- MODIFIED: Added Print button, only visible in edit mode -->
          <button v-if="isEditing" @click="printItemDetailsPDF" class="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>
          </button>
          <button @click="isModalOpen = false" class="p-2 text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">&times;</button>
        </div>
      </div>
      
      <div class="p-6 flex-grow overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6 border-b dark:border-slate-700 pb-6">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label><select v-model="editableItem.department" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="d in mastersStore.departments" :key="d.DeptCode" :value="d.DeptCode">{{ d.Description }}</option></select></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sub Department</label><select v-model="editableItem.subDepartment" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="sd in filteredSubDepartments" :key="sd.SubDeptCode" :value="sd.SubDeptCode">{{ sd.Description }}</option></select></div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Code</label>
            <div v-if="!isEditing" class="mt-1 relative rounded-md shadow-sm">
              <input v-model="editableItem.itemCode" type="text" class="block w-full pr-20 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              <button @click="getNextItemCode" type="button" class="absolute inset-y-0 right-0 px-4 py-2 border-l text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-r-md">Get Next</button>
            </div>
            <input v-else :value="editableItem.itemCode" type="text" readonly class="mt-1 px-2 py-1 w-full bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <p v-if="validationErrors.itemCode" class="text-xs text-red-600 mt-1">{{ validationErrors.itemCode }}</p>
          </div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label><select v-model="editableItem.uom" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="u in mastersStore.units" :key="u.UnitCode" :value="u.UnitCode">{{ u.Description }}</option></select></div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input v-model="editableItem.description" type="text" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
            <p v-if="validationErrors.description" class="text-xs text-red-600 mt-1">{{ validationErrors.description }}</p>
          </div>
        </div>

        <div class="border-b border-gray-200 dark:border-slate-700">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" :class="[activeTab === tab.name ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300']" class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="pt-6">
          <div v-if="activeTab === 'Details'">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-4">
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label><select v-model="editableItem.supplierCode" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="s in mastersStore.suppliers" :key="s.id" :value="s.id">{{ s.Descreption }}</option></select></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost</label><input v-model.number="editableItem.listPrice" type="number" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">PLU Type</label><select v-model="editableItem.pluType" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="pt in mastersStore.pluTypes" :key="pt.Code" :value="pt.Code">{{ pt.Description }}</option></select></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Printer</label><select v-model="editableItem.itemType" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"><option v-for="p in mastersStore.printTypes" :key="p.PRNTTYPE" :value="p.PRNTTYPE">{{ p.TYPEDESC }}</option></select></div>
              </div>
              <div class="space-y-4">
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Unitpack</label><input v-model.number="editableItem.unitpack" type="number" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Re-Order Level</label><input v-model.number="editableItem.rol" type="number" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
                <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Comments</label><input v-model="editableItem.comments" type="text" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300"></div>
              </div>
              <div class="space-y-4 pt-2">
                <div v-for="option in itemOptions" :key="option.key" class="flex items-center">
                  <input v-model="editableItem[option.key]" :id="option.key" type="checkbox" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                  <label :for="option.key" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ option.label }}</label>
                </div>
              </div>
            </div>
            <div class="mt-6 border-t dark:border-slate-700 pt-6"><h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Barcodes</h3><input v-model="editableItem.barcodes" type="text" class="mt-2 px-2 py-1 w-full md:w-1/2 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300" placeholder="Enter barcode..."></div>
          </div>
          <div v-if="activeTab === 'Pricing'">
            <div class="flex flex-wrap items-end gap-4">
              <div class="relative flex-1 min-w-[240px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Locations</label>
                <button @click="isLocationModalOpen = true" class="mt-1 w-full text-left px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                  {{ selectedLocations.length }} location(s) selected
                </button>
              </div>
              <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Level</label>
                <select v-model="selectedPriceLevel" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
                  <option v-for="pl in mastersStore.priceLevels" :key="pl.PricelevelCode" :value="pl.PricelevelCode">{{ pl.PriceLevel }}</option>
                </select>
              </div>
              <div class="flex-1 min-w-[100px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selling</label>
                <input v-model.number="sellingPrice" type="number" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              </div>
              <div class="flex-1 min-w-[100px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">M.Selling</label>
                <input v-model.number="mSellingPrice" type="number" class="mt-1 px-2 py-1 w-full dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
              </div>
              <div class="flex-shrink-0">
                <button @click="addPrice" type="button" class="px-4 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 flex items-center h-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                  Add
                </button>
              </div>
            </div>
            <div class="mt-2 border-t dark:border-slate-700 pt-4">
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Prices</h3>
              <div class="max-h-64 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead class="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Location</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price Level</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Selling</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">M.Selling</th>
                      <th class="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    <tr v-for="(price, index) in mastersStore.currentItemPrices" :key="index">
                      <td class="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">{{ price.locationName }}</td>
                      <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{{ price.priceLevelName }}</td>
                      <td class="px-4 py-2 text-sm text-right text-gray-800 dark:text-gray-300">{{ formatCurrency(price.selling) }}</td>
                      <td class="px-4 py-2 text-sm text-right text-gray-800 dark:text-gray-300">{{ formatCurrency(price.mSelling) }}</td>
                      <td class="px-4 py-2 text-center"><button @click="removePrice(index)" class="text-red-500 hover:text-red-700">&times;</button></td>
                    </tr>
                    <tr v-if="mastersStore.currentItemPrices.length === 0"><td colspan="5" class="text-center py-4 text-gray-500 dark:text-gray-400">No prices added yet.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- MODIFIED: Fully functional BOM Tab -->
          <div v-if="activeTab === 'BOM'">
            <div class="flex flex-wrap items-end gap-4">
              <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <select v-model="bomLocation" class="mt-1 px-2 py-1 w-full">
                  <option v-for="loc in mastersStore.locations" :key="loc.locCode" :value="loc.locCode">{{ loc.locName }}</option>
                </select>
              </div>
              <div class="flex-1 min-w-[150px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Level</label>
                <select v-model="bomPriceLevel" class="mt-1 px-2 py-1 w-full">
                  <option v-for="pl in mastersStore.priceLevels" :key="pl.PricelevelCode" :value="pl.PricelevelCode">{{ pl.PriceLevel }}</option>
                </select>
              </div>
              <div class="relative flex-1 min-w-[240px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Component Item</label>
                <button @click="isItemSelectorOpen = true" class="mt-1 w-full text-left px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-white dark:bg-slate-700 dark:border-slate-600">
                  {{ selectedBomItem ? selectedBomItem.ItemDescription : 'Click to search...' }}
                </button>
              </div>
              <div class="flex-1 min-w-[100px]">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input v-model.number="bomQuantity" type="number" class="mt-1 px-2 py-1 w-full">
              </div>
              <div class="flex-shrink-0">
                <button @click="addBomComponent" type="button" class="px-4 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 flex items-center h-8">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                  Add
                </button>
              </div>
            </div>
            <div class="mt-6 border-t dark:border-slate-700 pt-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Bill of Materials for {{ selectedLocationName }}</h3>
                <div class="text-right">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Total Cost:</span>
                  <p class="font-bold text-lg text-gray-900 dark:text-gray-100">{{ formatCurrency(totalBomCost) }}</p>
                </div>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead class="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Item Code</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Description</th>
                      <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Unit</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Qty</th>
                      <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Total Cost</th>
                      <th class="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                    <tr v-for="(bom, index) in mastersStore.currentItemBOM" :key="index">
                      <td class="px-4 py-2 text-sm text-gray-800 dark:text-gray-300">{{ bom.itemCode }}</td>
                      <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{{ bom.itemDescription }}</td>
                      <td class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{{ bom.unitpack }} {{ bom.uom }}</td>
                      <td class="px-4 py-2 text-sm text-right text-gray-800 dark:text-gray-300">{{ bom.quantity }}</td>
                      <td class="px-4 py-2 text-sm text-right text-gray-800 dark:text-gray-300">{{ formatCurrency(bom.totalCost) }}</td>
                      <td class="px-4 py-2 text-center"><button @click="removeBomComponent(bom)" class="text-red-500 hover:text-red-700">&times;</button></td>
                    </tr>
                    <tr v-if="mastersStore.currentItemBOM.length === 0"><td colspan="6" class="text-center py-4 text-gray-500 dark:text-gray-400">No BOM components for this location/price level.</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-end items-center space-x-4 flex-shrink-0">
          <button @click="isModalOpen = false" type="button" class="px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border dark:border-slate-600 rounded-md">Cancel</button>
          <button @click="handleSaveItem" :disabled="mastersStore.isAdding || mastersStore.isUpdating" type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:bg-indigo-400">
            {{ isEditing ? (mastersStore.isUpdating ? 'Saving...' : 'Save Changes') : (mastersStore.isAdding ? 'Saving...' : 'Save Item') }}
          </button>
        </div>
    </div>
  </div>

  <!-- Location Selector Modal -->
  <div v-if="isLocationModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Locations</h2>
        <input v-model="locationSearchText" type="text" placeholder="Search locations..." class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto flex-grow">
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
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right flex-shrink-0">
        <button @click="isLocationModalOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Done</button>
      </div>
    </div>
  </div>

  <!-- Item Selector Modal for BOM -->
  <div v-if="isItemSelectorOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[70vh] flex flex-col">
      <div class="p-5 border-b dark:border-slate-700 flex-shrink-0">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Select Component Item</h2>
        <input v-model="itemSearchText" @input="searchItems" type="text" placeholder="Search for items..." class="w-full mt-4 px-2 py-1 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300">
      </div>
      <div class="p-6 overflow-y-auto flex-grow">
        <ul>
          <li v-for="item in mastersStore.transactionItems" :key="item.ItemCode" @click="selectBomItem(item)" class="py-2 border-b dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-200">{{ item.ItemDescription }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.ItemCode }} - {{ item.SubDepartment }} | {{ item.Unitpack }} {{ item.UOM }}</p>
          </li>
        </ul>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700 text-right flex-shrink-0">
        <button @click="isItemSelectorOpen = false" class="px-4 py-2 bg-indigo-600 text-white rounded-md">Close</button>
      </div>
    </div>
  </div>

  <!-- Delete Modal -->
  <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6"><h3 class="text-lg font-medium text-gray-900 dark:text-gray-200">Delete Item</h3><div class="mt-2"><p class="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this item?</p><p v-if="itemToDelete" class="mt-2 font-semibold text-gray-700 dark:text-gray-300">{{ itemToDelete.description }}</p></div></div>
      <div class="bg-gray-50 dark:bg-slate-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button @click="handleDeleteItem" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">Delete</button>
        <button @click="isDeleteModalOpen = false" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useMastersStore } from '@/stores/masters';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import apiService from '@/services/apiService';

const mastersStore = useMastersStore();
const authStore = useAuthStore();
const { successMessage, operationError } = storeToRefs(mastersStore);

const filterCode = ref('');
const filterDescription = ref('');
const filterDepartment = ref('');
const filterSubDepartment = ref('');
const filterSupplier = ref('');

const isModalOpen = ref(false);
const isEditing = ref(false);
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);
const activeTab = ref('Details');
const tabs = [{ name: 'Details' }, { name: 'Pricing' }, { name: 'BOM' }];
const validationErrors = ref({});

const isLocationModalOpen = ref(false);
const locationSearchText = ref('');
const selectedLocations = ref([]);
const selectedPriceLevel = ref('');
const sellingPrice = ref(0);
const mSellingPrice = ref(0);

const isItemSelectorOpen = ref(false);
const itemSearchText = ref('');
const selectedBomItem = ref(null);
const bomQuantity = ref(1);
const bomLocation = ref('');
const bomPriceLevel = ref('');

const defaultItem = () => ({
  pluType: '', itemCode: '', description: '', serialNo: '', subDepartment: '',
  supplierCode: '', unitpack: 0, uom: '', activeItem: true, comments: '',
  transmit: 0, rol: 0, overhead: 0, suppbkord: 0, custbkord: 0,
  listPrice: 0, ismain: true, isopen: false, taxable: false, isService: false,
  createUser: authStore.user?.Username || 'admin', itemType: '', barcodes: ''
});

const editableItem = ref(defaultItem());

const itemOptions = [
  { key: 'activeItem', label: 'Active' },
  { key: 'isService', label: 'Service Charge' },
  { key: 'isopen', label: 'Open price' },
  { key: 'taxable', label: 'Taxable' },
  { key: 'ismain', label: 'Main Item' },
];

const isHoUser = computed(() => authStore.user?.LocationCode === 'HO');

watch(selectedLocations, (newVal) => {
  if (newVal.length > 0) {
    mastersStore.fetchPriceLevels(newVal[0]);
    const formattedLocCodes = newVal.map(code => `'${code}'`).join(',');
    mastersStore.fetchItemPrices(editableItem.value.itemCode, formattedLocCodes);
  } else {
    mastersStore.priceLevels = [];
    mastersStore.fetchItemPrices(editableItem.value.itemCode);
  }
});

watch([bomLocation, bomPriceLevel], ([newLoc, newPlevel]) => {
    if(newLoc && newPlevel) {
        mastersStore.fetchItemBOM(editableItem.value.itemCode, newLoc, newPlevel);
    }
});

const openAddModal = () => {
  isEditing.value = false;
  editableItem.value = defaultItem();
  mastersStore.currentItemPrices = [];
  mastersStore.currentItemBOM = [];
  activeTab.value = 'Details';
  validationErrors.value = {};
  isModalOpen.value = true;
};

const openEditModal = async (item) => {
  const details = await mastersStore.fetchItemDetails(item.code);
  await mastersStore.fetchItemPrices(item.code);
  if (details) {
    editableItem.value = {
        ...defaultItem(),
        pluType: details.PluType, itemCode: details.ItemCode, description: details.Description,
        subDepartment: details.SubDepartment, supplierCode: details.SupplierCode, uom: details.UOM,
        activeItem: details.ActiveItem, comments: details.Comments, rol: details.Rol,
        listPrice: details.ListPrice, ismain: details.ISMAIN, isopen: details.ISOPEN,
        taxable: details.Taxable, isService: details.isService, itemType: details.ItemType,
        barcodes: details.Barcodes || '', unitpack: details.Unitpack || 0, department: details.Deptlink,
    };
    bomLocation.value = '';
    bomPriceLevel.value = '';
    isEditing.value = true;
    activeTab.value = 'Details';
    validationErrors.value = {};
    isModalOpen.value = true;
  }
};

const openDeleteModal = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const getNextItemCode = () => {
  const maxCode = mastersStore.items.reduce((max, item) => {
    const codeNum = parseInt(item.code, 10);
    return !isNaN(codeNum) && codeNum > max ? codeNum : max;
  }, 0);
  editableItem.value.itemCode = (maxCode + 1).toString().padStart(4, '0');
};

const validateItemForm = () => {
    const errors = {};
    if (!editableItem.value.itemCode) { errors.itemCode = 'Item Code is required.'; }
    if (!editableItem.value.description) { errors.description = 'Item Name/Description is required.'; }
    validationErrors.value = errors;
    return Object.keys(errors).length === 0;
};

const handleSaveItem = async () => {
    if (!validateItemForm()) return;
    try {
        if (isEditing.value) {
            await mastersStore.updateItem(editableItem.value, editableItem.value.barcodes);
        } else {
            await mastersStore.addItem(editableItem.value, editableItem.value.barcodes);
        }
        await mastersStore.saveItemPrices(editableItem.value.itemCode, mastersStore.currentItemPrices, authStore.user.Username);
        isModalOpen.value = false;
    } catch (error) { /* Handled in store */ }
};

const handleDeleteItem = async () => {
    if (!itemToDelete.value) return;
    await mastersStore.deleteItem(itemToDelete.value.code);
    isDeleteModalOpen.value = false;
    itemToDelete.value = null;
};

const addPrice = () => {
    if (selectedLocations.value.length === 0 || !selectedPriceLevel.value) {
        mastersStore.setOperationError("Please select at least one location and a price level.");
        return;
    }
    const priceLevel = mastersStore.priceLevels.find(pl => pl.PricelevelCode === selectedPriceLevel.value);
    selectedLocations.value.forEach(locCode => {
        const location = mastersStore.locations.find(l => l.locCode === locCode);
        mastersStore.currentItemPrices.push({
            locationCode: locCode, locationName: location?.locName || locCode,
            priceLevelCode: selectedPriceLevel.value, priceLevelName: priceLevel?.PriceLevel || selectedPriceLevel.value,
            selling: sellingPrice.value, mSelling: mSellingPrice.value
        });
    });
    selectedLocations.value = []; selectedPriceLevel.value = ''; sellingPrice.value = 0; mSellingPrice.value = 0;
};

const removePrice = (index) => {
    mastersStore.currentItemPrices.splice(index, 1);
};

const searchItems = () => {
    mastersStore.fetchItemsForTransactions(itemSearchText.value, bomLocation.value);
};

const selectBomItem = (item) => {
    selectedBomItem.value = item;
    isItemSelectorOpen.value = false;
};

const addBomComponent = () => {
    if (!selectedBomItem.value || bomQuantity.value <= 0 || !bomLocation.value || !bomPriceLevel.value) {
        mastersStore.setOperationError("Please select a location, price level, component item, and enter a valid quantity.");
        return;
    }
    const payload = {
        recipeItemCode: editableItem.value.itemCode,
        locationCode: bomLocation.value,
        itemcode: selectedBomItem.value.ItemCode,
        recDesc: selectedBomItem.value.ItemDescription,
        qty: bomQuantity.value,
        cost: selectedBomItem.value.cost,
        plevel: bomPriceLevel.value
    };
    mastersStore.saveBomComponent(payload);
    selectedBomItem.value = null;
    bomQuantity.value = 1;
};

const removeBomComponent = (bom) => {
    const payload = {
        recipeItemCode: editableItem.value.itemCode,
        locationCode: bom.locationCode,
        itemcode: bom.itemCode,
        plevel: bom.priceLevelCode,
        recDesc: bom.itemDescription,
        qty: bom.quantity,
        cost: 0
    };
    mastersStore.deleteBomComponent(payload);
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value);
};

const printItemDetailsPDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const item = editableItem.value;

    // Fetch all prices and BOMs
    const allPrices = await apiService.getItemPrices(item.itemCode, 'X').then(res => res.data);
    const allBOMs = await apiService.getItemBOM(item.itemCode, 'X', 'X').then(res => res.data);

    // --- PDF Header ---
    doc.setFontSize(18);
    doc.text('Item Details Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`${item.description} (${item.itemCode})`, 14, 30);

    // --- Item Details Section ---
    let y = 40;
    doc.setFontSize(10);
    doc.text(`Department: ${mastersStore.departments.find(d => d.DeptCode === item.department)?.Description || ''}`, 14, y);
    doc.text(`Supplier: ${mastersStore.suppliers.find(s => s.id === item.supplierCode)?.Descreption || ''}`, 105, y);
    y += 7;
    doc.text(`Sub-Dept: ${mastersStore.subDepartments.find(sd => sd.SubDeptCode === item.subDepartment)?.Description || ''}`, 14, y);
    doc.text(`Cost: ${formatCurrency(item.listPrice)}`, 105, y);
    
    // --- Pricing Table ---
    y += 15;
    doc.setFontSize(14);
    doc.text('Pricing Information', 14, y);
    y += 5;
    doc.autoTable({
        startY: y,
        head: [['Location', 'Price Level', 'Selling', 'M.Selling']],
        body: allPrices.map(p => [p.Locn_name, p.PriceLevel, formatCurrency(p.selling), formatCurrency(p['m.selling'])]),
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] },
    });

    // --- BOM Table ---
    y = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Bill of Materials (BOM)', 14, y);
    y += 5;
    doc.autoTable({
        startY: y,
        head: [['Location', 'Component', 'Qty', 'Unit', 'Total Cost']],
        body: allBOMs.map(b => [b.locationName, `${b.RecDesc} (${b.ItemCode})`, b.Qty, `${b.Unitpack} ${b.UOM}`, formatCurrency(b.TotValue)]),
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] },
    });

    doc.save(`item_report_${item.itemCode}.pdf`);
};

const filteredItems = computed(() => {
  return mastersStore.items.filter(item => {
    const codeMatch = item.code.toLowerCase().includes(filterCode.value.toLowerCase());
    const descMatch = item.description.toLowerCase().includes(filterDescription.value.toLowerCase());
    const deptMatch = !filterDepartment.value || item.department === filterDepartment.value;
    const subDeptMatch = !filterSubDepartment.value || item.subDepartment === filterSubDepartment.value;
    const supplierMatch = !filterSupplier.value || item.supplier === filterSupplier.value;
    return codeMatch && descMatch && deptMatch && subDeptMatch && supplierMatch;
  });
});

const filteredSubDepartments = computed(() => {
  if (!editableItem.value.department) {
    return mastersStore.subDepartments;
  }
  return mastersStore.subDepartments.filter(sd => sd.Deptlink === editableItem.value.department);
});

const filteredLocations = computed(() => {
    if (!locationSearchText.value) {
        return mastersStore.locations;
    }
    return mastersStore.locations.filter(loc => 
        loc.locName.toLowerCase().includes(locationSearchText.value.toLowerCase()) ||
        loc.master.toLowerCase().includes(locationSearchText.value.toLowerCase())
    );
});

const selectedLocationName = computed(() => {
    const loc = mastersStore.locations.find(l => l.locCode === bomLocation.value);
    return loc ? loc.locName : '...';
});

onMounted(() => {
  mastersStore.fetchItems();
  mastersStore.fetchDepartments();
  mastersStore.fetchSubDepartments();
  mastersStore.fetchSuppliers();
  mastersStore.fetchUnits();
  mastersStore.fetchPrintTypes();
  mastersStore.fetchPluTypes();
  mastersStore.fetchLocations();
});
</script>