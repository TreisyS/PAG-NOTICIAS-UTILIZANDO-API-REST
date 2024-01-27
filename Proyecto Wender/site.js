const uri = 'https://localhost:7014/api/Noticias';
let currentPage = 1;
const pageSize = 10;

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        getItems(currentPage, pageSize);
    }
}

function nextPage() {
    currentPage++;
    getItems(currentPage, pageSize);
}
function getItems(page, pageSize) {
    const url = `${uri}?page=${page}&pageSize=${pageSize}`;
    fetchNews(url);
}

function displayNoticias(data) {
    const tbody = document.getElementById('noticias');
    tbody.innerHTML = '';
    _displayCount(data.length);

    // Verificar si la respuesta es un objeto y conviértelo a una matriz si es necesario
    const noticiasArray = Array.isArray(data) ? data : [data];
    let tdActions;
    noticiasArray.forEach(noticia => {
        let tr = tbody.insertRow();

        let tdId = tr.insertCell(0);
        tdId.appendChild(document.createTextNode(noticia.idNoticia));

        let tdTitulo = tr.insertCell(1);
        tdTitulo.appendChild(document.createTextNode(noticia.titulo));

        let tdPais = tr.insertCell(2);
        tdPais.appendChild(document.createTextNode(noticia.pais));

        let tdCategoria = tr.insertCell(3);
        tdCategoria.appendChild(document.createTextNode(noticia.categoria));

        let tdFecha = tr.insertCell(4);
        tdFecha.appendChild(document.createTextNode(noticia.fecha));

        let tdFuente = tr.insertCell(5);
        tdFuente.appendChild(document.createTextNode(noticia.fuente));

        let tdContenido = tr.insertCell(6);
        tdContenido.appendChild(document.createTextNode(noticia.contenido));

        let tdEnlace = tr.insertCell(7);
        tdEnlace.appendChild(document.createTextNode(noticia.enlace));

        let tdAutor = tr.insertCell(8);
        tdAutor.appendChild(document.createTextNode(noticia.autor));

      
       tdActions = tr.insertCell(9);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Eliminar';
        deleteButton.onclick = function () {
            deleteNoticia(noticia.idNoticia);
        };
        tdActions.appendChild(deleteButton);

        let editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.onclick = function () {
            showEditForm(noticia.idNoticia);
        };
        tdActions.appendChild(editButton);
    });
}


function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'noticia' : 'noticias';
    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

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
        filteredUri += `/BySearch/${busqueda}`;
    }

    // Realiza la solicitud de filtrado
    fetchNews(filteredUri);
}

function fetchNews(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(news => {
            displayNoticias(news);
        })
        .catch(error => {
            console.error(`Error fetching news: ${error.message}`);
            const content = document.getElementById('content'); 
            content.innerHTML = `<p>Error fetching news</p>`;
        });
        
}
function deleteNoticia(idNoticia) {
    const deleteUrl = `${uri}/${idNoticia}`;

    fetch(deleteUrl, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        
        getItems(currentPage, pageSize);
    })
    .catch(error => {
        console.error(`Error deleting noticia: ${error.message}`);
    });
}


//EDITAR
function showEditForm(idNoticia) {
    const editForm = document.getElementById('editForm');
    editForm.style.display = 'block';

    
    document.getElementById('editIdNoticia').value = idNoticia;

    const url = `${uri}/${idNoticia}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(newsItem => {
            document.getElementById('editTitulo').value = newsItem.titulo;
            document.getElementById('editPais').value = newsItem.pais;
            document.getElementById('editCategoria').value = newsItem.categoria;
            document.getElementById('editFecha').value = newsItem.fecha;
            document.getElementById('editFuente').value = newsItem.fuente;
            document.getElementById('editContenido').value = newsItem.contenido;
            document.getElementById('editEnlace').value = newsItem.enlace;
            document.getElementById('editAutor').value = newsItem.autor;
        })
        .catch(error => {
            console.error(`Error fetching news details: ${error.message}`);
        });
}


// Guardar Cambios
function saveEditedNoticia() {
    const idNoticia = document.getElementById('editIdNoticia').value;

    
    const editedData = {
        idNoticia: parseInt(idNoticia), 
        titulo: document.getElementById('editTitulo').value,
        pais: document.getElementById('editPais').value,
        categoria: document.getElementById('editCategoria').value,
        fecha: document.getElementById('editFecha').value,
        fuente: document.getElementById('editFuente').value,
        contenido: document.getElementById('editContenido').value,
        enlace: document.getElementById('editEnlace').value,
        autor: document.getElementById('editAutor').value,
    };

    // Client-side validacion
    if (!editedData.titulo || !editedData.pais || !editedData.categoria) {
        console.error('Llena todos campos, por favor');
        return;
    }

    // Llamando API endpoint para guardar la noticia
    const saveUrl = `${uri}/${idNoticia}`;
    fetch(saveUrl, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

       
        getItems(currentPage, pageSize);
       
        cancelEdit();
    })
    .catch(error => {
        console.error(`Error saving edited noticia: ${error.message}`);
    });
}


function cancelEdit() {
   
    const editForm = document.getElementById('editForm');
    editForm.style.display = 'none';
}
//GUARDAR
function saveCreatedNoticia() {
    const createdData = {
        titulo: document.getElementById('createTitulo').value,
        pais: document.getElementById('createPais').value,
        categoria: document.getElementById('createCategoria').value,
        fecha: document.getElementById('createFecha').value,
        fuente: document.getElementById('createFuente').value,
        contenido: document.getElementById('createContenido').value,
        enlace: document.getElementById('createEnlace').value,
        autor: document.getElementById('createAutor').value,
    };

    // Client-side validación
    if (!createdData.titulo || !createdData.pais || !createdData.categoria) {
        console.error('Llena todos los campos, por favor');
        return;
    }

    //llamando la api para guardar
    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(createdData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        
        getItems(currentPage, pageSize);
   
        cancelCreate();
    })
    .catch(error => {
        console.error(`Error adding new noticia: ${error.message}`);
    });
}

function cancelCreate() {
    const createForm = document.getElementById('createForm');
    createForm.style.display = 'none';
}
// Mostrar el formulario de creación
function showCreateForm() {
    
    document.getElementById('editForm').style.display = 'none';

    
    document.getElementById('createForm').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    getItems(currentPage, pageSize);
});


    





