<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="/img/logo.jpg" alt="Viaje Confort Logo" class="img-fluid rounded me-2" style="max-height: 50px;" />
          Viaje Confort
        </a>
        <div class="d-flex">
          <button
            id="toggle-categories"
            class="btn btn-secondary me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasCategorias"
            aria-controls="offcanvasCategorias"
          >
            Categorías
          </button>
  
          <button
            id="toggle-cart"
            class="btn btn-warning me-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasCesta"
            aria-controls="offcanvasCesta"
          >
            🛒 Cesta
          </button>
  
          <!-- Solo se muestra si no está en modo admin -->
          <button v-if="!modoAdmin" id="admin-btn" class="btn btn-danger" @click="emit('adminClick')">
            ⚙️ Admin
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  // Props recibidas del componente padre
  const props = defineProps({
    modoAdmin: Boolean,
  });
  
  // Emitir evento al padre cuando el botón de admin es presionado
  const emit = defineEmits(['adminClick']);
  </script>
  
  <style scoped>

  </style>