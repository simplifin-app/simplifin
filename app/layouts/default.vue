<template>
  <div class="layout-container">
    <header>
      <div class="logo-container">
        <div class="logo-placeholder"></div>
        <span class="site-title">Meine Webseite</span>
      </div>
      
      <nav>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">Über uns</NuxtLink></li>
          <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
        </ul>
      </nav>

      <div class="header-right"></div>
    </header>

    <main class="content">
      <slot />
    </main>

    <footer>
      <p>&copy; 2026 Meine Webseite</p>
    </footer>
  </div>
</template>

<style scoped>
/* Scoped styles specific to layout if needed, otherwise using global css */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
