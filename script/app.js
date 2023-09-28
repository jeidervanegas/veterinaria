//Variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('.formulario');
const contenedorCitas = document.querySelector('.citas');

let editando;

//creamos un objeto para relacionarlo con los name de cada input
const citaObj ={
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas:''
}
//eventos
eventListener();
function eventListener() {
    mascotaInput.addEventListener('input', nuevaCita);
    propietarioInput.addEventListener('input', nuevaCita);
    telefonoInput.addEventListener('input', nuevaCita);
    fechaInput.addEventListener('input', nuevaCita);
    horaInput.addEventListener('input', nuevaCita);
    sintomasInput.addEventListener('input', nuevaCita);

    formulario.addEventListener('submit', agregarCita);
}

//clases
class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCita(cita) {
        this.citas =[...this.citas, cita];

        // console.log(this.citas)
    }
    eliminarCita(id) {
        const preguntar = confirm('¿Deseas eliminar a este paciente?');

        if(preguntar) {
            this.citas = this.citas.filter(cita => cita.id !== id);
        }
    }
    editarCita(citaActual){
        this.citas = this.citas.map(cita => cita.id === citaActual.id ? citaActual :  cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        //creamos el div
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('div__error');
        divAlerta.textContent = mensaje;

        //validamos en funcion del tipo
        if(tipo === 'error') {
            divAlerta.classList.add('error')
        } else {
            divAlerta.classList.add('success');
        }

        document.querySelector('.row').insertBefore(divAlerta, document.querySelector('.div_error'));

        setTimeout(() => {
            divAlerta.remove();
        }, 3000);
    }
    imprimirCitas({citas}) {
        this.limpirCitas();
        //iteramos
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('DIV');
            divCita.classList.add('citas');
            divCita.dataset.id = id;

            

            const mascotaParrafo = document.createElement('H2');
            mascotaParrafo.classList.add('h2');
            mascotaParrafo.innerText=mascota;

            const propietarioParrafo = document.createElement('P');
            propietarioParrafo.classList.add('p');
            propietarioParrafo.innerHTML = `
                <span class="span">Propietario: </span>${propietario}
            `;

            const telefonoParrafo = document.createElement('P');
            telefonoParrafo.classList.add('p');
            telefonoParrafo.innerHTML = `
                <span class="span">Telefono: </span>${telefono}
            `;

            const fechaParrafo = document.createElement('P');
            fechaParrafo.classList.add('p');
            fechaParrafo.innerHTML = `
                <span class="span">Fecha: </span>${fecha}
            `;

            const horaParrafo = document.createElement('P');
            horaParrafo.classList.add('p');
            horaParrafo.innerHTML = `
                <span class="span">Hora: </span>${hora}
            `;

            const sintomasParrafo = document.createElement('P');
            sintomasParrafo.classList.add('p');
            sintomasParrafo.innerHTML = `
                <span class="span">Síntomas: </span>${sintomas}
            `;

            ///////

            const divBotones = document.createElement('DIV');
            divBotones.classList.add('divBotones');
            // divCita.dataset.id = id;

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn__eliminar');
            btnBorrar.innerText = 'Eliminar x';
            btnBorrar.onclick = () => {
                eliminarCita(id);
            }

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn__editar');
            btnEditar.innerText = 'Editar x';
            btnEditar.onclick = () => {
                editarCita(cita);
            }

            divBotones.appendChild(btnBorrar);
            divBotones.appendChild(btnEditar)

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(divBotones);


            contenedorCitas.appendChild(divCita);

        });
    }
    limpirCitas() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }

}

//instanciamos
const administrarCitas = new Citas();
const ui = new UI();


//funciones

function nuevaCita(e) {
    citaObj[e.target.name] = e.target.value;

    // console.log(citaObj)
}

//formulario

function agregarCita(e) {
    e.preventDefault();

    //desestructuramos la info del citaObj
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj

    //validamos
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios','error')
        return;
    }

        if(editando) {
            ui.imprimirAlerta('Cita editada correctamente');

            administrarCitas.editarCita({...citaObj});

            formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

            editando = false;
            

        }else {
            //impriminos en el html la cita OJO se le agrega u  ind a las citaobj
            citaObj.id = Date.now();
            administrarCitas.agregarCita({...citaObj});

            ui.imprimirAlerta('Cita agregada correctamente');
        }

        formulario.reset();

        
        reinicarOjeto();

        ui.imprimirCitas(administrarCitas);

}

function reinicarOjeto() {
    citaObj.mascota = '',
    citaObj.propietario = '',
    citaObj.telefono = '',
    citaObj.fecha = '',
    citaObj.hora = '',
    citaObj.sintomas = ''
}

//eliminar cita

function eliminarCita(id) {
    administrarCitas.eliminarCita(id);

    ui.imprimirAlerta('Cita eliminada correctamente');

    ui.imprimirCitas(administrarCitas);

}

//editar cita

function editarCita(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    //llenamos los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenamos de nuevo el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}