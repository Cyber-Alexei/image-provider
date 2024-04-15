const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");
const imagenesPorPagina = 30;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

// ------------------------------------ Funciones

function calcularPaginas(hitsPixabay) {
  return parseInt(Math.ceil(hitsPixabay / imagenesPorPagina));
}

// -----------------

function buscarImagenes() {
  const termino = document.querySelector("#termino").value;
  const key = "19477569-3137a6fbb4bc4533ce239bd65";
  const URL = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

  fetch(URL)
    .then((resultado) => resultado.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
}

// ----------------- Generador que va a registrar la cantidad de elementos de acuerdo a las paginas

function* crearPaginado(totalPaginas) {
  for (let i = 1; i <= totalPaginas; i++) {
    yield i;
  }
}

// ------------

function imprimirPaginado() {
  iterador = crearPaginado(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    // Caso contrario generar un boton por cada elemento en el generador
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.className =
      "siguiente bg-yellow-400 px-4 py-1 mr-2 font-bold mb-3 rounded";

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}

// -----------------

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;
  if (terminoBusqueda === "") {
    mostrarAlerta("Escribe un termino de busqueda");
    return;
  }

  buscarImagenes();
}

// -----------------

function mostrarAlerta(mensaje) {
  const special1 = document.querySelector(".special1");

  if (special1) {
    return;
  }
  const alerta = document.createElement("P");
  alerta.className =
    "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center special1";

  alerta.innerHTML = `
  <strong class="font-bold">Error!</strong>
  <br>
  <span class="block sm:inline">${mensaje}</span>
  `;
  formulario.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

// -----------------

function mostrarImagenes(imagenes) {
  // Limpiar resultados anteriores

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  // Iterar sobre el array de la nueva busqueda

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    // Imprimir los resultados en la pagina

    resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img src="${previewURL}" class="w-full"/>
                <div class="p-4">
                    <p class="font-bold">${likes} <span class="font-light">Me Gusta</span></p>
                    <p class="font-bold">${views} <span class="font-light">Vistas</span></p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 px-5"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer"> 
                        ver Imagen
                    </a>
                </div>
            </div>
        </div>
    `;
  });

  // Limpiamos antiguo paginador
  while (paginacionDiv.firstChild) {
    paginacionDiv.removeChild(paginacionDiv.firstChild);
  }

  // Generamos nuevo paginador
  imprimirPaginado();
}
