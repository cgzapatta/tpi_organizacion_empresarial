let empleados = [];
// Guardamos acá la lista de empleados que vamos a cargar desde el archivo CSV

let estado = "LEGAJO";
// Esta variable indica en qué parte del proceso se encuentra el usuario

let emp = null;
// Acá guardamos los datos del empleado encontrado

let fecha = "";
let dias = "";
// Guardamos la fecha y la cantidad de días solicitados por el usuario

let modificando = false;
// Indica si el usuario está modificando unas vacaciones ya existentes



fetch("empleados.csv")
.then(r => r.text())
.then(t => {
    // En esta parte leemos el archivo CSV con los datos de empleados

    const filas = t.trim().split("\n");
    // Separamos cada línea del archivo para poder leer los empleados

    const headers = filas[0].split(",");
    // Tomamos los nombres de las columnas del archivo


    for(let i=1;i<filas.length;i++){
        // Recorremos cada empleado del archivo

        const valores = filas[i].split(",");

        let obj={};
        // Creamos un objeto con la información de cada empleado

        headers.forEach((h,j)=>{
            // Asociamos cada dato con su nombre de columna

            obj[h.trim()] = valores[j]?.trim();

        });


        empleados.push(obj);
        // Guardamos el empleado dentro de la lista general

    }


    add(
        "¡Hola! 😊 Soy el asistente de RRHH.\n\nPara comenzar con la gestión de vacaciones, por favor ingrese su número de legajo.",
        "bot"
    );


});



const estados = {
    // Definimos todos los pasos posibles del proceso

    LEGAJO:"Esperando legajo",

    VAC_EXISTENTE:"Verificando vacaciones existentes",

    FECHA:"Esperando fecha de inicio",

    DIAS:"Esperando cantidad de días",

    RRHH:"Esperando respuesta de RRHH",

    CONF:"Esperando confirmación",

    FINAL:"Proceso finalizado"

};





function draw(){
    // Esta función muestra visualmente el estado actual del proceso

    states.innerHTML="";


    let actual = estados[estado];


    Object.values(estados).forEach(e=>{


        let div=document.createElement("div");


        if(e===actual){

            div.className="current";

            div.textContent="➜ "+e;


        }else{


            div.className="todo";

            div.textContent="○ "+e;

        }


        states.appendChild(div);


    });


}




draw();
// Mostramos el estado inicial del sistema





function add(text, clase){


    let d=document.createElement("div");


    d.className="msg "+clase;


    d.textContent=text;


    chat.appendChild(d);


    chat.scrollTop=chat.scrollHeight;


}





function mostrarEmpleado(){
    // Esta función muestra la información del empleado encontrado


    if(!emp){
        // Si no hay empleado mostramos que no está identificado

        document.getElementById("emp").innerHTML="Sin identificar";

        return;

    }



    document.getElementById("emp").innerHTML=

    `
    <b>${emp.nombre} ${emp.apellido}</b><br>

    Legajo: ${emp.legajo}<br>

    Puesto: ${emp.puesto}<br>

    Saldo: ${emp.saldo_dias} días<br>

    Estado: ${emp.estado}<br>

    Vacaciones:
    ${emp.vacaciones_programadas || "No asignadas"}

    `;


}





function validarFecha(f){
    // Esta función controla que la fecha ingresada sea correcta


    let partes=f.split("-");


    if(partes.length!==3)
        return false;



    let dia=parseInt(partes[0]);

    let mes=parseInt(partes[1]);

    let anio=parseInt(partes[2]);



    let fechaReal=new Date(anio,mes-1,dia);



    return (

        fechaReal.getDate()===dia &&
        fechaReal.getMonth()===mes-1 &&
        fechaReal.getFullYear()===anio

    );


}





function reiniciar(){
    // Esta función vuelve el chatbot al inicio del proceso


    estado="LEGAJO";

    emp=null;

    fecha="";

    dias="";

    modificando=false;



    mostrarEmpleado();


    op.textContent="-";


    draw();



    add(

    "Proceso reiniciado correctamente.\n\nIngrese nuevamente su número de legajo.",

    "bot"

    );


}








function enviarRRHH(callback){

    // En esta función simulamos el envío de la solicitud al área de RRHH

    estado="RRHH";

    draw();



    add(

    "La solicitud requiere validación de RRHH.\n\nEstoy enviando la información para su revisión.\n\nEspere mientras recibimos una respuesta...",

    "bot"

    );



    setTimeout(()=>{

        // Simulamos una espera hasta recibir la respuesta de RRHH

        add(

        "RRHH aprobó la solicitud correctamente.",

        "bot"

        );


        callback();

        // Luego de la respuesta continuamos con el siguiente paso del proceso


    },5000);



}







function send(){

    // Esta función procesa todo lo que escribe el usuario en el chat


    let texto=txt.value.trim();



    if(!texto)
        return;



    add(texto,"user");



    txt.value="";



    let l=texto.toLowerCase();





    // siempre permite reiniciar

    if(l==="reiniciar"){

        reiniciar();

        return;

    }






    // si terminó, bloquea todo

    if(estado==="FINAL"){


        add(

        "El proceso ya finalizó.\n\nEscriba REINICIAR si desea realizar nuevamente el trámite.",

        "bot"

        );


        return;


    }






    // saludos

    if(
        l==="hola" ||
        l==="buen dia" ||
        l==="buenos dias" ||
        l==="buenas tardes" ||
        l==="buenas noches"
    ){


        add(

        "¡Hola! 😊 Soy el asistente de RRHH.\nEstoy aquí para ayudarte con tu solicitud de vacaciones.",

        "bot"

        );


        return;


    }






    if(l==="estado"){


        add(

        "El estado actual es: "+estados[estado],

        "bot"

        );


        return;

    }







    if(estado==="LEGAJO"){



        emp=empleados.find(

            e=>e.legajo===texto

        );



        if(!emp){


            add(

            "El legajo ingresado no es correcto.\nPor favor vuelva a ingresarlo para continuar.",

            "bot"

            );


            return;

        }



        mostrarEmpleado();


add(

`Encontré sus datos en el sistema:

Nombre: ${emp.nombre} ${emp.apellido}

Legajo: ${emp.legajo}

Puesto: ${emp.puesto}

Saldo disponible: ${emp.saldo_dias} días

Estado: ${emp.estado}

Vacaciones programadas: ${emp.vacaciones_programadas || "No asignadas"}`,

"bot"

);





        if(emp.vacaciones_programadas){


            estado="VAC_EXISTENTE";

            draw();



            add(

            `Veo que usted ya tiene vacaciones programadas para comenzar el día ${emp.vacaciones_programadas}.

¿Desea modificarlas? Responda SI o NO.`,

            "bot"

            );



        }else{


            estado="FECHA";

            draw();



            add(

            "Perfecto, vamos a gestionar su solicitud de vacaciones.\n\nIngrese la fecha de inicio.\n\nFormato:\nDD-MM-AAAA\n\nEjemplo:\n15-05-2026",

            "bot"

            );


        }


        return;


    }







    if(estado==="VAC_EXISTENTE"){


        if(l==="si"){


            modificando=true;


            enviarRRHH(()=>{


                estado="FECHA";

                draw();



                add(

                "Puede ingresar la nueva fecha de inicio.\n\nFormato:\nDD-MM-AAAA",

                "bot"

                );


            });



        }


        else if(l==="no"){



            estado="FINAL";

            draw();



            add(

            "Perfecto. Mantendremos sus vacaciones actuales para la fecha "+emp.vacaciones_programadas+".",

            "bot"

            );


        }


        else{


            add(

            "Por favor responda SI o NO.",

            "bot"

            );

        }


        return;

    }







    if(estado==="FECHA"){


        if(!validarFecha(texto)){


            add(

            "La fecha ingresada no es válida.\nPor favor utilice el formato DD-MM-AAAA.",

            "bot"

            );


            return;


        }



        fecha=texto;


        estado="DIAS";


        draw();



        add(

        "Perfecto. ¿Cuántos días de vacaciones desea solicitar?",

        "bot"

        );



        return;


    }







    if(estado==="DIAS"){



        let cantidad=parseInt(texto);



        if(isNaN(cantidad) || cantidad<=0){


            add(

            "Por favor ingrese una cantidad de días válida.",

            "bot"

            );


            return;

        }





        if(cantidad>parseInt(emp.saldo_dias)){



            add(

            "La cantidad solicitada supera su saldo disponible de vacaciones.",

            "bot"

            );


            return;


        }



        dias=cantidad;





        if(dias>15){


            enviarRRHH(()=>{


                estado="CONF";

                draw();



                add(

                `Resumen de solicitud:

Fecha: ${fecha}

Días solicitados: ${dias}

¿Confirma la solicitud? SI/NO`,

                "bot"

                );


            });


            return;


        }






        estado="CONF";


        draw();



        add(

        `Resumen de solicitud:

Fecha: ${fecha}

Días solicitados: ${dias}

¿Confirma la solicitud? SI/NO`,

        "bot"

        );



        return;


    }







    if(estado==="CONF"){



        if(l==="si"){



            estado="FINAL";


            draw();




            let nro=

            "VAC-2026-"+

            Math.floor(Math.random()*90000+10000);




            op.textContent=nro;





            add(

            `Solicitud registrada correctamente.

Número de operación: ${nro}

También se informó a RRHH que usted aceptó sus vacaciones.

Muchas gracias ${emp.nombre}. 😊

Disfrute sus vacaciones.`,

            "bot"

            );



        }


        else if(l==="no"){


            estado="FINAL";

            draw();



            add(

            "Solicitud cancelada correctamente.\n\nEscriba REINICIAR si desea comenzar nuevamente.",

            "bot"

            );


        }


        else{
            // Si escribe algo distinto de SI o NO pide nuevamente la respuesta


            add(

            "Por favor responda SI o NO.",

            "bot"

            );

        }



    }



}





txt.addEventListener(

"keypress",

e=>{

    if(e.key==="Enter")

        send();

}

);