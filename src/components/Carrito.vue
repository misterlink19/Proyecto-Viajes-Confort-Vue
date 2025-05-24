<template>
  <div>
    <p v-if="carrito.length === 0" class="text-center text-muted">
      La cesta está vacía.
    </p>

    <template v-else>
      <ul id="elementos-cesta" class="list-group">
        <li
          v-for="item in carrito"
          :key="item.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <img
            :src="getImageSrc(item)"
            :alt="item.name"
            class="product-img"
            style="max-width: 50px;"
          />
          {{ item.name }} - {{ item.quantity }} u.
          <div>
            <button class="btn btn-primary btn-sm me-1" @click="emit('increase', item.id)">➕</button>
            <button class="btn btn-danger btn-sm" @click="emit('decrease', item.id)">➖</button>
          </div>
        </li>
      </ul>

      <p class="mt-3">
        <strong>Total:</strong> {{ total }}€
      </p>
      <button type="button" class="btn btn-success" @click="handleCheckoutConfirmation">
        Realizar Pedido
      </button>
    </template>
  </div>
</template>

  
  <script setup>
  import { computed, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    carrito: Array,
  });
  const emit = defineEmits(['increase', 'decrease', 'checkout']);
  
  const total = computed(() =>
    props.carrito.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  
  const getImageSrc = (item) => {
    if (Array.isArray(item.img)) return item.img[0];
    if (item.img?.startsWith('data:') || item.img?.startsWith('/')) return item.img;
    return '/' + item.img;
  };
  
  const handleCheckoutConfirmation = () => {
    if (window.confirm('¿Estás seguro de que deseas realizar el pedido y generar la factura?')) {
      emit('checkout');
    }
  };
  </script>
  
  <style scoped>
  .product-img {
    border: 1px solid #ccc;
    padding: 2px;
  }
  </style>