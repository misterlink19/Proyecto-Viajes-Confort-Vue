import { ref, watch, onMounted } from "vue";

export function useInventario(categoriasIniciales) {

  //   Se inicializa desde el localStorage si existe, o con los datos iniciales.
  const categorias = ref([]);

 // "flag" para indicar si ha habido cambios que requieren guardar en localStorage.
  const haHabidoModificacion = ref(false);


  //  Inicialización de 'categorias' desde localStorage (al montar el componente)
  onMounted(() => {
    const almacenado = localStorage.getItem("datosCategorias");
    if (almacenado) {
      categorias.value = JSON.parse(almacenado);
    } else {
      categorias.value = categoriasIniciales;
    }
  });

  //    Este watcher "observa" los cambios en 'categorias' y 'haHabidoModificacion'.
  watch(
    [categorias, haHabidoModificacion],
    () => {
      if (haHabidoModificacion.value) {
        localStorage.setItem("datosCategorias", JSON.stringify(categorias.value));
        haHabidoModificacion.value = false; 
      }
    },
    { deep: true }
  );

  // === FUNCIONES PARA MANIPULAR EL INVENTARIO ===

  const agregarProducto = (datosProducto) => {
    if (!Array.isArray(datosProducto.img) || datosProducto.img.length === 0) {
      return false;
    }

    const idCat = typeof datosProducto.categoria === "string"
      ? parseInt(datosProducto.categoria)
      : datosProducto.categoria;

    const categoriaIndex = categorias.value.findIndex((cat) => cat.id === idCat);
    if (categoriaIndex === -1) return false;

    if (
      categorias.value[categoriaIndex].products.some(
        (p) => p.name.toLowerCase() === datosProducto.name.toLowerCase()
      )
    ) {
      return false;
    }

    const nuevoProducto = {
      id: crypto.randomUUID(),
      name: datosProducto.name,
      desc: datosProducto.desc?.trim() || "",
      price: parseFloat(datosProducto.price),
      stock: parseInt(datosProducto.stock),
      img: datosProducto.img,
    };

    const nuevasCategorias = [...categorias.value];
    nuevasCategorias[categoriaIndex].products.push(nuevoProducto);
    categorias.value = nuevasCategorias;

    haHabidoModificacion.value = true;
    return true;
  };

  const editarProducto = (idProducto, nuevosDatos) => {
    let categoriaOrigenId = null;
    let productoActualizado = null;
  
    // Identificar la categoría actual y el producto
    categorias.value.forEach((cat) => {
      const producto = cat.products.find((p) => p.id === idProducto);
      if (producto) {
        categoriaOrigenId = cat.id;
        productoActualizado = producto;
      }
    });
  
    if (!productoActualizado) return;
  
    const nuevaCategoriaId = parseInt(nuevosDatos.categoria);
  
    if (categoriaOrigenId !== nuevaCategoriaId) {
      // Mover el producto a la nueva categoría
      categorias.value = categorias.value.map((cat) => {
        if (cat.id === categoriaOrigenId) {
          return {
            ...cat,
            products: cat.products.filter((p) => p.id !== idProducto),
          };
        } else if (cat.id === nuevaCategoriaId) {
          return {
            ...cat,
            products: [...cat.products, { ...productoActualizado, ...nuevosDatos }],
          };
        }
        return cat;
      });
    } else {
      // Actualizar el producto dentro de la misma categoría
      categorias.value = categorias.value.map((cat) => ({
        ...cat,
        products: cat.products.map((p) =>
          p.id === idProducto ? { ...p, ...nuevosDatos } : p
        ),
      }));
    }
  
    haHabidoModificacion.value = true;
  };
  const eliminarProducto = (idProducto) => {
    categorias.value.forEach((cat) => {
      cat.products = cat.products.filter((p) => p.id !== idProducto);
    });
    haHabidoModificacion.value = true; 
  };

  const agregarCategoria = (nombre) => {
    if (
      categorias.value.some(
        (cat) => cat.name.toLowerCase() === nombre.toLowerCase()
      )
    ) {
      return false;
    }
    categorias.value.push({ id: Date.now(), name: nombre, products: [] });
    haHabidoModificacion.value = true; 
    return true;
  };

  const editarCategoria = (idCategoria, nuevoNombre) => {
    const categoria = categorias.value.find(
      (cat) => cat.id === parseInt(idCategoria)
    );
    if (
      !categoria ||
      categorias.value.some(
        (cat) => cat.name.toLowerCase() === nuevoNombre.toLowerCase()
      )
    ) {
      return false;
    }
    categoria.name = nuevoNombre;
    haHabidoModificacion.value = true;
    return true;
  };

  const eliminarCategoria = (idCategoria) => {
    const categoria = categorias.value.find(
      (cat) => cat.id === parseInt(idCategoria)
    );
    if (!categoria) return false;
    categorias.value = categorias.value.filter(
      (cat) => cat.id !== parseInt(idCategoria)
    );
    haHabidoModificacion.value = true; 
    return true;
  };

  return {
    categorias,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
  };
}