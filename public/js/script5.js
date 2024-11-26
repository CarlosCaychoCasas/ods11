function toggleMenu() {
    document.querySelector(".menu").classList.toggle("active");
  }

const div = document.querySelector(".ods"),
texto = "Presentamos una solución innovadora que transforma la manera en que interactuamos con nuestro entorno, promoviendo un estilo de vida más sostenible y consciente.";

function efectoTextTyping (elemento,texto,i = 0){
    elemento.textContent += texto[i];

if (i == texto.length -1) return;

    setTimeout(() => efectoTextTyping(div,texto,i + 1) ,20);
   
}
efectoTextTyping(div, texto)

function scrollToTop() {
    window.scrollTo({
        top: 0,   
        behavior: 'smooth'   
    });
  }


  // Función que se ejecuta cuando el elemento es visible o sale de la vista
function onIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Cuando la sección entra en la vista, iniciar la animación
        entry.target.style.transition = "opacity 1s, transform 1s"; // Activar la transición
        entry.target.style.opacity = "1"; // Hacer visible el contenido
        entry.target.style.transform = "translateX(0)"; // Desplazar de izquierda a derecha
      } else {
        // Cuando la sección sale de la vista, reiniciar el desplazamiento
        entry.target.style.transition = "opacity 1s, transform 1s"; // Activar la transición
        entry.target.style.opacity = "0"; // Volver a hacerlo invisible
        entry.target.style.transform = "translateX(-100px)"; // Volver a la posición inicial (izquierda)
      }
    });
  }
  
  // Crear un observador de intersección
  const observer = new IntersectionObserver(onIntersection, {
    threshold: 0.2 // El 50% del elemento debe estar visible
  });
  
  // Seleccionar las secciones que deseas observar (en este caso 11 elementos con IDs específicos)
  const sections = [
    'invo', 'acc', 'acc1', 'acc2', 'acc3', 'acc4', 'acc5', 'acc6', 'juegos' , 'accion'  , 'frame'  , 'frame1' , 'frame2' 
  ];  
  
  // Observar cada uno de los elementos
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }
  });




  
  // Asignamos un evento 'onsubmit' al formulario con id 'reservation-form'
  // Esto significa que la función que se asigna se ejecutará cuando el formulario sea enviado
  document.getElementById('form').onsubmit = async e => {

    // Prevenimos el comportamiento por defecto del formulario (evitar que se recargue la página)
    // 'e' es el objeto del evento, y preventDefault() evita que se ejecute la acción predeterminada del formulario
    // Esto previene que el formulario se envíe de la manera tradicional (que recargaría la página)
    e.preventDefault();

    // Enviamos los datos del formulario de manera asíncrona (sin recargar la página)
    // 'fetch' se utiliza para hacer solicitudes HTTP, y 'await' hace que el código espere la respuesta sin bloquear
    const res = await fetch('/comprar_producto', {
      method: 'POST', // Definimos el método de la solicitud HTTP como 'POST' (usamos POST porque estamos enviando datos al servidor)
      
      // Definimos los encabezados (headers) para la solicitud
      headers: { 
        'Content-Type': 'application/json' // Indicamos que el contenido que estamos enviando está en formato JSON
      },

      // Convertimos los datos del formulario en un objeto JSON
      // 'new FormData(e.target)' crea un objeto FormData que contiene los datos del formulario
      // 'Object.fromEntries()' convierte el FormData en un objeto de JavaScript
      // 'JSON.stringify()' convierte el objeto en una cadena JSON para poder enviarlo al servidor
      body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
    })
    .then(r => r.json()) // Cuando la respuesta es recibida, la convertimos de JSON a un objeto de JavaScript
    .catch(() => ({ error: 'Error' })); // Si ocurre un error en el proceso, devolvemos un objeto con un mensaje de error

    // Mostramos el mensaje de respuesta (error o éxito) en el elemento con id 'response'
    // Si el servidor ha devuelto un mensaje de error o éxito, lo mostramos en el elemento con el id 'response'
    document.getElementById('response').innerText = res.error || res.message;

    // Limpiamos el formulario (reseteamos los campos)
    // 'e.target' hace referencia al formulario que se envió. La función 'reset()' limpia todos los campos del formulario
    e.target.reset();
  };







  document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const maxProductos = 3;
    const carritoList = document.getElementById("carrito-list");
    const contadorCarrito = document.getElementById("contador-carrito");
    const botonesAgregar = document.querySelectorAll(".btn-add");
    const formulario = document.getElementById("form");
  
    let productoSeleccionado = null; // Producto que se enviará en el formulario
  
    // Actualizar visualización del carrito y contador
    const actualizarCarrito = () => {
      carritoList.innerHTML = "";
      carrito.forEach((producto, index) => {
        const item = document.createElement("li");
        item.textContent = producto;
  
        // Botón para comprar ahora
        const comprarBtn = document.createElement("button");
        comprarBtn.textContent = "Comprar Ahora";
        comprarBtn.className = "btn-comprar";
        comprarBtn.addEventListener("click", () => {
          seleccionarProducto(index);
          // Desplazar hacia el formulario
          document.getElementById("form").scrollIntoView({ behavior: 'smooth' });
        });
  
        // Botón para cancelar
        const cancelarBtn = document.createElement("button");
        cancelarBtn.textContent = "Cancelar";
        cancelarBtn.className = "btn-cancelar";
        cancelarBtn.addEventListener("click", () => cancelarProducto(index));
  
        // Añadir botones al ítem
        item.appendChild(comprarBtn);
        item.appendChild(cancelarBtn);
        carritoList.appendChild(item);
      });
  
      // Actualizar contador de productos
      contadorCarrito.textContent = carrito.length;
    };
  
    // Añadir producto al carrito
    botonesAgregar.forEach((boton) => {
      boton.addEventListener("click", () => {
        const producto = boton.getAttribute("data-producto");
        if (carrito.length < maxProductos) {
          if (!carrito.includes(producto)) {
            carrito.push(producto);
            actualizarCarrito();
          } else {
            alert("Este producto ya está en el carrito.");
          }
        } else {
          alert("Solo puedes añadir hasta 3 productos al carrito.");
        }
      });
    });
  
    // Seleccionar producto para comprar
    const seleccionarProducto = (index) => {
      productoSeleccionado = carrito[index];
      alert(`Has seleccionado "${productoSeleccionado}". Completa el formulario para finalizar la compra.`);
  
      // Llenar el formulario con los datos
      document.getElementById("cantidad").value = 1; // Prellenar cantidad (por defecto 1)
      document.getElementById("nombre_cliente").focus(); // Dar foco al primer campo del formulario
    };
  
    // Cancelar producto
    const cancelarProducto = (index) => {
      carrito.splice(index, 1);
      actualizarCarrito();
      alert("Producto eliminado del carrito.");
    };
  
    // Manejo del formulario
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();
  
      if (!productoSeleccionado) {
        alert("No has seleccionado ningún producto para comprar.");
        return;
      }
  
      // Validación de los campos del formulario
      const nombreCliente = document.getElementById("nombre_cliente").value;
      const correoCliente = document.getElementById("correo_cliente").value;
      const direccionCliente = document.getElementById("direccion_cliente").value;
  
      // Si hay campos vacíos, mostrar alerta y no eliminar el producto
      if (!nombreCliente || !correoCliente || !direccionCliente) {
        alert("Por favor, completa todos los campos del formulario.");
        return; // No eliminar producto si no se envía correctamente
      }
  
      // Enviar el formulario al servidor usando Fetch
      fetch("/comprar_producto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_cliente: nombreCliente,
          correo_cliente: correoCliente,
          direccion_cliente: direccionCliente,
          cantidad: document.getElementById("cantidad").value,
          metodo_pago: document.getElementById("metodo_pago").value,
        }),
      })
      .then((response) => response.json()) // Se espera la respuesta en formato JSON
      .then((data) => {
        if (data.message) {
          // Si la compra fue exitosa, eliminamos el producto del carrito
          const index = carrito.indexOf(productoSeleccionado);
          if (index > -1) {
            carrito.splice(index, 1); // Eliminar del carrito
          }
          productoSeleccionado = null; // Reiniciar selección
          actualizarCarrito();
          alert(data.message); // Mostrar mensaje de éxito
        } else if (data.error) {
          // Si hubo un error en el servidor, mostramos el error
          alert(data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al procesar la compra. Intenta nuevamente más tarde.");
      });
    });
  });
  