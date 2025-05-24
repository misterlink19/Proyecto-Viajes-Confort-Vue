<template>
  <div class="modal fade show d-block" tabindex="-1" role="dialog" v-if="props.show"
    style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Administrar Productos</h5>
          <button type="button" class="btn-close" @click="emit('hide')"></button>
        </div>

        <div class="modal-body">
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'agregar' }"
                @click.prevent="activeTab = 'agregar'">Agregar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'editar' }"
                @click.prevent="activeTab = 'editar'">Editar</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: activeTab === 'eliminar' }"
                @click.prevent="activeTab = 'eliminar'">Eliminar</a>
            </li>
          </ul>

          <div v-if="activeTab === 'agregar'">
            <form @submit.prevent="manejarEnvioAgregar">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="datosFormulario.name" type="text" class="form-control"
                  :class="{ 'is-invalid': erroresFormulario.name }" required>
                <div class="invalid-feedback">{{ erroresFormulario.name }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea v-model="datosFormulario.desc" class="form-control" rows="3" required></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input v-model="datosFormulario.price" type="number" class="form-control" required>
                <div class="invalid-feedback">{{ erroresFormulario.price }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model="datosFormulario.stock" type="number" class="form-control" required>
                <div class="invalid-feedback">{{ erroresFormulario.stock }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Imágenes</label>
                <input type="file" @change="manejarMultiplesImagenes($event, datosFormulario.img)" class="form-control"
                  multiple>
                <div class="d-flex flex-wrap mt-2 gap-2">
                  <div v-for="(src, i) in datosFormulario.img" :key="i" class="preview-wrapper">
                    <img :src="src" class="preview-img">
                    <button type="button" class="remove-btn btn btn-sm btn-danger"
                      @click="eliminarImagen(i, datosFormulario.img)">✖</button>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <select v-model.number="datosFormulario.categoria" class="form-select">
                  <option value="">Selecciona una categoría</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="invalid-feedback">{{ erroresFormulario.categoria }}</div>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="emit('hide')">Cancelar</button>
                <button type="submit" class="btn btn-success">Guardar Producto</button>
              </div>
            </form>
          </div>

          <div v-if="activeTab === 'editar'">
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <select v-model="categoriaEditarId" @change="manejarCambioEditarCategoria" class="form-select">
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div v-if="categoriaEditarId" class="mb-3">
              <label class="form-label">Producto</label>
              <select v-model="productoEditarId" @change="manejarCambioEditarProducto" class="form-select">
                <option value="">Selecciona un producto</option>
                <option v-for="prod in categorias.find(c => c.id === categoriaEditarId)?.products" :key="prod.id"
                  :value="prod.id">{{ prod.name }}</option>
              </select>
            </div>
            <form v-if="productoEditarId" @submit.prevent="manejarEnvioEditar">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="datosEditar.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea v-model="datosEditar.desc" class="form-control" rows="3" required></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Precio</label>
                <input v-model="datosEditar.price" type="number" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Stock</label>
                <input v-model="datosEditar.stock" type="number" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Imágenes</label>
                <input type="file" @change="manejarMultiplesImagenes($event, datosEditar.img)" class="form-control"
                  multiple>
                <div class="d-flex flex-wrap mt-2 gap-2">
                  <div v-for="(src, i) in datosEditar.img" :key="i" class="preview-wrapper">
                    <img :src="src" class="preview-img">
                    <button type="button" class="remove-btn btn btn-sm btn-danger"
                      @click="eliminarImagen(i, datosEditar.img)">✖</button>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Categoría</label>
                <select v-model.number="datosEditar.categoria" class="form-select">
                  <option value="">Selecciona una categoría</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <div class="invalid-feedback">{{ erroresFormulario.categoria }}</div>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="emit('hide')">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>

          <div v-if="activeTab === 'eliminar'">
            <div class="mb-3">
              <label class="form-label">Categoría</label>
              <select v-model="categoriaEliminarId" @change="manejarCambioEliminarCategoria" class="form-select">
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
              <div v-if="categoriaEliminarId" class="mb-3">
                <label class="form-label">Producto</label>
                <select v-model="productoEliminarId" class="form-select">
                  <option value="">Selecciona un producto</option>
                  <option v-for="prod in categorias.find(c => c.id === categoriaEliminarId)?.products" :key="prod.id"
                    :value="prod.id">
                    {{ prod.name }}
                  </option>
                </select>
              </div>

            </div>
            <div v-if="datosProductoEliminar" class="mb-3 border rounded p-3">
              <h5>Detalles del Producto:</h5>
              <ul>
                <li><strong>ID:</strong> {{ datosProductoEliminar.id }}</li>
                <li><strong>Nombre:</strong> {{ datosProductoEliminar.name }}</li>
                <li><strong>Descripción:</strong> {{ datosProductoEliminar.desc }}</li>
                <li><strong>Precio:</strong> €{{ datosProductoEliminar.price }}</li>
                <li><strong>Stock:</strong> {{ datosProductoEliminar.stock }}</li>
              </ul>
              <div v-if="datosProductoEliminar.img?.length">
                <strong>Imágenes:</strong>
                <div class="d-flex flex-wrap gap-2 mt-2">
                  <img v-for="(src, idx) in datosProductoEliminar.img" :key="idx" :src="src" class="preview-img"
                    alt="Ima gen del producto" />
                </div>
              </div>
            </div>

            <div v-if="productoEliminarId">
              <div v-if="mostrarConfirmacionEliminar">
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
                <button class="btn btn-danger" @click="manejarConfirmarEliminar">Sí, eliminar</button>
                <button class="btn btn-secondary ms-2" @click="mostrarConfirmacionEliminar = false">Cancelar</button>
              </div>
              <div v-else>
                <button class="btn btn-danger" @click="mostrarConfirmacionEliminar = true">Eliminar Producto</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  categorias: Array,
  show: Boolean,
});

const emit = defineEmits(['hide', 'addProduct', 'editProduct', 'deleteProduct', 'notify']);

const activeTab = ref('agregar');
const datosFormulario = ref({ name: '', desc: '', price: '', stock: '', img: [], categoria: '' });
const erroresFormulario = ref({});
const categoriaEditarId = ref('');
const productoEditarId = ref('');
const datosEditar = ref({ name: '', desc: '', price: '', stock: '', img: [] });
const categoriaEliminarId = ref('');
const productoEliminarId = ref('');
const mostrarConfirmacionEliminar = ref(false);
const datosProductoEliminar = ref(null);

// Sincronizamos el estado del modal con la prop "show"
watch(() => props.show, (nuevoValor) => {
  if (nuevoValor) {
    activeTab.value = 'agregar';
    datosFormulario.value = { name: '', price: '', stock: '', img: [], categoria: '' };
    erroresFormulario.value = {};
    categoriaEditarId.value = '';
    productoEditarId.value = '';
    datosEditar.value = { name: '', price: '', stock: '', img: [], categoria:'' };
    categoriaEliminarId.value = '';
    productoEliminarId.value = '';
    mostrarConfirmacionEliminar.value = false;
    datosProductoEliminar.value = null;
  }
});

watch(productoEliminarId, (id) => {
  const categoria = props.categorias.find(c => c.id === categoriaEliminarId.value);
  if (categoria) {
    const producto = categoria.products.find(p => p.id === id);
    datosProductoEliminar.value = producto || null;
  } else {
    datosProductoEliminar.value = null;
  }
});


// Manejar las imágenes (agregar varias imágenes)
const manejarMultiplesImagenes = (event, imgArray) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgArray.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

// Eliminar una imagen
const eliminarImagen = (index, imgArray) => {
  imgArray.splice(index, 1);
};


// Agregar producto
const manejarEnvioAgregar = () => {
  const errores = {};

  if (!datosFormulario.value.name.trim()) errores.name = 'El nombre es obligatorio';
  if (!datosFormulario.value.price || datosFormulario.value.price <= 0) errores.price = 'Precio inválido';
  if (!datosFormulario.value.stock || datosFormulario.value.stock < 0) errores.stock = 'Stock inválido';
  if (!datosFormulario.value.categoria) errores.categoria = 'Debes seleccionar una categoría';
  if (datosFormulario.value.img.length === 0) errores.img = 'Debes agregar al menos una imagen';
  if (!datosFormulario.value.desc || datosFormulario.value.desc.length < 10) errores.desc = 'Descripción muy corta';

  erroresFormulario.value = errores;
  if (Object.keys(errores).length > 0) return;

  console.log('Valor de la categoría justo antes de emitir (reforzado):', datosFormulario.value.categoria, typeof datosFormulario.value.categoria);
  emit('addProduct', {
    name: datosFormulario.value.name,
    desc: datosFormulario.value.desc,
    price: datosFormulario.value.price,
    stock: datosFormulario.value.stock,
    img: datosFormulario.value.img,
    categoria: datosFormulario.value.categoria // <---- Asegurándonos de pasar la propiedad 'categoria'
  });
  emit('notify', 'Producto agregado con éxito', 'success');
  emit('hide');
};
// Cambiar la categoría a editar
const manejarCambioEditarCategoria = () => {
  productoEditarId.value = '';
};

// Cambiar el producto a editar
const manejarCambioEditarProducto = () => {
    const categoria = props.categorias.find(c => c.id === categoriaEditarId.value);
    const producto = categoria?.products.find(p => p.id === productoEditarId.value);
    if (producto) {
        datosEditar.value = { ...producto, categoria: categoriaEditarId.value }; 
    }
};

// Enviar los cambios de edición
const manejarEnvioEditar = () => {
  const productoEditado = { ...datosEditar.value, id: productoEditarId.value };
  emit('editProduct', productoEditarId.value, productoEditado);
  emit('notify', 'Producto editado correctamente', 'info');
  emit('hide');
};

// Cambiar la categoría a eliminar
const manejarCambioEliminarCategoria = () => {
  productoEliminarId.value = '';
  mostrarConfirmacionEliminar.value = false; // Resetear la confirmación al cambiar de categoría
};

// Confirmar eliminación del producto
const manejarConfirmarEliminar = () => {
  emit('deleteProduct', productoEliminarId.value);
  emit('notify', 'Producto eliminado correctamente', 'danger');
  emit('hide');
};
</script>

<style scoped>
.preview-wrapper {
  position: relative;
  display: inline-block;
}

.preview-img {
  max-width: 100px;
  border: 1px solid #ccc;
  padding: 2px;
  border-radius: 4px;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: white;
  border: 1px solid #ccc;
  color: red;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
}

.remove-btn:hover {
  background-color: red;
  color: white;
}
</style>