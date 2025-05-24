// src/composables/useCarrito.js
import { ref } from 'vue';

export function useCarrito() {
  // Estado reactivo para almacenar los items del carrito
  const carrito = ref([]);

  // Función para añadir un producto al carrito
  // Recibe el producto a añadir y una función opcional para actualizar el inventario
  const añadirAlCarrito = (producto, actualizarInventario) => {
    const itemExistente = carrito.value.find(item => item.id === producto.id);
    if (itemExistente) {
      // Si el producto ya existe, incrementa su cantidad
      itemExistente.quantity += 1;
    } else {
      // Si no existe, añade un nuevo item al carrito con cantidad 1
      carrito.value.push({ ...producto, quantity: 1 });
    }
    // Llama a la función para actualizar el inventario si se proporciona
    actualizarInventario?.(producto.id, -1);
  };

  // Función para quitar un producto del carrito
  // Recibe el ID del producto a quitar y una función para actualizar el inventario
  const quitarDelCarrito = (idProducto, actualizarInventario) => {
    const item = carrito.value.find(item => item.id === idProducto);
    if (item) {
      if (item.quantity === 1) {
        // Si la cantidad es 1, elimina el item del carrito
        carrito.value = carrito.value.filter(item => item.id !== idProducto);
      } else {
        // Si la cantidad es mayor que 1, decrementa la cantidad
        item.quantity -= 1;
      }
      // Llama a la función para actualizar el inventario (devolviendo 1 al stock)
      actualizarInventario(idProducto, 1);
    }
  };

  // Función para realizar el checkout: genera la factura y vacía el carrito
  const checkout = () => {
    if (carrito.value.length === 0) return null;

    let factura = '========================================\n';
    factura += '          FACTURA DE PEDIDO          \n';
    factura += '========================================\n\n';

    // Calcular la longitud máxima del nombre del artículo para formatear la factura
    let maxNombreLength = 20;
    carrito.value.forEach(item => {
      if (item.name.length > maxNombreLength) {
        maxNombreLength = item.name.length;
      }
    });

    // Encabezado de las columnas de la factura
    factura += `Artículo${' '.repeat(maxNombreLength - 8)} | Cant. |  Precio/u | Total      \n`;
    factura += `${'-'.repeat(maxNombreLength +1)}|-------|----------|------------\n`;

    let total = 0;

    // Iterar sobre los items del carrito para generar las líneas de la factura
    carrito.value.forEach(item => {
      const nombre = item.name.padEnd(maxNombreLength);
      const cantidad = String(item.quantity).padStart(5);
      const precioUnitario = String(item.price).padStart(8);
      const totalItem = String(item.price * item.quantity).padStart(10);

      factura += `${nombre} | ${cantidad} | ${precioUnitario}€ | ${totalItem}€    \n`;
      total += item.price * item.quantity;
    });

    factura += `${'-'.repeat(maxNombreLength)}--------------------------------\n`;
    factura += `TOTAL:                      ${String(total).padStart(10)}€\n\n`;
    factura += '========================================\n';
    factura += '        ¡Gracias por su compra!        \n';
    factura += '========================================\n';

    // Vaciar el carrito después del checkout
    carrito.value = [];
    return factura;
  };

  // Retornar las funciones y el estado del carrito para ser usados en otros componentes
  return { carrito, añadirAlCarrito, quitarDelCarrito, checkout };
}