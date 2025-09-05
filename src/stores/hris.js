import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiService from '@/services/apiService';
import { useAuthStore } from './auth';

export const useHrisStore = defineStore('hris', {
  state: () => ({
    employees: [],
    categories: [],
    departments: [],
    activeEmployee: null,
    // MODIFIED: Added state for attendance report
    attendanceRecords: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
    operationError: null,
  }),
  actions: {
    setSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => { this.successMessage = null; }, 3000);
    },
    setOperationError(message) {
      this.operationError = message;
      setTimeout(() => { this.operationError = null; }, 3000);
    },
    async fetchEmployees() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await apiService.getEmployees();
        this.employees = response.data;
      } catch (err) {
        this.error = 'Failed to fetch employees.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchEmployeeDetails(eId, loc) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await apiService.getEmployeeDetails(eId, loc);
            this.activeEmployee = response.data;
            if (this.activeEmployee && this.activeEmployee.dob) {
                const parts = this.activeEmployee.dob.split(' ')[0].split('/');
                if (parts.length === 3) {
                    this.activeEmployee.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }
        } catch (err) {
            this.error = 'Failed to fetch employee details.';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    },
    async fetchCategories() {
        try {
            const response = await apiService.getEmployeeCategories();
            this.categories = response.data;
        } catch (err) {
            console.error('Failed to fetch employee categories:', err);
        }
    },
    async fetchDepartments() {
        try {
            const response = await apiService.getEmployeeDepartments();
            this.departments = response.data;
        } catch (err) {
            console.error('Failed to fetch employee departments:', err);
        }
    },
    createBlankEmployee() {
        const authStore = useAuthStore();
        this.activeEmployee = {
            loc: authStore.user?.LocationCode || '',
            eId: "",
            mId: "",
            empName: "",
            catCode: "",
            epfCode: "",
            basicSal: 0,
            bA: 0,
            bAA: 0,
            attendance: 0,
            living: 0,
            meal: 0,
            production: 0,
            travel: 0,
            otRate: 0,
            status: "A",
            department: "",
            fullName: "",
            displyName: "",
            refBy: "",
            designation: "",
            remark: "",
            contacts: "",
            email: "",
            dob: new Date().toISOString().split('T')[0],
            address: "",
            bankAcc: "",
            branch: "",
            bank: "",
        };
    },
    async saveEmployee(isEditing) {
        if (!this.activeEmployee) return false;
        this.isSubmitting = true;
        this.error = null;
        const authStore = useAuthStore();
        
        const payload = { ...this.activeEmployee };
        payload.createUser = authStore.user?.Username || 'admin';
        payload.createDate = new Date().toISOString();

        const type = isEditing ? 'u' : 's';

        try {
            await apiService.saveEmployee(payload, type);
            this.setSuccessMessage(`Employee ${isEditing ? 'updated' : 'saved'} successfully.`);
            await this.fetchEmployees();
            return true;
        } catch (err) {
            this.setOperationError('Failed to save employee.');
            console.error(err);
            return false;
        } finally {
            this.isSubmitting = false;
        }
    },
    // MODIFIED: Added action to fetch attendance records
    async fetchAttendanceReport(loc, fDate, tDate) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await apiService.getAttendanceReport(loc, fDate, tDate);
            this.attendanceRecords = response.data;
        } catch (err) {
            this.error = 'Failed to fetch attendance report.';
            console.error(err);
        } finally {
            this.isLoading = false;
        }
    },
    clearActiveEmployee() {
        this.activeEmployee = null;
    }
  },
});
