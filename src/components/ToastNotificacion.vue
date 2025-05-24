<template>
    <div
      v-if="visible"
      :class="['toast', 'show', 'align-items-center', 'text-white', `bg-${toast.type}`, 'border-0', 'mb-2', visible ? 'toast-enter' : 'toast-exit']"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toast.message }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Cerrar"
          @click="handleClose"
        ></button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, onMounted, watch } from 'vue';
  
  const props = defineProps({
    toast: { type: Object, required: true },
  });
  const emit = defineEmits(['remove']);
  
  const visible = ref(true);
  
  onMounted(() => {
    setTimeout(() => {
      visible.value = false;
    }, 3000);
  });

// Observamos cambios en `visible` para eliminar el toast del DOM tras la animación
watch(visible, (newVal) => {
  if (!newVal) {
    setTimeout(() => emit('remove', props.toast.id), 550);
  }
});
  
  const handleClose = () => {
    visible.value = false;
  };
  </script>
  
  <style></style>