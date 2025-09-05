import axios from 'axios';

const API_BASE_URL = window.config?.API_BASE_URL || 'http://localhost:5202/api';

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
  getLocations(locationCode, userName) {
    return apiClient.get('/Master/getLocations?userLocation=' + locationCode + '&userName=' + userName);
  },

  getPriceLevels(locationCode) {
    return apiClient.get(`/Item/getPlevels?location=${locationCode}`);
  },

  getItemPrices(itemCode, locationCodes) {
    return apiClient.get(`/Item/getPricing?item=${itemCode}&locationCodes=${locationCodes}`);
  },
  getApiUsers: () => apiClient.get('/Acc/GetUsers'), 

  // src/services/apiService.js

  savePrice(payload) {
    const params = new URLSearchParams({
      locationCodes: payload.locationCodes,
      ItemCode: payload.itemCode,
      GroupCode: payload.groupCode,
      PriceLevel: payload.priceLevel,
      SellingPricesExTax: payload.sellingExTax,
      SellingPricesinTax: payload.sellingInTax,
      CreateUser: payload.createUser
    });
    return apiClient.post(`/Item/SavePrice?${params.toString()}`);
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
  },
  //Reports
  getItemWiseSales(dateFrom, dateTo, locations) {
    // The type=8 seems constant for this report based on your example
    //print locations on colsole
    console.log("Locations for Item Wise Sales Report:", locations);
    return apiClient.get(`/Report/getQB?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}&type=8`);
  },

  getDailySales(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getQB?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}&type=0`);
  },

  getSalesSummaryWithPayment(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getSalesSummeryWithPayment?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}`);
  },

  //Transactions
  //PO
  getMin(type, role, dis, q3, q4) {
    return apiClient.get(`/Grn/getMin?type=${type}&role=${role}&dis=${dis}&q3=${q3}&q4=${q4}`);
  },
  getSupDetails(loc, sup) {
    console.log(API_BASE_URL + `/Grn/getSupDetails?loc=${loc}&sup=${sup}`);
    return apiClient.get(`/Grn/getSupDetails?loc=${loc}&sup=${sup}`);
  },
  updateSupAgentDetails(loc, sup, agentName, agentEmail, refCode) {
    console.log(API_BASE_URL + `/Grn/updateSupAgentDetails?loc=${loc}&sup=${sup}&agentName=${agentName}&agentEmail=${agentEmail}`);
    return apiClient.get(`/Grn/updateSupAgentDetails?loc=${loc}&sup=${sup}&agentName=${agentName}&agentEmail=${agentEmail}&refcode=${refCode}`);
  },
  reservePoNumber(username, discode, docType) {
    return apiClient.get(`/Grn/reserv?username=${username}&discode=${discode}&docType=${docType}`);
  },
  savePO(payload, username) {
    console.log(API_BASE_URL + `/Grn/save?username=${username}`);
    //log payload before making the request
    console.log("Payload for savePO:", payload);
    return apiClient.post(`/Grn/save?username=${username}`, payload);
  },
  getEtdx(docNo, disCode, docType) {
    //log url before making the request
    console.log(API_BASE_URL + `/Grn/getEtdx?docNo=${docNo}&disCode=${disCode}&docType=${docType}`);
    return apiClient.get(`/Grn/getEtdx?docNo=${docNo}&disCode=${disCode}&docType=${docType}`);
  },
  emailPurchaseOrder(formData) {
    return apiClient.post('/Grn/uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getSupplierBankDetails(supplierCode) {
    // This is a placeholder. Replace with your actual API endpoint.
    console.warn("API Endpoint for getSupplierBankDetails not implemented. Using hardcoded data.");
    return Promise.resolve({
      data: {
        beneficiaryName: "Distilleries Company Of Sri Lanka PLC",
        bankName: "Hatton National Bank - Head Office",
        accountNo: "0030 2023 3243",
        refCode: "78411"
      }
    });
  },
  getInvDetailReport(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getInvDetailReport?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}`);
  },
  // Add these functions to your apiService object
  getItemMasterOther(itemCode) {
    return apiClient.get(`/Item/getItemMasterOther?item=${itemCode}`);
  },
  updateItemOther(payload) {
    return apiClient.post('/Item/update-item-other', payload);
  },
  uploadItemImage(itemCode, file) {
    const formData = new FormData();
    formData.append('file', file);
    // This endpoint needs to be created on your backend
    return apiClient.post(`/Item/uploadImage?itemCode=${itemCode}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getEmployees: () => apiClient.get('/TA/getJsonAuto'),
  // Add these functions to your apiService object
  getEmployeeDetails(eId, loc) {
    return apiClient.get(`/TA/getEmp?eId=${eId}&loc=${loc}`);
  },
  getEmployeeCategories() {
    return apiClient.get('/TA/getCat?act=true');
  },
  getEmployeeDepartments() {
    return apiClient.get('/TA/getDep?act=true');
  },
  saveEmployee: (employeeData, type) => apiClient.post(`/TA/saveEmp?type=${type}`, employeeData),
  getAttendanceReport: (loc, fDate, tDate) => apiClient.get(`/TA/getAllRecords?loc=${loc}&fDate=${fDate}&tDate=${tDate}&customDate=1`),

  //GRN
  getGrnList: () => apiClient.get('/TGrn'),
  getGrnById: (tNo, loc) => apiClient.get(`/TGrn/${tNo}?loc=${loc}`),
  saveGrn: (grnData) => apiClient.post('/TGrn', grnData),
  deleteGrn: (tNo, loc) => apiClient.delete(`/TGrn/${tNo}?loc=${loc}`),

  //Stock Take
  initStock: (loc) => apiClient.get(`/Stock/initStock?loc=${loc}`),
  getStockTake: (loc, date) => apiClient.get(`/Stock/getTake?loc=${loc}&date=${date}`),
  saveStockTake: (itemcode, loc, count, date, type) => apiClient.get(`/Stock/saveTake?itemcode=${itemcode}&loc=${loc}&count=${count}&date=${date}&type=${type}`),
  searchItemsForStockTake: (discode, filter) => apiClient.get(`/Master/getItem?discode=${discode}&filter=${filter}&stock=main`),
  getItemByBarcodeForStockTake: (barcode, locCode) => apiClient.get(`/Stock/getItemByBarcode?barcode=${barcode}&locCode=${locCode}`),
  saveStockTake: (itemcode, loc, count, date, type) => apiClient.get(`/Stock/saveTake?itemcode=${itemcode}&loc=${loc}&count=${count}&date=${date}&type=${type}`),
  // Add this new function to your apiService object
  uploadQbStockJson(payload) {
    return apiClient.post('/Stock/uploadQbStockJson', payload);
  },
  getStockTakeReport: (loc, date, type) => apiClient.get(`/Stock/stockTakeReport?loc=${loc}&date=${date}&type=${type}`),
  getChannelWiseSales: (dateFrom, dateTo) => apiClient.get(`/Report/getChannelWiseSales?dateFrom=${dateFrom}&dateTo=${dateTo}`),
  getIncentiveReport: (dateFrom, dateTo, locations) => apiClient.get(`/Report/getIncentiveReport?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}`),
  getVoidCancelReport(dateFrom, dateTo, locations) {
    return apiClient.get(`/Report/getQB?dateFrom=${dateFrom}&dateTo=${dateTo}&locations=${locations}&type=13`);
},
};
