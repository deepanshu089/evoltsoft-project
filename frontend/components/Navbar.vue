<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/dashboard" class="flex items-center">
              <div class="text-primary-600 dark:text-primary-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">EV Charge</span>
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/dashboard" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.path === '/dashboard' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/stations" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.path.startsWith('/stations') && $route.path !== '/stations/map' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              Stations
            </router-link>
            <router-link 
              to="/stations/map" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="$route.path === '/stations/map' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'"
            >
              Map View
            </router-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div class="ml-3 relative">
            <div class="flex items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200 mr-2">{{ authStore.user?.name }}</span>
              <button 
                @click="logout"
                class="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div class="flex items-center sm:hidden">
          <button 
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg 
              :class="{'hidden': mobileMenuOpen, 'block': !mobileMenuOpen}" 
              class="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              :class="{'block': mobileMenuOpen, 'hidden': !mobileMenuOpen}" 
              class="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div :class="{'block': mobileMenuOpen, 'hidden': !mobileMenuOpen}" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          to="/dashboard" 
          @click="closeMobileMenu"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path === '/dashboard' ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/stations" 
          @click="closeMobileMenu"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path.startsWith('/stations') && $route.path !== '/stations/map' ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
        >
          Stations
        </router-link>
        <router-link 
          to="/stations/map" 
          @click="closeMobileMenu"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="$route.path === '/stations/map' ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-gray-700' : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
        >
          Map View
        </router-link>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center text-primary-600 dark:text-primary-400">
              {{ authStore.user?.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800 dark:text-white">{{ authStore.user?.name }}</div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>