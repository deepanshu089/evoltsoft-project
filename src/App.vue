<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = ref(true)

onMounted(async () => {
  // Check for token in localStorage
  await authStore.checkAuth()
  loading.value = false
})

// Navigation guard
watch(
  () => route.path,
  async (newPath) => {
    const currentRoute = router.currentRoute.value
    
    if (currentRoute.meta.requiresAuth && !authStore.isAuthenticated) {
      router.push('/login')
    }
    
    if (authStore.isAuthenticated && (newPath === '/login' || newPath === '/register')) {
      router.push('/dashboard')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <Navbar v-if="!loading && authStore.isAuthenticated" />
    
    <main class="flex-grow container mx-auto px-4 sm:px-6 py-8">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
      <router-view v-else />
    </main>
    
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        EV Charging Station Management © {{ new Date().getFullYear() }}
      </div>
    </footer>
  </div>
</template>