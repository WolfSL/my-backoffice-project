import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard' }
  },
  {
    path: '/masters/suppliers',
    name: 'Suppliers',
    component: () => import('../views/SuppliersView.vue'),
    meta: { title: 'Suppliers' }
  },
  {
    path: '/masters/departments',
    name: 'Departments',
    component: () => import('../views/DepartmentsView.vue'),
    meta: { title: 'Departments' }
  },
  {
    path: '/masters/sub-departments',
    name: 'SubDepartments',
    component: () => import('../views/SubDepartmentsView.vue'),
    meta: { title: 'Sub-Departments' }
  },
  {
    path: '/masters/items',
    name: 'Items',
    component: () => import('../views/ItemsView.vue'),
    meta: { title: 'Items' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { title: 'Reports Hub' }
  },
  {
    path: '/reports/item-sales-summary',
    name: 'ItemSalesSummary',
    component: () => import('../reports/ItemSalesSummaryView.vue'),
    meta: { title: 'Item Wise Sales Summary' }
  },
  {
    path: '/reports/sales-summary-payment',
    name: 'SalesSummaryWithPayment',
    component: () => import('../reports/SalesSummaryWithPaymentView.vue'),
    meta: { title: 'Sales Summary with Payment' }
  },
  // MODIFIED: Added route for Purchase Orders
  {
    path: '/transactions/purchase-orders',
    name: 'PurchaseOrderList',
    component: () => import('../views/PurchaseOrderListView.vue'),
    meta: { title: 'Purchase Orders' }
  },
  {
    path: '/transactions/purchase-order/edit/:poNo/:disCode/:docType',
    name: 'PurchaseOrderEdit',
    component: () => import('../views/PurchaseOrderView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Transactions / Edit Purchase Order' }
  },
  {
    path: '/transactions/purchase-order/new',
    name: 'PurchaseOrderNew',
    component: () => import('../views/PurchaseOrderView.vue'),
    props: true, 
    meta: { requiresAuth: true, title: 'Transactions / New Purchase Order' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.name !== 'Login' && !authStore.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
