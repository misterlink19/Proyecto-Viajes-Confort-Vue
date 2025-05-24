<template>
  <div id="panel-admin" class="container mt-3">
    <h2>Panel de Administración</h2>
    <div class="mb-2">
      <button type="button" class="btn btn-primary me-2" @click="emit('openProductModal')">Productos</button>
      <button type="button" class="btn btn-primary me-2" @click="emit('openCategoryModal')">Categorías</button>
      <button type="button" class="btn btn-secondary" @click="emit('close')">Cerrar Sesión</button>
    </div>
  </div>
</template>


<script setup>
import { defineEmits } from 'vue';

// Definir eventos que el componente emitirá al padre
const emit = defineEmits(['close', 'openProductModal', 'openCategoryModal']);
</script>

<style scoped>
#panel-admin h2 {
  margin-bottom: 15px;
}
</style>