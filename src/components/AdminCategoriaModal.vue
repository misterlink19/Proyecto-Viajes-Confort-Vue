<template>
  <!-- Modal -->
  <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background: rgba(0,0,0,0.5);"
    v-if="props.show">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">Administrar Categorías</h5>
          <button type="button" class="btn-close" @click="emit('hide')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Tabs nav -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'agregar' }" href="#"
                @click.prevent="activeTab = 'agregar'">Agregar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'editar' }" href="#"
                @click.prevent="activeTab = 'editar'">Editar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'eliminar' }" href="#"
                @click.prevent="activeTab = 'eliminar'">Eliminar</a>
            </li>
          </ul>

          <!-- AGREGAR -->
          <div v-if="activeTab === 'agregar'">
            <form @submit.prevent="handleAddCategorySubmit">
              <div class="mb-3">
                <label class="form-label">Nombre de la Categoría</label>
                <input type="text" class="form-control" :class="{ 'is-invalid': errorAdd }" v-model="addCategoryName"
                  required>
                <div class="invalid-feedback">{{ errorAdd }}</div>
              </div>
              <button type="submit" class="btn btn-success">Agregar Categoría</button>
            </form>
          </div>

          <!-- EDITAR -->
          <div v-if="activeTab === 'editar'">
            <div class="mb-3">
              <label class="form-label">Selecciona una Categoría</label>
              <select class="form-select" v-model="selectedCategoryToEdit" @change="handleEditCategoryChange">
                <option value="">Selecciona una categoría</option>
                <option v-for="category in categorias" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <form v-if="selectedCategoryToEdit" @submit.prevent="handleConfirmEditCategory">
              <div class="mb-3">
                <label class="form-label">Nuevo Nombre</label>
                <input type="text" class="form-control" v-model="editCategoryName" required>
              </div>
              <button type="submit" class="btn btn-primary">Guardar Cambios</button>
            </form>
          </div>

          <!-- ELIMINAR -->
          <div v-if="activeTab === 'eliminar'">
            <div class="mb-3">
              <label class="form-label">Selecciona una Categoría</label>
              <select class="form-select" v-model.number="selectedCategoryToDelete" @change="handleDeleteCategoryChange">

                <option value="">Selecciona una categoría</option>
                <option v-for="category in props.categorias" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Confirmación visual -->
            <div v-if="selectedCategoryToDelete">
              <div class="mb-3">
                <h5>Detalles de la categoría:</h5>
                <ul v-if="detallesCategoriaAEliminar">
                  <li><strong>ID:</strong> {{ detallesCategoriaAEliminar.id }}</li>
                  <li><strong>Nombre:</strong> {{ detallesCategoriaAEliminar.name }}</li>
                  <li><strong>Total de productos:</strong> {{ detallesCategoriaAEliminar.products?.length || 0 }}</li>

                  <li v-if="detallesCategoriaAEliminar.products?.length > 0">
                    <strong>Productos:</strong>
                    <ul class="list-group mt-2">
                      <li class="list-group-item" v-for="prod in detallesCategoriaAEliminar.products" :key="prod.id">
                        <strong>{{ prod.name }}</strong> (ID: {{ prod.id }}) — Stock: {{ prod.stock }}
                      </li>
                    </ul>
                  </li>
                </ul>
                <p v-else class="text-muted">Cargando detalles de la categoría...</p>
              </div>

              <!-- Primera confirmación -->
              <div v-if="!showDeleteWarning">
                <p>¿Seguro que quieres eliminar esta categoría?</p>
                <button class="btn btn-danger" @click="handleInitiateDeleteCategory">Eliminar</button>
              </div>

              <!-- Segunda advertencia si tiene productos -->
              <div v-else>
                <p class="text-warning">
                  Esta categoría contiene productos. ¿Estás seguro de que deseas eliminarla?
                </p>
                <button class="btn btn-danger" @click="eliminarCategoriaDefinitivamente">Sí, eliminar</button>
                <button class="btn btn-secondary ms-2" @click="handleCancelDelete">Cancelar</button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, toRefs } from 'vue';

// Props y eventos
const props = defineProps({
  categorias: Array,
  show: Boolean,
});
const emit = defineEmits(['hide', 'addCategory', 'editCategory', 'deleteCategory', 'notify']);
const { categorias } = toRefs(props);

// Estados
const activeTab = ref('agregar');
const addCategoryName = ref('');
const errorAdd = ref('');
const selectedCategoryToEdit = ref(null);
const editCategoryName = ref('');
const selectedCategoryToDelete = ref(null);
const showDeleteWarning = ref(false);
const detallesCategoriaAEliminar = ref(null);

// Resetear estado del modal cuando se muestra
watch(() => props.show, (visible) => {
  if (visible) {
    activeTab.value = 'agregar';
    addCategoryName.value = '';
    errorAdd.value = '';
    selectedCategoryToEdit.value = null;
    editCategoryName.value = '';
    selectedCategoryToDelete.value = null;
    showDeleteWarning.value = false;
    detallesCategoriaAEliminar.value = null;
  }
});

// Cargar detalles de categoría al seleccionar para eliminar
watch(selectedCategoryToDelete, (categoryId) => {
  const cat = categorias.value.find(c => c.id === categoryId);
  detallesCategoriaAEliminar.value = cat || null;
  showDeleteWarning.value = false; // Resetear advertencia al cambiar
});

// Agregar Categoría
const handleAddCategorySubmit = () => {
  const nombre = addCategoryName.value.trim();
  if (nombre.length < 3) {
    errorAdd.value = 'Debe tener al menos 3 caracteres';
    return;
  }

  emit('addCategory', nombre);
  emit('notify', 'Categoría agregada con éxito', 'success');
  emit('hide');
};

// Editar Categoría
const handleEditCategoryChange = (e) => {
  const id = e.target.value;
  selectedCategoryToEdit.value = id;

  const cat = categorias.value.find(c => c.id.toString() === id.toString());
  editCategoryName.value = cat?.name || '';
};

const handleConfirmEditCategory = () => {
  const nuevoNombre = editCategoryName.value.trim();
  if (!selectedCategoryToEdit.value || nuevoNombre.length < 3) {
    emit('notify', 'Nombre inválido', 'danger');
    return;
  }

  emit('editCategory', selectedCategoryToEdit.value, nuevoNombre);
  emit('notify', 'Categoría editada correctamente', 'info');
  emit('hide');
};

//  Cambiar categoría a eliminar
const handleDeleteCategoryChange = (e) => {
  selectedCategoryToDelete.value = Number(e.target.value);
};

// Confirmación inicial para eliminar
const handleInitiateDeleteCategory = () => {
  const cat = detallesCategoriaAEliminar.value;
  if (cat && cat.products && cat.products.length > 0) {
    showDeleteWarning.value = true; // Mostrar advertencia
  } else {
    eliminarCategoriaDefinitivamente(); // Eliminar directamente
  }
};

// Confirmar eliminación definitiva
const eliminarCategoriaDefinitivamente = () => {
  emit('deleteCategory', selectedCategoryToDelete.value);
  emit('notify', 'Categoría eliminada correctamente', 'danger');

  selectedCategoryToDelete.value = null;
  showDeleteWarning.value = false;
  detallesCategoriaAEliminar.value = null;
  emit('hide');
};

// Cancelar eliminación
const handleCancelDelete = () => {
  showDeleteWarning.value = false;
};
</script>

<style scoped>
.modal {
  display: block;
  overflow-y: auto;
}
</style>