<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <div class="hidden flex-1 flex-col justify-between bg-gradient-to-br from-blue-600 to-violet-600 p-10 text-white md:flex">
      <div>
        <RouterLink to="/" class="flex items-center gap-3 text-xl font-semibold">
          <img alt="KinLink" class="h-10 w-10" src="@/assets/logo.svg" />
          KinLink
        </RouterLink>
      </div>
      <div>
        <h1 class="mb-4 text-3xl font-bold leading-tight">Preserve your family heritage</h1>
        <p class="max-w-md text-white/80">
          Manage relationships, share stories, and visualize your ancestry in a private, secure hub.
        </p>
      </div>
      <p class="text-sm text-white/70">© {{ new Date().getFullYear() }} KinLink</p>
    </div>

    <div class="flex w-full flex-1 items-center justify-center bg-white px-6 py-16 dark:bg-slate-900">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
