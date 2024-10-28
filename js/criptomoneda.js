//identificar que selectores que vamos a utilizar
//crear selctores

const moneda = document.querySelector('#moneda');
const selectCripto =  document.querySelector('#criptomonedas');
const formulario =  document.querySelector('#formulario');
const resultado =  document.querySelector('#resultado');

//crear una estructura para poder guardar

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//evento

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCripto();

    moneda.addEventListener('input',obtenerValores)
    selectCripto.addEventListener('change',obtenerValores)
    formulario.addEventListener('submit',cotizar)
})

const obtenerCripto = criptomoneda => new Promise(resolve=>{
    resolve(criptomoneda);
}) //el promise es un objeto, tiene 3 estados (pendiente(operacion inicial que ni ha sido cumplida o rechazada), cumplida (exito en la operacion) y rechazada (fallo))
//varias peticiones en parelo


function consultarCripto(){
    //url toplist del market cap API
    const url = ' https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta=>respuesta.json())//la cosnulta fue exitosa
        .then(resultado => obtenerCripto(resultado.Data))
        .then(criptomonedas => selectCriptmonedas(criptomonedas))
        .catch(error=>console.log(error))
}

function obtenerValores(e){
    //console.log(e.target.value) estaba en name, pero como quiero el valor, es value
    objBusqueda[e.target.name] = e.target.value; //forma general
    console.log(objBusqueda)

}

function selectCriptmonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name,FullName}=cripto.CoinInfo;
        const option = document.createElement('option');

        option.textContent = FullName;
        option.value = Name;
        //insertar en el html

        selectCripto.appendChild(option)
    });
}

function cotizar(e){
    e.preventDefault(); //esto se colca porque es un boton que esta dentro del formulario

    //consultar valore sobjetos guardadps en el objeto
    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        //validar que los campos no sean vacios
        //console.log('Los campos son obligatorios')
       mostrarError('Los campos son obligatorios')
    }

    consultarAPI();
}

//esta funcion de mostrar error la podemos reutilizar porque esta global
function mostrarError(mensaje){
    
        const alertaM = document.createElement('div')
        alertaM.classList.add('error')

        //mostrar msh de error
        alertaM.innerHTML = `<strong>${mensaje}</strong>`
        //insertar en el HTML
        formulario.appendChild(alertaM)
 
        //bloque error va a desaparecer
         setTimeout(()=>{
            alertaM.remove();
        },2000)
    }

function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda
    //url la estoy selccionando de multiplies symbol full data

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
   
spinnerr();


    fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizar=>{
        mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda])
    })
}

function mostrarResultado(cotizacion){
    
    limpiarHTML();

    const {CHANGEPCT24HOUR,PRICE,HIGHDAY,LOWDAY, LASTUPDATE} = cotizacion

    const ult24horas = document.createElement('p');
    ult24horas.innerHTML = `<p> Variacion ultimas 24 horas: ${CHANGEPCT24HOUR}</p>`

    const precio = document.createElement('p');
    precio.innerHTML = `<p> El precio es: ${PRICE}</p>`

    const precioalto = document.createElement('p');
    precioalto.innerHTML = `<p> El precio mas alto del dia es: ${HIGHDAY}</p>`

    const preciobajo = document.createElement('p');
    preciobajo.innerHTML = `<p> El precio bajo del dia es: ${LOWDAY}</p>`

    const actualizacion = document.createElement('p');
    actualizacion.innerHTML = `<p> La ultima actualizacion es: ${LASTUPDATE}</p>`

    resultado.appendChild(ult24horas);
    resultado.appendChild(precio);
    resultado.appendChild(precioalto);
    resultado.appendChild(preciobajo);
    resultado.appendChild(actualizacion);

    formulario.appendChild(resultado)
}
   
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }

}


function spinnerr(){
    limpiarHTML();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `
    resultado.appendChild(divSpinner);
}