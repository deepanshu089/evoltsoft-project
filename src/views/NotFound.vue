<template>
  <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="mx-auto h-24 w-24 text-primary-600 dark:text-primary-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">404</h1>
      <p class="mt-2 text-base font-medium text-gray-600 dark:text-gray-300">Page not found.</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
      <div class="mt-6">
        <router-link
          to="/dashboard"
          class="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Go to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>