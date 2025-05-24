  <template>
    <div>
      <!-- Barra de navegación -->
      <Navbar :modoAdmin="modoAdmin" @adminClick="accederAdmin" />

      <!-- Panel de administración -->
      <AdminPanel v-if="modoAdmin" @close="modoAdmin = false" @openProductModal="mostrarModalProducto = true"
        @openCategoryModal="mostrarModalCategoria = true" />

      <!-- Offcanvas para categorías -->
      <div class="offcanvas offcanvas-start" id="offcanvasCategorias">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Categorías</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group">
            <li class="list-group-item" :class="{ active: categoriaSeleccionada === null }"
              @click="categoriaSeleccionada = null">
              Todas las categorías
            </li>
            <li v-for="cat in categorias" :key="cat.id" class="list-group-item"
              :class="{ active: categoriaSeleccionada === cat.id }" @click="categoriaSeleccionada = cat.id">
              {{ cat.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Offcanvas para carrito -->
      <div class="offcanvas offcanvas-end" id="offcanvasCesta">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Cesta</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <Carrito :carrito="carrito" @increase="manejarAgregarAlCarrito" @decrease="manejarEliminarDelCarrito"
            @checkout="manejarCheckout" />
        </div>
      </div>

      <!-- Listado de productos -->
      <div class="container mt-4">
        <div class="row">
          <div class="col-md-8">
            <h2 class="mb-3">
              {{categoriaSeleccionada ? categorias.find(c => c.id === categoriaSeleccionada)?.name :
                "Todas las categorías"}}
            </h2>
            <ProductosList :categorias="categoriasParaMostrar" @addToCart="manejarAgregarAlCarrito" />
          </div>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999">
        <TransitionGroup name="toast" tag="div" class="toast-container position-fixed bottom-0 end-0 p-3"
          style="z-index: 9999">
          <ToastNotificacion v-for="toast in toasts" :key="toast.id" :toast="toast" @remove="removeToast" />
        </TransitionGroup>

      </div>

      <!-- Modales de administración -->
      <AdminProductoModal :show="mostrarModalProducto" @hide="mostrarModalProducto = false" :categorias="categorias"
        @addProduct="agregarProducto" @editProduct="editarProducto" @deleteProduct="eliminarProducto"
        @notify="mostrarNotificacion" />
      <AdminCategoriaModal :show="mostrarModalCategoria" @hide="mostrarModalCategoria = false" :categorias="categorias"
        @addCategory="agregarCategoria" @editCategory="editarCategoria" @deleteCategory="eliminarCategoria"
        @notify="mostrarNotificacion" />
    </div>
  </template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from './components/Navbar.vue';
import ProductosList from './components/ProductosList.vue';
import Carrito from './components/Carrito.vue';
import AdminPanel from './components/AdminPanel.vue';
import AdminProductoModal from './components/AdminProductoModal.vue';
import AdminCategoriaModal from './components/AdminCategoriaModal.vue';
import ToastNotificacion from './components/ToastNotificacion.vue';
import { useInventario } from './composables/useInventario';
import { useCarrito } from './composables/useCarrito';

// Estado de la aplicación
const modoAdmin = ref(false);
const mostrarModalProducto = ref(false);
const mostrarModalCategoria = ref(false);
const categoriaSeleccionada = ref(null);
const toasts = ref([]);

// Datos iniciales para las categorías y productos
const categoriasIniciales = JSON.parse(localStorage.getItem("datosCategorias")) ||  [
  {
    id: 1,
    name: "Maletas de Cabina",
    products: [
      {
        id: crypto.randomUUID(),
        name: "Maleta Rigida Mediana azul",
        desc: "Maleta resistente de tamaño mediano, con carcasa rígida y múltiples compartimentos interiores.",
        price: 45,
        stock: 10,
        img: [
          "img/maleta-rigida-mediana-flow-azul.jpg",
          "img/maleta-rigida-mediana-flow-azul2.jpg",
          "img/maleta-rigida-mediana-flow-azul3.jpg",
          "img/maleta-rigida-mediana-flow-azul4.jpg",
          "img/maleta-rigida-mediana-flow-azul5.jpg"
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Maleta Gladiatior Mediana azul",
        desc: "Modelo Gladiator con diseño ligero y ruedas multidireccionales, ideal para viajes de mediana duración.",
        price: 70,
        stock: 5,
        img: [
          "img/maleta-mediana-gladiator-azul-claro.jpg",
          "img/maleta-mediana-gladiator-azul-claro2.jpg",
          "img/maleta-mediana-gladiator-azul-claro3.jpg",
          "img/maleta-mediana-gladiator-azul-claro4.jpg",
          "img/maleta-mediana-gladiator-azul-claro5.jpg"
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Maleta Pepe jeans Mediana amarilla",
        desc: "Maleta amarilla con acabado ABS y candado TSA. Moderna, llamativa y segura para todo tipo de viajes.",
        price: 34,
        stock: 9,
        img: [
          "img/maleta-abs-70cm-highlight-ocre-pepe-jeans.jpg",
          "img/maleta-abs-70cm-highlight-ocre-pepe-jeans2.jpg",
          "img/maleta-abs-70cm-highlight-ocre-pepe-jeans3.jpg",
          "img/maleta-abs-70cm-highlight-ocre-pepe-jeans4.jpg",
          "img/maleta-abs-70cm-highlight-ocre-pepe-jeans5.jpg"
        ]
      },
    ],
  },
  {
    id: 2,
    name: "Bolsa de mano",
    products: [
      {
        id: crypto.randomUUID(),
        name: "Bolsa de mano de viajero",
        desc: "Elegante y funcional, ideal para llevar lo esencial en cabina. Diseño sobrio y resistente al agua.",
        price: 100,
        stock: 8,
        img: [
          "img/Bolsa-de-Mano-negra.jpg",
          "img/Bolsa-de-Mano-negra2.jpg",
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Bolsa de mano Negro",
        desc: "Bolsa tipo mochila de diseño ergonómico, perfecta para viajes cortos o como equipaje adicional.",
        price: 100,
        stock: 8,
        img: [
          "img/Mochila-bulto.jpg",
          "img/Mochila-bulto2.jpg",
          "img/Mochila-bulto3.jpg",
          "img/Mochila-bulto4.jpg",
          "img/Mochila-bulto5.jpg",
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Bolso de mano negro",
        desc: "Bolso de tela con correa ajustable y múltiples bolsillos. Comodidad y estilo para tus desplazamientos.",
        price: 100,
        stock: 8,
        img: [
          "img/Bulto-de-mano-negro.jpg",
          "img/Bulto-de-mano-negro2.jpg",
          "img/Bulto-de-mano-negro3.jpg",
          "img/Bulto-de-mano-negro4.jpg",
        ]
      },
    ],
  },
  {
    id: 3,
    name: "Set de maletas",
    products: [
      {
        id: crypto.randomUUID(),
        name: "Set de maletas rojas de tela",
        desc: "Set completo de 5 piezas de maletas de tela, resistentes, livianas y de gran capacidad.",
        price: 100,
        stock: 8,
        img: [
          "img/Set-Maletas-rojas-de-tela.png",
          "img/Set-Maletas-rojas-de-tela2.png",
          "img/Set-Maletas-rojas-de-tela3.png",
          "img/Set-Maletas-rojas-de-tela4.png",
          "img/Set-Maletas-rojas-de-tela5.png",
        ]
      },
      {
        id: crypto.randomUUID(),
        name: "Set de maletas rojas rigidas",
        desc: "Set de maletas rígidas con sistema spinner y carcasa dura. Protección y diseño vibrante.",
        price: 100,
        stock: 8,
        img: [
          "img/Set-Maletas-Rojas-rigidas.jpg",
          "img/Set-Maletas-Rojas-rigidas2.jpg",
          "img/Set-Maletas-Rojas-rigidas3.jpg",
          "img/Set-Maletas-Rojas-rigidas4.jpg",
        ]
      },
    ],
  },
];

// Usamos nuestro hook de inventario para gestionar las categorías y productos
const { categorias, agregarProducto, editarProducto, eliminarProducto, agregarCategoria, editarCategoria, eliminarCategoria } = useInventario(categoriasIniciales);
// Usamos el hook del carrito para gestionar la cesta
const { carrito, añadirAlCarrito, quitarDelCarrito, checkout } = useCarrito();

// Computed para filtrar las categorías a mostrar según la selección del usuario
const categoriasParaMostrar = computed(() => {
  return categoriaSeleccionada.value
    ? categorias.value.filter(cat => cat.id === categoriaSeleccionada.value)
    : categorias.value;
});

// Manejo de acceso de administrador
const accederAdmin = () => {
  const pass = prompt("Introduce la contraseña de administrador:");
  if (pass === "123456") {
    modoAdmin.value = true;
    mostrarNotificacion("Modo administrador activado", "success");
  } else {
    mostrarNotificacion("Contraseña incorrecta", "danger");
  }
};


// Notificaciones
const mostrarNotificacion = (mensaje, tipo) => {
  const newToast = { id: Date.now(), message: mensaje, type: tipo };
  toasts.value.push(newToast);
};

// Función para eliminar una notificación toast por su ID
const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id);
};

// Funciones para manejar carrito
// -------------------------------
// Función para actualizar el stock de un producto en la lista de categorías
function actualizarStock(productoId, cantidad) {
  const nuevasCategorias = categorias.value.map(cat => {
    const nuevosProductos = cat.products.map(p => {
      if (p.id === productoId) {
        // Retornar un nuevo objeto producto con el stock actualizado
        return { ...p, stock: p.stock + cantidad };
      }
      return p;
    });
    return { ...cat, products: nuevosProductos };
  });
  // Reemplazar la referencia del array de categorías para disparar la reactividad
  categorias.value = nuevasCategorias;
}

// Función para agregar un producto al carrito
const manejarAgregarAlCarrito = (idProducto) => {
  // Buscar la categoría y el producto por su ID
  const categoria = categorias.value.find(cat => cat.products.some(p => p.id === idProducto));
  if (!categoria) return;
  const producto = categoria.products.find(p => p.id === idProducto);
  if (producto.stock <= 0) {
    mostrarNotificacion("No hay más stock disponible", "danger");
    return;
  }

  // Añadir al carrito y actualizar el stock (pasando directamente la función)
  añadirAlCarrito(producto, actualizarStock);
  mostrarNotificacion("Producto agregado a la cesta", "success");
};

// Función para eliminar un producto del carrito
const manejarEliminarDelCarrito = (idProducto) => {
  // Quitar del carrito y actualizar el stock (pasando la función actualizarStock)
  quitarDelCarrito(idProducto, actualizarStock);
  mostrarNotificacion("Producto removido de la cesta", "info");
};

// Función para manejar el checkout del carrito
const manejarCheckout = () => {
  const factura = checkout();
  if (factura) {
    // Guardar el estado actual de las categorías en localStorage (simulando persistencia)
    localStorage.setItem("datosCategorias", JSON.stringify(categorias.value));

    // Crear un enlace para descargar la factura como un archivo de texto
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(factura));
    link.setAttribute("download", "factura_" + Date.now() + ".txt");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    mostrarNotificacion("Pedido realizado con éxito. Factura descargada.", "success");
  } else {
    mostrarNotificacion("La cesta está vacía", "warning");
  }
};
</script>

<style>
body {
  padding-top: 70px; /* Para compensar la altura de la navbar fija */
}

.toast-container {
  z-index: 3000; /* Asegura que las notificaciones estén por encima de otros elementos */
}
</style>