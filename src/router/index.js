import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, title: 'Dashboard', permission: 'DASHBOARD#VIEW' } // No specific permission needed for dashboard
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/masters/suppliers',
      name: 'suppliers',
      component: () => import('../views/SuppliersView.vue'),
      meta: { requiresAuth: true, title: 'Manage Suppliers', permission: 'MASTERS#VIEW' }
    },
    {
      path: '/masters/departments',
      name: 'departments',
      component: () => import('../views/DepartmentsView.vue'),
      meta: { requiresAuth: true, title: 'Manage Departments', permission: 'MASTERS#VIEW' }
    },
    {
      path: '/masters/sub-departments',
      name: 'sub-departments',
      component: () => import('../views/SubDepartmentsView.vue'),
      meta: { requiresAuth: true, title: 'Manage Sub-Departments', permission: 'MASTERS#VIEW' }
    },
    {
      path: '/masters/items',
      name: 'items',
      component: () => import('../views/ItemsView.vue'),
      meta: { requiresAuth: true, title: 'Manage Items', permission: 'MASTERS#VIEW' }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { requiresAuth: true, title: 'Reports Hub', permission: 'REPORTS#VIEW' }
    },
    {
      path: '/reports/item-sales-summary',
      name: 'item-sales-summary',
      component: () => import('../reports/ItemSalesSummaryView.vue'),
      meta: { requiresAuth: true, title: 'Item Sales Summary', permission: 'REPORTS#VIEW' }
    },
    {
      path: '/reports/item-sales-summary',
      name: 'item-sales-summary',
      component: () => import('../reports/ItemSalesSummaryView.vue'),
      meta: { requiresAuth: true, title: 'Item Sales Summary', permission: 'REPORTS#VIEW' }
    },
    {
      path: '/reports/sales-summary-payment',
      name: 'sales-summary-payment',
      component: () => import('../reports/SalesSummaryWithPaymentView.vue'),
      meta: { requiresAuth: true, title: 'Sales Summary w/ Payment', permission: 'REPORTS#VIEW' }
    },
     {
      path: '/reports/invoice-detail',
      name: 'invoice-detail',
      component: () => import('../reports/InvoiceDetailView.vue'),
      meta: { requiresAuth: true, title: 'Invoice Detail Report', permission: 'REPORTS#VIEW' }
    },
    {
      path: '/reports/daily-sales',
      name: 'daily-sales-report',
      component: () => import('../reports/DailySalesView.vue'),
      meta: { requiresAuth: true, title: 'Daily Sales Report', permission: 'REPORTS#VIEW' }
    },
    {
      path: '/transactions/purchase-orders',
      name: 'PurchaseOrderList',
      component: () => import('../views/PurchaseOrderListView.vue'),
      meta: { requiresAuth: true, title: 'Purchase Orders', permission: 'PO#VIEW' }
    },
    {
      path: '/transactions/purchase-order/new',
      name: 'PurchaseOrderNew',
      component: () => import('../views/PurchaseOrderView.vue'),
      meta: { requiresAuth: true, title: 'New Purchase Order', permission: 'PO#NEW' }
    },
    {
      path: '/transactions/purchase-order/edit/:poNo/:disCode/:docType',
      name: 'PurchaseOrderEdit',
      component: () => import('../views/PurchaseOrderView.vue'),
      props: true,
      meta: { requiresAuth: true, title: 'Edit Purchase Order', permission: 'PO#EDIT' }
    },
    {
      path: '/hris/employee-profile',
      name: 'employee-profile',
      component: () => import('../views/EmployeeProfileView.vue'),
      meta: { requiresAuth: true, title: 'HRIS / Employee Profile', permission: 'HRIS#VIEW' }
    },
    {
      path: '/reports/attendance',
      name: 'attendance-report',
      component: () => import('../reports/AttendanceReportView.vue'),
      meta: { requiresAuth: true, title: 'Reports / Attendance Report', permission: 'HRIS#REPORTS' }
    },
    {
      path: '/transactions/stock-taking',
      name: 'StockTaking',
      component: () => import('../views/StockTakingView.vue'),
      meta: { requiresAuth: true, title: 'Transactions / Stock Taking', permission: 'ST#VIEW' }
    },
    {
      path: '/transactions/petty-cash',
      name: 'PettyCash',
      component: () => import('../views/PettyCashView.vue'),
      meta: { requiresAuth: true, title: 'Transactions / Petty Cash', permission: 'PC#VIEW' }
    },
    {
      path: '/transactions/user-management',
      name: 'UserManagement',
      component: () => import('../views/UserManagementView.vue'),
      meta: { requiresAuth: true, title: 'Transactions / User Management', permission: 'ADMIN#USERS' }
    },
    {
      path: '/reports/petty-cash',
      name: 'petty-cash-report',
      component: () => import('../reports/PettyCashReportView.vue'),
      meta: { requiresAuth: true, title: 'Reports / Petty Cash Report',permission: 'PC#REPORTS' }
    },
    // MODIFIED: Added Unauthorized page
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('../views/UnauthorizedView.vue'),
      meta: { requiresAuth: true, title: 'Unauthorized' }
    },
    {
      path: '/reports/incentive',
      name: 'incentive-report',
      component: () => import('../reports/IncentiveReportView.vue'),
      meta: { requiresAuth: true, title: 'Reports / Incentive Report' }
    },
    {
    path: '/reports/cancellation-void',
    name: 'cancellation-void-report',
    component: () => import('../reports/CancellationVoidReportView.vue'),
    meta: { title: 'Cancellation & Void Report', requiresAuth: true, permission: 'REPORTS#VIEW' },
},
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const requiredPermission = to.meta.permission;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' });
  } else if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    // MODIFIED: Redirect to unauthorized page if permission is missing
    next({ name: 'Unauthorized' });
  } else if (to.name === 'login' && isLoggedIn) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router
