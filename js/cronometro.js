let inicio = 0;
let timeout = 0;

const empezarDetener = (stop) => {
    if (!stop) {
        // Obtenemos el valor actual
        inicio = vuelta = new Date().getTime();

        // iniciamos el proceso
        funcionando();
    } else {
        // detemer el cronometro
        clearTimeout(timeout);
        timeout = 0;
    }
};

const funcionando = () => {
    // obteneos la fecha actual
    let actual = new Date().getTime();

    // obtenemos la diferencia entre la fecha actual y la de inicio
    let diff = new Date(actual - inicio);

    // mostramos la diferencia entre la fecha actual y la inicial
    let result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    document.getElementById('crono').innerHTML = result;

    // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
    timeout = setTimeout("funcionando()", 1000);
};

/* Funcion que pone un 0 delante de un valor si es necesario */
const LeadingZero = (Time) => {
    return (Time < 10) ? "0" + Time : +Time;
};