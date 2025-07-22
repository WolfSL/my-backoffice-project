import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiService from '@/services/apiService';

export const useMastersStore = defineStore('masters', () => {
    // === STATE ===
    const suppliers = ref([]);
    const departments = ref([]);
    const subDepartments = ref([]);
    const items = ref([]); // MODIFIED: New state for items
    const units = ref([]);
    const printTypes = ref([]);
    const pluTypes = ref([]);
    const locations = ref([]);
    const priceLevels = ref([]);
    const currentItemPrices = ref([]);
    const transactionItems = ref([]); // MODIFIED: New state for BOM item search
    const currentItemBOM = ref([]); // MODIFIED: New state for current item's BOM

    const isLoading = ref(false);
    const isAdding = ref(false);
    const isUpdating = ref(false);
    const error = ref(null);
    const successMessage = ref('');
    const operationError = ref('');

    // === ACTIONS ===

    function setSuccessMessage(message) {
        successMessage.value = message;
        setTimeout(() => { successMessage.value = ''; }, 3000);
    }

    function setOperationError(message) {
        operationError.value = message;
        setTimeout(() => { operationError.value = ''; }, 5000);
    }

    // --- Supplier Actions ---
    async function fetchSuppliers() {
        isLoading.value = true; error.value = null;
        try { const response = await apiService.getSuppliers(); suppliers.value = response.data; }
        catch (err) { error.value = 'Failed to fetch suppliers.'; console.error(err); }
        finally { isLoading.value = false; }
    }
    async function addSupplier(supplierData) {
        isAdding.value = true; operationError.value = null;
        try {
            const response = await apiService.addSupplier(supplierData);
            if (response.data.success) { await fetchSuppliers(); setSuccessMessage('Supplier added successfully.'); }
            else { throw new Error('API returned failure on adding supplier.'); }
        } catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while adding the supplier.'); throw err; }
        finally { isAdding.value = false; }
    }
    async function updateSupplier(supplierData) {
        isUpdating.value = true; operationError.value = null;
        try {
            const response = await apiService.updateSupplier(supplierData);
            if (response.status === 200) { await fetchSuppliers(); setSuccessMessage('Supplier updated successfully.'); }
            else { throw new Error('API returned failure on updating supplier.'); }
        } catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while updating the supplier.'); throw err; }
        finally { isUpdating.value = false; }
    }
    async function deleteSupplier(supplierCode) {
        operationError.value = null;
        try {
            const response = await apiService.deleteSupplier(supplierCode);
            if (response.data && response.data.success === false) { throw new Error(response.data.message); }
            await fetchSuppliers();
            setSuccessMessage(response.data.message || 'Supplier deleted successfully.');
        } catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while deleting the supplier.'); }
    }

    // --- Department Actions ---
    async function fetchDepartments() {
        isLoading.value = true; error.value = null;
        try { const response = await apiService.getDepartments(); departments.value = response.data; }
        catch (err) { error.value = 'Failed to fetch departments.'; console.error(err); }
        finally { isLoading.value = false; }
    }
    async function addDepartment(departmentData) {
        isAdding.value = true; operationError.value = null;
        try { await apiService.addDepartment(departmentData); await fetchDepartments(); setSuccessMessage('Department added successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while adding the department.'); throw err; }
        finally { isAdding.value = false; }
    }
    async function updateDepartment(departmentData) {
        isUpdating.value = true; operationError.value = null;
        try { await apiService.updateDepartment(departmentData); await fetchDepartments(); setSuccessMessage('Department updated successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while updating the department.'); throw err; }
        finally { isUpdating.value = false; }
    }
    async function deleteDepartment(departmentCode) {
        operationError.value = null;
        try { const response = await apiService.deleteDepartment(departmentCode); await fetchDepartments(); setSuccessMessage(response.data.message || 'Department deleted successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while deleting the department.'); }
    }

    // --- Sub-Department Actions ---
    async function fetchSubDepartments() {
        isLoading.value = true; error.value = null;
        try { const response = await apiService.getSubDepartments(); subDepartments.value = response.data; }
        catch (err) { error.value = 'Failed to fetch sub-departments.'; console.error(err); }
        finally { isLoading.value = false; }
    }
    async function addSubDepartment(subDepartmentData) {
        isAdding.value = true; operationError.value = null;
        try { await apiService.addSubDepartment(subDepartmentData); await fetchSubDepartments(); setSuccessMessage('Sub-Department added successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while adding the sub-department.'); throw err; }
        finally { isAdding.value = false; }
    }
    async function updateSubDepartment(subDepartmentData) {
        isUpdating.value = true; operationError.value = null;
        try { await apiService.updateSubDepartment(subDepartmentData); await fetchSubDepartments(); setSuccessMessage('Sub-Department updated successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while updating the sub-department.'); throw err; }
        finally { isUpdating.value = false; }
    }
    async function deleteSubDepartment(subDepartmentCode) {
        operationError.value = null;
        try { const response = await apiService.deleteSubDepartment(subDepartmentCode); await fetchSubDepartments(); setSuccessMessage(response.data.message || 'Sub-Department deleted successfully.'); }
        catch (err) { const message = err.response?.data || err.message; setOperationError(message || 'An error occurred while deleting the sub-department.'); }
    }
    async function fetchLocations() {
        if (locations.value.length > 0) return;
        try { const response = await apiService.getLocations(); locations.value = response.data; }
        catch (err) { console.error('Failed to fetch locations:', err); }
    }
    async function fetchPriceLevels(locationCode) {
        try {
            const response = await apiService.getPriceLevels(locationCode);
            priceLevels.value = response.data;
        } catch (err) {
            console.error('Failed to fetch price levels:', err);
            priceLevels.value = [];
        }
    }
    async function fetchItemPrices(itemCode, locationCodes = 'X') {
        try {
            const response = await apiService.getItemPrices(itemCode, locationCodes);
            currentItemPrices.value = response.data.map(price => ({
                locationName: price.Locn_name,
                priceLevelName: price.PriceLevel,
                selling: price.selling,
                mSelling: price['m.selling'],
                locationCode: locations.value.find(l => l.locName === price.Locn_name)?.locCode || '',
                priceLevelCode: priceLevels.value.find(pl => pl.PriceLevel === price.PriceLevel)?.PricelevelCode || '',
                GroupCode: price.GroupCode,
            }));
        } catch (err) {
            console.error('Failed to fetch item prices:', err);
            currentItemPrices.value = [];
        }
    }

    async function saveItemPrices(itemCode, prices, user) {
        for (const price of prices) {
            try {
                const payload = {
                    locationCodes: price.locationCode,
                    ItemCode: itemCode,
                    GroupCode: price.GroupCode || '001',
                    PriceLevel: price.priceLevelCode,
                    SellingPricesExTax: price.selling,
                    SellingPricesinTax: price.mSelling,
                    CreateUser: user
                };
                await apiService.savePrice(payload);
            } catch (err) {
                console.error(`Failed to save price for location ${price.locationCode}`, err);
                setOperationError(`Failed to save price for ${price.locationName}.`);
            }
        }
    }

    // MODIFIED: New Item Actions
    async function fetchItems() {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await apiService.getItems();
            // Normalize the keys from the API response
            items.value = response.data.map(item => ({
                code: item['itemcode#150'],
                description: item['item desc#220'],
                pluType: item['PluType#150'],
                department: item['Dep#150'],
                subDepartment: item['Sub Dep#170'],
                supplier: item['Supplier#200'],
                uom: item['UOM#NF'],
                volume: item['Vol#NF'],
                cs: item['CS#NF'],
                sc: item['S/C'],
            }));
        } catch (err) {
            error.value = 'Failed to fetch items.';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }
    async function addItem(itemData, barcodes) {
        isAdding.value = true;
        operationError.value = null;
        try {
            await apiService.saveItem(itemData, 0, barcodes);
            await fetchItems();
            setSuccessMessage('Item added successfully.');
        } catch (err) {
            const message = err.response?.data || err.message;
            setOperationError(message || 'An error occurred while adding the item.');
            throw err;
        } finally {
            isAdding.value = false;
        }
    }

    // MODIFIED: New Item-related fetch actions
    async function fetchUnits() {
        if (units.value.length > 0) return;
        try { const response = await apiService.getUnits(); units.value = response.data; }
        catch (err) { console.error('Failed to fetch units:', err); }
    }

    async function fetchPrintTypes() {
        if (printTypes.value.length > 0) return;
        try { const response = await apiService.getPrintTypes(); printTypes.value = response.data; }
        catch (err) { console.error('Failed to fetch print types:', err); }
    }

    async function fetchPluTypes() {
        if (pluTypes.value.length > 0) return;
        try { const response = await apiService.getPluTypes(); pluTypes.value = response.data; }
        catch (err) { console.error('Failed to fetch PLU types:', err); }
    }

    async function fetchItemDetails(itemCode) {
        try {
            const response = await apiService.getItemDetails(itemCode);
            return response.data[0]; // Return the detailed item data
        } catch (err) {
            setOperationError('Failed to fetch item details.');
            console.error(err);
        }
    }

    async function updateItem(itemData, barcodes) {
        isUpdating.value = true;
        operationError.value = null;
        try {
            await apiService.saveItem(itemData, 1, barcodes);
            await fetchItems();
            setSuccessMessage('Item updated successfully.');
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setOperationError(message || 'An error occurred while updating the item.');
            throw err;
        } finally {
            isUpdating.value = false;
        }
    }

    async function deleteItem(itemCode) {
        operationError.value = null;
        try {
            const response = await apiService.deleteItem(itemCode);
            await fetchItems();
            setSuccessMessage(response.data.message || 'Item deleted successfully.');
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            setOperationError(message || 'An error occurred while deleting the item.');
        }
    }

    //BOM Actions
    async function fetchItemsForTransactions(search, location) {
    if (!search || search.length < 2) {
      transactionItems.value = [];
      return;
    }
    try {
      const response = await apiService.getItemsForTransactions(search, location);
      transactionItems.value = response.data;
    } catch (err) {
      console.error('Failed to fetch transaction items:', err);
      transactionItems.value = [];
    }
  }

  // MODIFIED: Updated to handle new response and normalize data
  async function fetchItemBOM(itemCode, locationCode, plevel) {
    try {
      const response = await apiService.getItemBOM(itemCode, locationCode, plevel);
      currentItemBOM.value = response.data.map(bom => ({
        itemCode: bom.ItemCode,
        itemDescription: bom.RecDesc,
        quantity: bom.Qty,
        totalCost: bom.TotValue,
        unitpack: bom.Unitpack,
        uom: bom.UOM,
        locationCode: bom.locationCode,
        priceLevelCode: bom.PLevel
      }));
    } catch (err) {
      console.error('Failed to fetch item BOM:', err);
      currentItemBOM.value = [];
    }
  }

  async function saveBomComponent(payload) {
    try {
      const response = await apiService.manageBom({ ...payload, type: 'S' });
      setSuccessMessage(response.data.message || 'BOM component saved.');
      await fetchItemBOM(payload.recipeItemCode, payload.locationCode, payload.plevel);
    } catch (err) {
      setOperationError('Failed to save BOM component.');
      console.error(err);
    }
  }

  async function deleteBomComponent(payload) {
    try {
      const response = await apiService.manageBom({ ...payload, type: 'D' });
      setSuccessMessage(response.data.message || 'BOM component deleted.');
      await fetchItemBOM(payload.recipeItemCode, payload.locationCode, payload.plevel);
    } catch (err) {
      setOperationError('Failed to delete BOM component.');
      console.error(err);
    }
  }

  // MODIFIED: New getter for total BOM cost
  const totalBomCost = computed(() => {
    return currentItemBOM.value.reduce((total, item) => total + item.totalCost, 0);
  });
    return {
        suppliers, departments, subDepartments, items, units, printTypes, pluTypes, locations, priceLevels, currentItemPrices,
        transactionItems, currentItemBOM,
        isLoading, isAdding, isUpdating, error, successMessage, operationError,
        totalBomCost,
        fetchSuppliers, addSupplier, updateSupplier, deleteSupplier,
        fetchDepartments, addDepartment, updateDepartment, deleteDepartment,
        fetchSubDepartments, addSubDepartment, updateSubDepartment, deleteSubDepartment,
        fetchItems, addItem, fetchUnits, fetchPrintTypes, fetchPluTypes, fetchItemDetails, 
        updateItem, deleteItem, fetchLocations, fetchPriceLevels, fetchItemPrices, saveItemPrices,
        fetchItemsForTransactions, fetchItemBOM, saveBomComponent, deleteBomComponent
    };
});
