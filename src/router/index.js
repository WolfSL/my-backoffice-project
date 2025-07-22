import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/masters/suppliers',
      name: 'suppliers',
      component: () => import('../views/SuppliersView.vue')
    },
    {
      path: '/masters/departments',
      name: 'departments',
      component: () => import('../views/DepartmentsView.vue')
    },
    {
      path: '/masters/sub-departments',
      name: 'sub-departments',
      component: () => import('../views/SubDepartmentsView.vue')
    },
    // MODIFIED: Added new route for items
    {
      path: '/masters/items',
      name: 'items',
      component: () => import('../views/ItemsView.vue')
    }
  ]
})

export default router
