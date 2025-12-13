let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;

loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.boxes-container .box')];
    for(var i = currentItem; i < currentItem + 4; i++) {
        boxes[i] .Style.display = 'inline- block';
    }
    currentItem += 4;
    if(currentItem >= boxes.length) {
        loadMoreBtn.Style.display ='none'
    }
}
//carrito
const carrito = document.getElementById('carrito');
const elementos = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();
function cargarEventListeners(){
    elementos.addEventListener('click',comprarElemento);
    carrito.addEventListener('click',eliminarElemento);
    vaciarCarritoBtn.addEventListener('click',vaciarCarrito);
}
function comprarElemento(e){
    e.preventDefault();
    if(e.target.classList.contains('agreagr-carrito')){
        const elemento = e.target.parentElement.parentElement;
        leerDatosElemento(elemento);
    }
}
function leerDatosElemento(elemeto){
    const infoElemento ={
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemeto.querySelector('precio').textContent,
        id: elemeto.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoelemento);
}
function insertarCarrito(elemento){
    const row = document.createElement('tr');
    row.innerHTML = ``
    

}
