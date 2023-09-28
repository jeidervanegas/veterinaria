//VARIABLES
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('.formulario');
const contenedorCitas = document.querySelector('.citas');

let editando;


//creamos un objeto para sosiarle los name  con las vairiables


const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''

}



//EVENTOS
eventListener();

function eventListener() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}


//CLASES
class Citas {
    constructor() {
        this.citas = [];
  
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita];

      

    }
    borrarCita(id) {
        const preguntar = confirm('¿Deseas eliminar esta cita?');

        if(preguntar) {
            this.citas = this.citas.filter(cita => cita.id !== id);
        }

        console.log(this.citas);
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        //creamos el div
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('div__error');
        divAlerta.textContent = mensaje;

        //validamos en funcion del tipo
        if(tipo === 'error') {
            divAlerta.classList.add('error');
        } else {
            divAlerta.classList.add('success')
        }

        document.querySelector('.row').insertBefore(divAlerta, document.querySelector('.div_error'));

        setTimeout(() => {
            divAlerta.remove();
        }, 2500)
    }
    imprimirCitas({citas}) {
        this.limpiarHtml();
        //iteramos
        citas.forEach( cita => {
            //desestructuramos para obtener cada variablke
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            //creamos el div
            const divCitas = document.createElement('div');
            divCitas.classList.add('citas');
            divCitas.dataset.id = id;

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('h2');
            mascotaParrafo.innerHTML = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.classList.add('p');
            propietarioParrafo.innerHTML = `
            <span class="span">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.classList.add('p');
            telefonoParrafo.innerHTML = `
            <span class="span">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.classList.add('p');
            fechaParrafo.innerHTML = `
            <span class="span">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.classList.add('p');
            horaParrafo.innerHTML = `
            <span class="span">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.classList.add('p');
            sintomasParrafo.innerHTML = `
            <span class="span">Síntomas: </span> ${sintomas}
            `;

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn__eliminar');
            btnBorrar.innerText = 'Borrar x';
            btnBorrar.onclick = () => {
                borrarCita(id)
            }

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn__editar');
            btnEditar.innerText = 'Editar';
            btnEditar.onclick = () => {
                editarCita(cita)
            }

            

            const divBotones = document.createElement('div');
            divBotones.classList.add('divBotones');
            divBotones.appendChild(btnBorrar);
            divBotones.appendChild(btnEditar);


            divCitas.appendChild(mascotaParrafo);
            divCitas.appendChild(propietarioParrafo);
            divCitas.appendChild(telefonoParrafo);
            divCitas.appendChild(fechaParrafo);
            divCitas.appendChild(horaParrafo);
            divCitas.appendChild(sintomasParrafo);
            divCitas.appendChild(divBotones);

            contenedorCitas.appendChild(divCitas);

        })
    }
    limpiarHtml() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

//instanciamos
const administrarCitas = new Citas();

const ui = new UI();


//FUNCIONES

function datosCita(e) {
    citaObj[e.target.name] = e.target.value;

    // console.log(citaObj);
}

function nuevaCita( e ) {
    e.preventDefault();

    //tenemos que desestructurar porque las bariables no son globales
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validamos
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios','error');
        return;
    }

    // ui.imprimirAlerta('Cita agregada correctamente');
    
    //vamos a impirmir en pantalla cada. para eso creamos un metodo para hacer un diplicado del areglo de citas. y tamnbien creamos un id
    formulario.reset();

    if(editando) {
        ui.imprimirAlerta('Cita editada correctamente');

        administrarCitas.editarCita({...citaObj});

        formulario.querySelector('button[type="submit"]').textContent = 'Crear citas';
        editando = false;
    } else {
        
        citaObj.id = Date.now();
        administrarCitas.agregarCita({...citaObj});

        ui.imprimirAlerta('Cita agregada correctamente');
    }


    reinicarCitaobj();

    ui.imprimirCitas(administrarCitas);

}

function reinicarCitaobj() {
    citaObj.mascota ='',
    citaObj.propietario ='',
    citaObj.telefono ='',
    citaObj.fecha ='',
    citaObj.hora ='',
    citaObj.sintomas =''

}

//borrar cita

function borrarCita(id) {
    administrarCitas.borrarCita(id);

    ui.imprimirAlerta('Cita eliminada');

    ui.imprimirCitas(administrarCitas);
    
}

//editar

function editarCita(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas; 

    citaObj.mascota = mascota,
    citaObj.propietario = propietario,
    citaObj.telefono = telefono,
    citaObj.fecha = fecha,
    citaObj.hora = hora,
    citaObj.sintomas = sintomas,
    citaObj.id = id,

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;

}