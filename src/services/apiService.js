import axios from 'axios';

const API_BASE_URL = 'http://localhost:5202/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json'
  }
});

export default {

  login(username, password) {
    const url = `/Acc/GetUserAsync?username=${username}&password=${encodeURIComponent(password)}`;
    
    return apiClient.post(url, {});
  },
  
  //Dashboard related API calls
  getCompany() {
    return apiClient.get('/Acc/GetCompany');
  },
  getLiveSalesAll(dateFrom, dateTo) {
    return apiClient.get(`/Report/getLiveSalesAll?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  },
  getXreport(dateFrom, dateTo, locCode) {
    return apiClient.get(`/Report/getXreport?dateFrom=${dateFrom}&dateTo=${dateTo}&locCode=${locCode}`);
  },
  getCusCount(dateFrom, dateTo, locCode) {
    return apiClient.get(`/Report/getCusCount?dateFrom=${dateFrom}&dateTo=${dateTo}&locCode=${locCode}`);
  },
  getSuppSalesAll(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getSuppSalesAll?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}`);
  },
  getCashFlow(df, dt, locations) {
    return apiClient.get(`/Report/getCashFlow?df=${df}&dt=${dt}&locations=${locations}`);
  },
  getHourlySales(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getHourlySales?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}`);
  },
  getVoidCancel(dateFrom, dateTo, locCode) {
    return apiClient.get(`/Report/getVoidCancel?dateFrom=${dateFrom}&dateTo=${dateTo}&locCode=${locCode}`);
  },

  //Master data related API calls can be added here
  getSuppliers() {
    return apiClient.get('/Master/getSupplier');
  },
  addSupplier(supplierData) {
    return apiClient.post('/Master/addSupplier', supplierData);
  },
  updateSupplier(supplierData) {
    return apiClient.post('/Master/updateSupplier', supplierData);
  },
  deleteSupplier(supplierCode) {
    return apiClient.post('/Master/deleteSupplier', { SupplierCode: supplierCode });
  },
  getDepartments() {
    return apiClient.get('/Item/getDep');
  },

  addDepartment(departmentData) {
    return apiClient.post('/Item/addDepartment', departmentData);
  },

  updateDepartment(departmentData) {
    return apiClient.post('/Item/updateDepartment', departmentData);
  },

  deleteDepartment(departmentCode) {
    return apiClient.post('/Item/deleteDepartment', { DeptCode: departmentCode });
  },

  getSubDepartments(act = false, deptCode = 'x') {
    return apiClient.get(`/Item/getSubDep?act=${act}&deptCode=${deptCode}`);
  },

  addSubDepartment(subDepartmentData) {
    return apiClient.post('/Item/addSubDepartment', subDepartmentData);
  },

  updateSubDepartment(subDepartmentData) {
    return apiClient.post('/Item/updateSubDepartment', subDepartmentData);
  },

  deleteSubDepartment(subDepartmentCode) {
    return apiClient.post('/Item/deleteSubDepartment', { SubDeptCode: subDepartmentCode });
  },
  getItems() {
    return apiClient.get('/Item/getItemMaster');
  },
  getUnits() {
    return apiClient.get('/Item/getUnits?act=true');
  },

  getPrintTypes() {
    return apiClient.get('/Item/getPrintTypes?act=true');
  },

  getPluTypes() {
    return apiClient.get('/Item/getPluTypes');
  },

  saveItem(itemData, type, barcodes) {
    return apiClient.post(`/Item/SaveItemMaster?type=${type}&barcodes=${barcodes}`, itemData);
  },
  getItemDetails(itemCode) {
    return apiClient.get(`/Item/getItemMasterDetails?item=${itemCode}`);
  },
  deleteItem(itemCode) {
    return apiClient.post('/Item/deleteItem', { itemCode: itemCode });
  },
  getLocations() {
    return apiClient.get('/Master/getLocations');
  },

  getPriceLevels(locationCode) {
    return apiClient.get(`/Item/getPlevels?location=${locationCode}`);
  },

  getItemPrices(itemCode, locationCodes ) {
    return apiClient.get(`/Item/getPricing?item=${itemCode}&locationCodes=${locationCodes}`);
  },

  savePrice(priceData) {
    const { locationCodes, ItemCode, GroupCode, PriceLevel, SellingPricesExTax, SellingPricesinTax, CreateUser } = priceData;
    const url = `/Item/SavePrice?locationCodes=${locationCodes}&ItemCode=${ItemCode}&GroupCode=${GroupCode}&PriceLevel=${PriceLevel}&SellingPricesExTax=${SellingPricesExTax}&SellingPricesinTax=${SellingPricesinTax}&CreateUser=${CreateUser}`;
    return apiClient.post(url, {});
  },

  // MODIFIED: Added new functions for BOM
  getItemsForTransactions(search, location) {
    return apiClient.get(`/Item/getItemsForTransactions?search=${search}&location=${location}`);
  },

  getItemBOM(itemCode, locationCode, plevel) {
    return apiClient.get(`/Item/getBom?item=${itemCode}&locationCode=${locationCode}&plevel=${plevel}`);
  },

  manageBom(payload) {
    const { type, recipeItemCode, locationCode, itemcode, recDesc, qty, cost, plevel } = payload;
    return apiClient.get(`/Item/saveBom?type=${type}&recipeItemCode=${recipeItemCode}&locationCode=${locationCode}&itemcode=${itemcode}&recDesc=${recDesc}&qty=${qty}&cost=${cost}&plevel=${plevel}`);
  }

};
