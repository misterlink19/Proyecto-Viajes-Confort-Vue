<template>
  <div class="product-card mb-3 p-3 border rounded d-flex gap-3 align-items-center">
    <img :src="imgSrc" :alt="producto.name" class="product-img" :class="{ hover: hover, agotado: producto.stock === 0 }"
      @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @click="mostrarModal = true"
      style="cursor: pointer;" />

    <div class="product-info">
      <p class="mb-1 text-muted" v-bind:style="{fontSize: '0.8rem' }">{{ producto.id }}</p>
      <p class="mb-1"><strong>{{ producto.name }}</strong></p>
      <p class="mb-1"><strong>Precio: </strong>{{ producto.price }}€</p>
      <p class="mb-1"><strong>Stock: </strong>{{ producto.stock }}</p>
      <p class="mb-2" v-bind:style="{ fontSize: '0.9rem', color: '#555'  }">{{ producto.desc }}</p>
      <button class="btn btn-primary btn-sm" @click="emit('addToCart', producto.id)" :disabled="producto.stock === 0">
        {{ producto.stock > 0 ? "Agregar a la cesta" : "Agotado" }}
      </button>
    </div>

    <!-- Modal de imagen ampliada -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.8);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <img :src="imgSrc" alt="Zoom" style="max-width: 100%;" />
            <p class="mt-3 text-muted">
              {{ producto.desc }}
            </p>
            <div class="mt-3">
              <button class="btn btn-secondary me-2" @click="prevImage" :disabled="imagenes.length <= 1">⬅️</button>
              <button class="btn btn-secondary" @click="nextImage" :disabled="imagenes.length <= 1">➡️</button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-danger" @click="mostrarModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  producto: { type: Object, required: true }
});
const emit = defineEmits(['addToCart']);

// Normalizamos la imagen (si es array o string)
const imagenes = computed(() => {
  return Array.isArray(props.producto.img) ? props.producto.img : [props.producto.img];
});

const imgIndex = ref(0);
const hover = ref(false);
const mostrarModal = ref(false);

// Computed para determinar la imagen actual
const imgSrc = computed(() => {
  let img = imagenes.value[imgIndex.value];
  return img.startsWith('data:') ? img : '/' + img;
});

// Funciones para manejar la rotación automática de imágenes
let interval = null;

const handleMouseEnter = () => {
  hover.value = true;
};

const handleMouseLeave = () => {
  hover.value = false;
  imgIndex.value = 0;
};

watch(
  () => hover.value,
  (nuevaCondicion) => {
    if (nuevaCondicion && imagenes.value.length > 1) {
      interval = setInterval(() => {
        imgIndex.value = (imgIndex.value + 1) % imagenes.value.length;
      }, 2000);
    } else {
      clearInterval(interval);
      interval = null;
      imgIndex.value = 0; 
    }
  }
);

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

// Funciones para el modal: cambiar la imagen manualmente
const nextImage = () => {
  imgIndex.value = (imgIndex.value + 1) % imagenes.value.length;
};

const prevImage = () => {
  imgIndex.value = (imgIndex.value - 1 + imagenes.value.length) % imagenes.value.length;
};

const agregarAlCarrito = () => {
  emit('addToCart', props.producto.id);
};
</script>

<style scoped>
.product-img.hover {
  /* Agrega estilos para el efecto hover si es que lo requieres */
}

.product-img.agotado {
  opacity: 0.5;
}
</style>