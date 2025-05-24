<template>
  <div>
    <p v-if="categorias.length === 0">No hay productos disponibles.</p>

    <template v-else-if="categorias.length === 1">
      <ProductosCard
        v-for="producto in categorias[0].products"
        :key="producto.id"
        :producto="producto"
        @addToCart="emit('addToCart', producto.id)"
      />
      <p v-if="categorias[0].products.length === 0">No hay productos en esta categoría.</p>
    </template>

    <div v-else>
      <div v-for="categoria in categorias" :key="categoria.id">
        <h2>{{ categoria.name }}</h2>
        <template v-if="categoria.products.length > 0">
          <ProductosCard
            v-for="producto in categoria.products"
            :key="producto.id"
            :producto="producto"
            @addToCart="emit('addToCart', producto.id)"
          />
        </template>
        <p v-else>No hay productos en esta categoría.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductosCard from './ProductosCard.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  categorias: Array,
});
const emit = defineEmits(['addToCart']);
</script>

<style scoped>
/* Aquí puedes agregar estilos personalizados */
</style>