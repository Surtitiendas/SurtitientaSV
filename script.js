// Botón "Cargar más"
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;

loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.boxes-container .box')];
    for (let i = currentItem; i < currentItem + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'inline-block';
        }
    }
    currentItem += 4;
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
};

// Carrito
const carrito = document.getElementById('carrito');
const elementos = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total'); // elemento donde se mostrará el total
const contadorCarrito = document.getElementById('contador'); // elemento donde se mostrará cantidad

let productosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    elementos.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: parseFloat(elemento.querySelector('.precio').textContent.replace('$', '')),
        id: elemento.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    // Revisar si ya existe en el carrito
    const existe = productosCarrito.some(prod => prod.id === infoElemento.id);
    if (existe) {
        productosCarrito = productosCarrito.map(prod => {
            if (prod.id === infoElemento.id) {
                prod.cantidad++;
            }
            return prod;
        });
    } else {
        productosCarrito.push(infoElemento);
    }

    actualizarCarrito();
}

function actualizarCarrito() {
    // Limpiar HTML previo
    limpiarCarrito();

    // Insertar cada producto
    productosCarrito.forEach(prod => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${prod.imagen}" width="100" height="150"></td>
            <td>${prod.titulo}</td>
            <td>$${prod.precio}</td>
            <td>${prod.cantidad}</td>
            <td><a href="#" class="borrar" data-id="${prod.id}">x</a></td>
        `;
        lista.appendChild(row);
    });

    // Actualizar contador y total
    const total = productosCarrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    const cantidad = productosCarrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    totalCarrito.textContent = `Total: $${total}`;
    contadorCarrito.textContent = `Productos: ${cantidad}`;
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const id = e.target.getAttribute('data-id');
        productosCarrito = productosCarrito.filter(prod => prod.id !== id);
        actualizarCarrito();
    }
}

function vaciarCarrito() {
    productosCarrito = [];
    actualizarCarrito();
}

function limpiarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
}
