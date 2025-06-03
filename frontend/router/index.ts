import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import StationList from '../views/StationList.vue'
import StationMap from '../views/StationMap.vue'
import StationForm from '../views/StationForm.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations',
    name: 'StationList',
    component: StationList,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/map',
    name: 'StationMap',
    component: StationMap,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/new',
    name: 'NewStation',
    component: StationForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/stations/edit/:id',
    name: 'EditStation',
    component: StationForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

export default routes