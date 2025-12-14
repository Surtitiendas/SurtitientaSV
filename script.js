
<script>
  // ====== LOAD MORE ======
  const loadMoreBtn = document.querySelector('#load-more');
  let currentItem = 8; // cantidad inicial visible (coincide con el CSS)

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const boxes = [...document.querySelectorAll('.boxes-container .box')];
      const next = Math.min(currentItem + 4, boxes.length);
      for (let i = currentItem; i < next; i++) {
        if (boxes[i]) boxes[i].style.display = 'inline-block'; // style correcto + sin espacio
      }
      currentItem = next;
      if (currentItem >= boxes.length) {
        load        loadMoreBtn.style.display = 'none';
      }
    });
  }

  // ====== CARRITO ======
  const carritoSection = document.getElementById('carrito');
  const productosContainer = document.getElementById('productos');
  const listaTbody = document.querySelector('#lista-carrito tbody');
  const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
  const quitarSeleccionadosBtn = document.getElementById('quitar-seleccionados');

  // Estructura interna del carrito: {id, titulo, precio, imagen, cantidad, seleccionado}
  const carritoItems = [];

  // Delegación: agregar al carrito desde cualquier .box
  if (productosContainer) {
    productosContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.agregar-carrito');
      if (!btn) return;

      e.preventDefault();
      const card = btn.closest('.box');
      if (!card) return;

      const id = card.dataset.id || (window.crypto?.randomUUID?.() ?? String(Date.now()));
      const tituloEl = card.querySelector('.titulo');
      const precioEl = card.querySelector('.precio');
      const imgEl = card.querySelector('img');

      const titulo = tituloEl ? tituloEl.textContent.trim() : 'Producto';
      // Usa data-precio si existe; si no, extrae dígitos del texto
      const precio = precioEl
        ? Number(precioEl.dataset?.precio ?? precioEl.textContent.replace(/[^\d]/g, '')) || 0
        : 0;
      const imagen = imgEl ? imgEl.src : '';

      agregarAlCarrito({ id, titulo, precio, imagen });

      // Ir al carrito (scroll suave)
      if (carritoSection) {
        carritoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        location.hash = '#carrito';
      }
    });
  }

  // Borrar individual, seleccionar y cambiar cantidad dentro del carrito
  if (carritoSection) {
    carritoSection.addEventListener('click', (e) => {
      // Borrar un item
      if (e.target.classList.contains('borrar-item')) {
        e.preventDefault();
        const tr = e.target.closest('tr');
        const id = tr?.dataset.id;
        if (!id) return;
        eliminarDelCarrito(id);
      }
    });

    // Seleccionar/deseleccionar (checkbox en cada fila)
    listaTbody.addEventListener('change', (e) => {
      const chk = e.target.closest('.seleccionar-item');
      if (!chk) return;
      const tr = chk.closest('tr');
      const id = tr?.dataset.id;
      if (!id) return;
      marcarSeleccion(id, chk.checked);
    });

    // Cambiar cantidad
    listaTbody.addEventListener('input', (e) => {
      const qtyInput = e.target.closest('.cantidad-input');
      if (!qtyInput) return;
      const tr = qtyInput.closest('tr');
      const id = tr?.dataset.id;
      const nueva = Math.max(1, Number(qtyInput.value) || 1);
      cambiarCantidad(id, nueva);
    });
  }

  // Vaciar carrito
  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      carritoItems.length = 0;
      renderCarrito();
    });
  }

  // Quitar seleccionados
  if (quitarSeleccionadosBtn) {
    quitarSeleccionadosBtn.addEventListener('click', (e) => {
      e.preventDefault();
      for (let i = carritoItems.length - 1; i >= 0; i--) {
        if (carritoItems[i].seleccionado) carritoItems.splice(i, 1);
      }
      renderCarrito();
    });
  }

  // ====== LÓGICA ======
  function agregarAlCarrito(item) {
    const existente = carritoItems.find((x) => x.id === item.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carritoItems.push({
        id: item.id,
        titulo: item.titulo,
        precio: item.precio,
        imagen: item.imagen,
        cantidad: 1,
        seleccionado: false,
      });
    }
    renderCarrito();
  }

  function eliminarDelCarrito(id) {
    const idx = carritoItems.findIndex((x) => x.id === id);
    if (idx >= 0) {
      carritoItems.splice(idx, 1);
      renderCarrito();
    }
  }

  function marcarSeleccion(id, checked) {
    const it = carritoItems.find((x) => x.id === id);
    if (it) {
      it.seleccionado = checked;
      // Actualiza estilo de la fila sin re-render completo
      const fila = listaTbody.querySelector(`tr[data-id="${CSS.escape(id)}"]`);
      fila?.classList.toggle('seleccionado', checked);
    }
  }

  function cambiarCantidad(id, cantidad) {
    const it = carritoItems.find((x) => x.id === id);
    if (it) {
      it.cantidad = cantidad;
      renderCarrito();
    }
  }

  function renderCarrito() {
    if (!listaTbody) return;
    listaTbody.innerHTML = '';

    carritoItems.forEach((it) => {
      const tr = document.createElement('tr');
      tr.dataset.id = it.id;
      tr.classList.toggle('seleccionado', it.seleccionado);
      tr.innerHTML = `
        <td>
          <input type="checkbox" class="seleccionar-item" ${it.seleccionado ? 'checked' : ''} />
        </td>
        <td>
          ${it.imagen ? `${it.imagen}` : ''}
        </td>
        <td>${escapeHtml(it.titulo)}</td>
        <td>$${formatearPrecio(it.precio)}</td>
        <td>
          <input type="number" class="cantidad-input" min="1" value="${it.cantidad}">
        </td>
        <td>
          #x</a>
        </td>
      `;
      listaTbody.appendChild(tr);
    });
  }

  // Utilidades
  function formatearPrecio(n) {
    return Number(n).toLocaleString('es-CO');
  }
  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

