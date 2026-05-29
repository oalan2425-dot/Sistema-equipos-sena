
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
let tabla;
const error = document.getElementById("error");
const mensaje = document.getElementById("mensaje");
const seccionAdmin = document.getElementById("seccionAdmin");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const infoPagina = document.getElementById("infoPagina");

let paginaActual = 1;
const registrosPorPagina = 20;

formLogin.addEventListener("submit", function(e) {

    e.preventDefault();

    error.textContent = "";

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    fetch("/login", {

        method: "POST",

        headers: {
            "content-type": "application/json"
        },

        body: JSON.stringify({
            usuario,
            password
        })
    })

    .then(res => res.json())

    .then(data => {
        if(data.success) {
            
            error.textContent = "";

            sessionStorage.setItem("login", "true");
            mostrarAdmin();

        } else {

            error.textContent = data.mensaje;

            setTimeout(() => {
                error.textContent = "";
            },3000);
        }
    })

    .catch(error => {

        console.log(error);

        error.textContent = "error del servidor";
    });
});

formRegistro.addEventListener("submit", function(e) {
    e.preventDefault();

    const registro = {
        nombre: document.getElementById("nombre").value,
        jornada: document.getElementById("jornada").value,
        formacion: document.getElementById("formacion").value,
        ficha: document.getElementById("ficha").value,
        tipoequipo: document.getElementById("tipoequipo").value,
        equipo: document.getElementById("equipo").value,
        mouse: document.getElementById("mouse").value,
        serialmouse: document.getElementById("serialmouse").value,
        cargador: document.getElementById("cargador").value,
        serialcargador: document.getElementById("serialcargador").value,
        teclado: document.getElementById("teclado").value,
        serialteclado: document.getElementById("serialteclado").value,
        fecha: document.getElementById("fecha").value,
        inicio: document.getElementById("inicio").value,
        fin: document.getElementById("fin").value,
        estado: document.getElementById("estado").value,
        observaciones: document.getElementById("observaciones").value
    };

  const editandoId = formRegistro.dataset.editando;

const url = editandoId
    ? `/editar-registro/${editandoId}`
    : "/guardar-registro";

const metodo = editandoId
    ? "PUT"
    : "POST";

fetch(url, {

    method: metodo,

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(registro)
})
    .then(res => res.json())
    .then(data => {

        console.log(data);

        mensaje.textContent = data.mensaje;

        formRegistro.reset();
        delete formRegistro.dataset.editando;
        aplicarFiltros();

        setTimeout(() => {
            mensaje.textContent = "";
        }, 3000);
    })
    .catch(error => {
        console.log(error);

        mensaje.textContent = "Error al guardar";
    });

    mensaje.textContent = "Se ha guardado el registro correctamente";

    formRegistro.reset();
    aplicarFiltros();
    
mensaje.textContent = "Se ha guardado el registro correctamente";
setTimeout(() => {
    mensaje.textContent = "";
}, 3000);

});


function mostrarRegistros() {

    if (!tabla) return;

    fetch("/obtener-registros")

    .then(res => res.json())

    .then(datos => {

        if (datos.length === 0) {
        tabla.innerHTML =
         "<tr><td colspan= '18'>No hay registros</td></tr>";
        return;
    }

       tabla.innerHTML = "";

        datos.forEach(r => {

        tabla.innerHTML += `
        <tr>
            <td>${r.nombre}</td>
            <td>${r.jornada}</td>
            <td>${r.formacion}</td>
            <td>${r.ficha}</td>
            <td>${r.tipoequipo}</td>
            <td>${r.equipo}</td>
            <td>${r.mouse}</td>
            <td>${r.serialmouse}</td>
            <td>${r.cargador}</td>
            <td>${r.serialcargador}</td>
            <td>${r.teclado}</td>
            <td>${r.serialteclado}</td>
            <td>${new Date(r.fecha).toLocaleDateString("es-CO")}</td>
            <td>${r.inicio}</td>
            <td>${r.fin}</td>
            <td>${r.estado}</td>
            <td>${r.observaciones}</td>
        </tr>
        `;
    });  

})

   .catch(error => {
       console.log(error);
   });   
}

function logout() {
    sessionStorage.removeItem("login");
    location.reload();
}

if (sessionStorage.getItem("login") === "true") {
    mostrarAdmin();
}

function mostrarAdmin() {

    seccionAdmin.style.display = "block";
    formLogin.style.display = "none";
    formRegistro.style.display = "none";

    tabla = document.querySelector("#tabla tbody");

    cargarOpciones();
    aplicarFiltros();
}

// Mouse

const mouseSelect = document.getElementById("mouse");
const serialMouse = document.getElementById("serialmouse");

mouseSelect.addEventListener("change", function() {
    if (mouseSelect.value === "No") {
        serialMouse.disabled = true;
        serialMouse.value = "";
    } else {
        serialMouse.disabled = false;
    }
});

// Cargador

const cargadorSelect = document.getElementById("cargador");
const serialCargador = document.getElementById("serialcargador");

cargadorSelect.addEventListener("change", function() {
    if  (cargadorSelect.value === "No") {
        serialCargador.disabled = true;
        serialCargador.value = "";
    } else {
        serialCargador.disabled = false;
    }   
});

// Teclado

const tecladoSelect = document.getElementById("teclado");
const serialTeclado = document.getElementById("serialteclado");

tecladoSelect.addEventListener("change", function(){
    if (tecladoSelect.value === "No") {
        serialTeclado.disabled = true;
        serialTeclado.value = "";
    } else {
        serialTeclado.disabled = false;
    }
});

// Estado inicial

mouseSelect.dispatchEvent(new Event("change"));
cargadorSelect.dispatchEvent(new Event("change"));
tecladoSelect.dispatchEvent(new Event("change"));

// Seleccion de jornada y formación

const jornadaSelect = document.getElementById("jornada");
const formacionSelect = document.getElementById("formacion");

const formaciones = {
    mañana: [
        {value: "ADSO", text: "Analisis y Desarrollo de Software"},
        {value: "COSIG", text: "Coordinación de Sistemas Integrados y de Gestión"},
        {value: "MER", text: "Mercadeo"},
    ],
    tarde: [
        {value: "G.C", text: "Gestión Contable"},
        {value: "SOLD", text: "Soldadura"},
        {value: "R.N", text: "Recursos Naturales"},
        {value: "ADSO", text: "Analisis y Desarrollo de Software"},
    ],
    noche: [
        {value: "COSIG", text: "Coordinación de Sistemas Integrados y de Gestión"},
        {value: "A.D.S", text: "Administracion"},
        {value: "G.C", text: "Gestión Contable"},
        {value: "MET", text: "Metalmecanica"},
    ]
};

// Evento cuando cambia la jornada
formacionSelect.disabled = true;

jornadaSelect.addEventListener("change", function(){
    const jornada = jornadaSelect.value;
    
    formacionSelect.innerHTML =  '<option value="">Seleccione una formación</option>';

    if (!formaciones[jornada]) return;

    formaciones[jornada].forEach(f => {
        const option = document.createElement("option");
        option.value = f.value;
        option.textContent = f.text;
        formacionSelect.appendChild(option);
    });
    formacionSelect.disabled = false;
});
formacionSelect.disabled = true;
jornadaSelect.addEventListener("change", function(){
    formacionSelect.disabled = false;
});

//Seleccion de ficha

const fichaSelect= document.getElementById("ficha");

const fichas = {
    mañana: [ "3311373","3177248","3411843" ],
    tarde: [ "3226734", "3311393", "3311390", "3411832"],
    noche: [ "3226710", "3286828", "3226736", "3411816"],
};

fichaSelect.disabled = true;

// Evento cuando cambia la ficha 
jornadaSelect.addEventListener("change", function(){
    const jornada = jornadaSelect.value;

    fichaSelect.innerHTML =  '<option value="">Seleccione una ficha</option>';

    if(!fichas[jornada]) return;

    fichas[jornada].forEach(num => {
        const option = document.createElement("option");
        option.value = num;
        option.textContent = num;
        fichaSelect.appendChild(option);
    });
    fichaSelect.disabled = false;
});

//Crear filtros: llamando id de index.html
const filtroNombre = document.getElementById("filtroNombre");
const filtroJornada = document.getElementById("filtroJornada");
const filtroEstado = document.getElementById("filtroEstado");
const filtroFecha = document.getElementById("filtroFecha");
const filtroTipo = document.getElementById("filtroTipo");
const filtroFicha = document.getElementById("filtroFicha");
const filtroFormacion = document.getElementById("filtroFormacion");

// Escuchar cambios en los filtros
filtroNombre.addEventListener("input", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroJornada.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroEstado.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroFecha.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroTipo.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroFicha.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});
filtroFormacion.addEventListener("change", () => {
    paginaActual = 1;
    aplicarFiltros();
});

function aplicarFiltros() {

    fetch("/obtener-registros")
    .then(res => res.json())

    .then(datos => {

         const nombre = filtroNombre.value.toLowerCase();
    const jornada = filtroJornada.value;
    const estado = filtroEstado.value;
    const fecha = filtroFecha.value;
    const tipo = filtroTipo.value;
    const ficha = filtroFicha.value;
    const formacion = filtroFormacion.value;

    const filtrados = datos.filter(r => {
        return (
            (!nombre || (r.nombre && r.nombre.toLowerCase().includes(nombre))) &&
            (!jornada || r.jornada === jornada) &&
            (!estado || r.estado === estado) &&
            (!fecha || r.fecha === fecha) &&
            (!tipo || r.tipoequipo === tipo) &&
            (!ficha || r.ficha === ficha) &&
            (!formacion || r.formacion === formacion)
        );
    });

    actualizarDashboard(filtrados);
    
    mostrarRegistrosFiltrados(filtrados);

    })

    .catch(error => {
        console.log(error);
    });
}

function mostrarRegistrosFiltrados(lista) {

    const tablaBody = document.querySelector("#tabla tbody");

        if (!tablaBody) {
        console.error("No se encontró el tbody de la tabla");
        return;
        }

        tablaBody.innerHTML = "";

    if (lista.length === 0) {

        tablaBody.innerHTML = 
        "<tr><td colspan=  '18 '>No hay registros</td></tr>";

        infoPagina.textContent = "Pagina 0 de 0";
    return;
}
 // Calcular páginas
    const totalPaginas =
    Math.ceil(lista.length / registrosPorPagina);

    // Evitar páginas inválidas
    if (paginaActual > totalPaginas) {
        paginaActual = totalPaginas;
    }

    if(paginaActual < 1) {
        paginaActual = 1;
    }

const inicio =
    (paginaActual - 1) * registrosPorPagina;

    const fin =
    inicio + registrosPorPagina;

    const registrosPagina =
    lista.slice(inicio, fin);

    registrosPagina.forEach(r => {

    tablaBody.innerHTML += `
    <tr>
        <td>${r.nombre}</td>
        <td>${r.jornada}</td>
        <td>${r.formacion}</td>
        <td>${r.ficha}</td>
        <td>${r.tipoequipo}</td>
        <td>${r.equipo}</td>
        <td>${r.mouse}</td>
        <td>${r.serialmouse || "-"}</td>
        <td>${r.cargador}</td>
        <td>${r.serialcargador || "-"}</td>
        <td>${r.teclado}</td>
        <td>${r.serialteclado || "-"}</td>
         <td>${new Date(r.fecha).toLocaleDateString("es-CO")}</td>
        <td>${r.inicio}</td>
        <td>${r.fin}</td>
        <td>${r.estado}</td>
        <td>${r.observaciones || "-"}</td>  
        <td>

            <button onclick= "eliminarRegistro(${r.id})">Eliminar</button>

        </td>
    </tr>
     `;
});
infoPagina.textContent =
    `Página ${paginaActual} de ${totalPaginas}`;

    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

if(btnAnterior) {
btnAnterior.addEventListener("click", ()=>{

    if(paginaActual > 1) {
        paginaActual--;
        aplicarFiltros();
    }
});

btnSiguiente.addEventListener("click", ()=> {

    fetch("/obtener-registros")

    .then(res => res.json())

    .then(datos => {

    const totalPaginas=
    Math.ceil(datos.length / registrosPorPagina);

    if(paginaActual < totalPaginas) {
        paginaActual++;
        aplicarFiltros();
        }
    });

});

}

function limpiarFiltros() {
    filtroNombre.value = "";
    filtroJornada.value = "";
    filtroEstado.value = "";
    filtroFecha.value = "";
    filtroTipo.value = "";
    filtroFicha.value = "";
    filtroFormacion.value = "";

    aplicarFiltros();
}
function cargarOpciones() {

    fetch("/obtener-registros")
    .then(res => res.json())

    .then(datos => {

    const fichas = [...new Set(datos.map(r => r.ficha))];
    const formaciones = [...new Set(datos.map(r => r.formacion))];
    
    filtroFicha.innerHTML =
     '<option value="">Todas las fichas</option>';

    filtroFormacion.innerHTML = 
    '<option value="">Todas las formaciones</option>';

    fichas.forEach(f=> {
        filtroFicha.innerHTML +=
         `<option value="${f}">${f}</option>`;
    }); 

    formaciones.forEach(f => {
        filtroFormacion.innerHTML += 
        `<option value="${f}">${f}</option>`;
    });

    })

    .catch(error => {
        console.log(error);
    });

}


function eliminarRegistro(id) {

    if(!confirm("¿Deseas eliminar este registro?")) {
        return;
    }

    fetch(`/eliminar-registro/${id}`, {
        method: "DELETE"
    })

    .then(res => res.json())

    .then(data => {

        alert(data.mensaje);

        aplicarFiltros();
    })

    .catch(error => {

        console.log(error);

        alert("Error al eliminar");
    });
}

// Exportar a Excel
function exportarExcelXLSX() {

    fetch("/obtener-registros")
    .then(res => res.json())
    
    .then(datos => {

    const nombre = filtroNombre.value.toLowerCase();
    const jornada = filtroJornada.value;
    const estado = filtroEstado.value;
    const fecha = filtroFecha.value;
    const tipo = filtroTipo.value;
    const ficha = filtroFicha.value;
    const formacion = filtroFormacion.value;

    const filtrados = datos.filter (r => {
        return (
            (!nombre || (r.nombre && r.nombre.toLowerCase().includes(nombre))) &&
            (!jornada || r.jornada === jornada) &&
            (!estado || r.estado === estado) &&
            (!fecha || r.fecha === fecha) &&
            (!tipo || r.tipoequipo === tipo) &&
            (!ficha || r.ficha === ficha) &&
            (!formacion || r.formacion === formacion)
        );
    });

    if (filtrados.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    
    //Conversion de datos
    const datosExcel = filtrados.map(r => ({

        "Nombre": r.nombre,
        "Jornada": r.jornada,
        "Formación": r.formacion,
        "Ficha": r.ficha,
        "Tipo de equipo": r.tipoequipo,
        "Serial del equipo": r.equipo,
        "Mouse": r.mouse,
        "Serial del mouse": r.serialmouse || "",
        "Cargador": r.cargador,
        "Serial del cargador": r.serialcargador || "",
        "Teclado": r.teclado,
        "Serial del teclado": r.serialteclado || "",
        "Fecha": r.fecha,
        "Hora inicio": r.inicio,
        "Hora fin": r.fin,
        "Estado del equipo": r.estado,
        "Observaciones": r.observaciones || "",
    }));

    //Crear hoja de excel
    const hoja = XLSX.utils.json_to_sheet(datosExcel);

    //Crear libro
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "registros");

    //Descargar archivo
    XLSX.writeFile(libro, "registros_equipos.xlsx");

    })

    .catch(error => {
        console.log(error);
    });
}

function actualizarDashboard(datos){

    const statTotal = document.getElementById("statTotal");
    const statBuenos = document.getElementById("statBuenos");
    const statDanados = document.getElementById("statDanados");

    if(statTotal){
        statTotal.textContent = datos.length;
    }

    const buenos = datos.filter(r =>
        r.estado &&
        r.estado.toLowerCase().includes("bueno")
    ).length;

    if(statBuenos){
        statBuenos.textContent = buenos;
    }

    const danados = datos.filter(r =>
        r.estado &&
        (
            r.estado.toLowerCase().includes("malo") ||
            r.estado.toLowerCase().includes("mantenimiento")
        )
    ).length;

    if(statDanados){
        statDanados.textContent = danados;
    }
}