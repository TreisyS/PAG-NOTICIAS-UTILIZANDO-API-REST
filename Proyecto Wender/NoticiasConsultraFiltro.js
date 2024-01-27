
     const apiUrl = 'https://localhost:7014/api/Noticias';
     let currentPage = 1;
     const pageSize = 10;

     function cargarNoticias(url, page, pageSize) {
         $.ajax({
             url: `${url}?page=${page}&pageSize=${pageSize}`,
             type: 'GET',
             dataType: 'json',
             success: function (data) {
                 mostrarNoticias(data);
             },
             error: function (error) {
                 console.error('Error al obtener noticias:', error);
             }
         });
     }

     function mostrarNoticias(noticias) {
         const noticiasListContainer = $('#noticias-list');
         noticiasListContainer.empty();

         noticias.forEach(noticia => {
             const noticiaHTML = `
                 <div id="noticiasitem">
                     <h2>${noticia.titulo}</h2>
                     <p><strong>Fecha:</strong> ${noticia.fecha}</p>
                     <p><strong>Contenido:</strong> ${noticia.contenido}</p>
                     
                     <button type="button" onclick="mostrarDetalles('${noticia.pais}', '${noticia.categoria}', '${noticia.fuente}', '${noticia.enlace}', '${noticia.autor}', ${noticia.id})">Detalles</button>
                     
                     <div id="detalles-${noticia.id}" class="detalles"></div>
                 </div>
                 <hr>
             `;
             noticiasListContainer.append(noticiaHTML);
         });
     }

     function mostrarDetalles(pais, categoria, fuente, enlace, autor, id) {
 const detallesContainer = $(`#detalles-${id}`);
 const detallesHTML = `
     <p><strong>País:</strong> ${pais}</p>
     <p><strong>Categoría:</strong> ${categoria}</p> 
     <p><strong>Fuente:</strong> ${fuente}</p>
     <p><strong>Enlace:</strong> ${enlace}</p>
     <p><strong>Autor:</strong> ${autor}</p>
 `;
 detallesContainer.html(detallesHTML).toggle();
}

//filtro
function filterItems() {
 const pais = document.getElementById("pais").value;
 const categoria = document.getElementById("categoria").value;
 const busqueda = document.getElementById("busqueda").value;

 let filteredUri = 'https://localhost:7014/api/Noticias';

 if (pais) {
     filteredUri += `/ByCountry/${pais}`;
 } else if (categoria) {
     filteredUri += `/ByCategory/${categoria}`;
 } else if (busqueda) {
     filteredUri += `/BySearch/${encodeURIComponent(busqueda)}`; 
 }

 // Realiza la solicitud de filtrado
 cargarNoticias(filteredUri, currentPage, pageSize);
}
//menu
 // Lista de categorías
 const categorias = [
    "Entretenimiento",
    "Economía",
    "Educación",
    "Deportes",
    "Tecnología",
    "Salud",
    "Historia",
    "Moda",
    "Cultura",
    "Gastronomía"
];

// Crear botones de categoría dinámicamente
const categoriasBar = document.getElementById("categorias-bar");
categorias.forEach(categoria => {
    const button = document.createElement("button");
    button.textContent = categoria;
    button.onclick = function() {
        filterByCategory(categoria);
    };
    categoriasBar.appendChild(button);
});

function filterByCategory(category) {
   
    document.getElementById("categoria").value = category; // Asignar la categoría al campo de entrada
    filterItems();
}
     function prevPage() {
         if (currentPage > 1) {
             currentPage--;
             cargarNoticias(apiUrl, currentPage, pageSize);
         }
     }

     function nextPage() {
         currentPage++;
         cargarNoticias(apiUrl, currentPage, pageSize);
     }

     // Cargar noticias al cargar la página
     $(document).ready(function () {
         cargarNoticias(apiUrl, currentPage, pageSize);
     });