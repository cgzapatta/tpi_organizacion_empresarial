let empleados = [];

let estado = "LEGAJO";

let emp = null;

let fecha = "";
let dias = "";

let modificando = false;



fetch("empleados.csv")
.then(r => r.text())
.then(t => {

    const filas = t.trim().split("\n");

    const headers = filas[0].split(",");


    for(let i=1;i<filas.length;i++){

        const valores = filas[i].split(",");

        let obj={};

        headers.forEach((h,j)=>{

            obj[h.trim()] = valores[j]?.trim();

        });


        empleados.push(obj);

    }


    add(
        "¡Hola! 😊 Soy el asistente de RRHH.\n\nPara comenzar con la gestión de vacaciones, por favor ingrese su número de legajo.",
        "bot"
    );


});



const estados = {

    LEGAJO:"Esperando legajo",

    VAC_EXISTENTE:"Verificando vacaciones existentes",

    FECHA:"Esperando fecha de inicio",

    DIAS:"Esperando cantidad de días",

    RRHH:"Esperando respuesta de RRHH",

    CONF:"Esperando confirmación",

    FINAL:"Proceso finalizado"

};





function draw(){

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





function add(text, clase){


    let d=document.createElement("div");


    d.className="msg "+clase;


    d.textContent=text;


    chat.appendChild(d);


    chat.scrollTop=chat.scrollHeight;


}





function mostrarEmpleado(){


    if(!emp){

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


    estado="RRHH";

    draw();



    add(

    "La solicitud requiere validación de RRHH.\n\nEstoy enviando la información para su revisión.\n\nEspere mientras recibimos una respuesta...",

    "bot"

    );



    setTimeout(()=>{


        add(

        "RRHH aprobó la solicitud correctamente.",

        "bot"

        );


        callback();



    },5000);



}







function send(){



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