<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const isSubmitting = ref(false)

const handleRegister = async () => {
  // Validate form
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMsg.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters'
    return
  }
  
  errorMsg.value = ''
  isSubmitting.value = true
  
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            sign in to your existing account
          </router-link>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div v-if="errorMsg" class="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMsg }}</p>
                </div>
              </div>
            </div>
            
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <div class="mt-1">
                <input
                  id="name"
                  v-model="name"
                  name="name"
                  type="text"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div class="mt-1">
                <input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div class="mt-1">
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  name="confirm-password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>