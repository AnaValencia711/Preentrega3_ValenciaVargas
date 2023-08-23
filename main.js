



document.addEventListener('DOMContentLoaded', () => {

    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Arroz con Pollo',
            precio: 25,
            imagen: 'img/acp.jpg'
        },
        {
            id: 2,
            nombre: 'Ceviche',
            precio: 33,
            imagen: 'img/ceviche.jpg'
        },
        {
            id: 3,
            nombre: 'Chicha Morada',
            precio: 4.5,
            imagen: 'img/chicha.jpg'
        },
        {
            id: 4,
            nombre: 'Maracuya',
            precio: 5.2,
            imagen: 'img/maracuya.jpg'
        }

    ];
let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;

// Funciones

/**
* Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
*/
function renderizarProductos() {
    baseDeDatos.forEach((info) => {
        // Estructura
        const miPlato = document.createElement('div');
        miPlato.classList.add('card', 'col-sm-4');
        // Body
        const miPlatoCardBody = document.createElement('div');
        miPlatoCardBody.classList.add('card-body');
        // Titulo
        const miPlatoTitle = document.createElement('h5');
        miPlatoTitle.classList.add('card-title');
        miPlatoTitle.textContent = info.nombre;
        // Imagen
        const miPlatoImagen = document.createElement('img');
        miPlatoImagen.classList.add('img-fluid');
        miPlatoImagen.setAttribute('src', info.imagen);
        // Precio
        const miPlatoPrecio = document.createElement('p');
        miPlatoPrecio.classList.add('card-text');
        miPlatoPrecio.textContent = `${info.precio}${divisa}`;
        // Boton 
        const miPlatoBoton = document.createElement('button');
        miPlatoBoton.classList.add('btn', 'btn-primary');
        miPlatoBoton.textContent = '+';
        miPlatoBoton.setAttribute('marcador', info.id);
        miPlatoBoton.addEventListener('click', anyadirProductoAlCarrito);
        // Insertamos
        miPlatoCardBody.appendChild(miPlatoImagen);
        miPlatoCardBody.appendChild(miPlatoTitle);
        miPlatoCardBody.appendChild(miPlatoPrecio);
        miPlatoCardBody.appendChild(miPlatoBoton);
        miPlato.appendChild(miPlatoCardBody);
        DOMitems.appendChild(miPlato);
    });
}

/**
* Evento para añadir un producto al carrito de la compra
*/
function anyadirProductoAlCarrito(evento) {
   
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    renderizarCarrito();

                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();
            }


            function renderizarCarrito() {
                // Vaciamos todo el html
                DOMcarrito.textContent = '';
                // Quitamos los duplicados
                const carritoSinDuplicados = [...new Set(carrito)];
            
                carritoSinDuplicados.forEach((item) => {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        // ¿Coincide las id? Solo puede existir un caso
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Cuenta el número de veces que se repite el producto
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                  
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Creamos el nodo del item del carrito
                    const miPlato = document.createElement('li');
                    miPlato.classList.add('list-group-item', 'text-right', 'mx-2');
                    miPlato.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos
                    miPlato.appendChild(miBoton);
                    DOMcarrito.appendChild(miPlato);
                    });
                    // Renderizamos el precio total en el HTML
                    DOMtotal.textContent = calcularTotal();
                    }

                    /**
                    * Evento para borrar un elemento del carrito
                    */
                    function borrarItemCarrito(evento) {
                    // Obtenemos el producto ID que hay en el boton pulsado
                    const id = evento.target.dataset.item;
                    // Borramos todos los productos
                    carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                    });
                    // volvemos a renderizar
                    renderizarCarrito();
                    // Actualizamos el LocalStorage
                    guardarCarritoEnLocalStorage();

}

/**
* Calcula el precio total teniendo en cuenta los productos repetidos
*/
function calcularTotal() {
// Recorremos el array del carrito 
return carrito.reduce((total, item) => {
    // De cada elemento obtenemos su precio
    const miItem = baseDeDatos.filter((itemBaseDatos) => {
        return itemBaseDatos.id === parseInt(item);
    });
                    // Los sumamos al total
                    return total + miItem[0].precio;
                }, 0).toFixed(2);
            }

            /**
            * Varia el carrito y vuelve a dibujarlo
            */
            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                // Borra LocalStorage
                localStorage.clear();

            }
function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
   
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
DOMbotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
cargarCarritoDeLocalStorage();
renderizarProductos();
renderizarCarrito();
});