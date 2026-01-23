<template>
  <div class="layout-container">
    <header>
      <h1>Meine Webseite</h1>
      <nav>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">Über uns</NuxtLink></li>
          <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
        </ul>
      </nav>
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
