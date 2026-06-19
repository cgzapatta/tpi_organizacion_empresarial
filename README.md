Universidad Tecnológica Nacional 

Tecnicatura Universitaria en Programación 

 

Trabajo Práctico Integrador 

Materia: Organización Empresarial 

 
Alumnos 

Carlos German Zapatta 

Leonardo Laureano Gonzalez 

 

Docente Titular 

Prof. Gabriela Martínez 

 

Docente Tutor 

Lourdes Ricciuto


Manual de Implementación – Chatbot de Gestión de Vacaciones

Versión simulada (entorno de desarrollo web)

En nuestro caso, la versión simulada del sistema fue desarrollada utilizando HTML, CSS y JavaScript, por lo que su implementación no requiere infraestructura compleja ni servidores externos.

Para ejecutar el proyecto, lo que hacemos es abrir la carpeta del sistema en Visual Studio Code y utilizar la extensión Live Server. A partir de allí, ejecutamos el archivo principal index.html, lo que nos permite visualizar y utilizar el chatbot directamente desde el navegador.

Cuando el sistema inicia, carga automáticamente la base de datos simulada de empleados desde un archivo CSV utilizando la función fetch. Desde ese momento, el chatbot queda listo para interactuar con el usuario y seguir el flujo definido en el BPMN.

En esta versión, toda la lógica del sistema, la máquina de estados y la simulación de persistencia de datos la manejamos del lado del cliente con JavaScript, sin necesidad de backend.




Versión real (entorno productivo)

Si lleváramos este sistema a un entorno real, lo que pensamos es que se podría implementar como un chatbot integrado a WhatsApp Business API u otra plataforma de mensajería corporativa.

En ese escenario, el sistema lo dividiríamos en un backend desarrollado en Node.js o Python, conectado a una base de datos real como MySQL o PostgreSQL, donde se almacenaría la información de empleados y solicitudes.

La lógica del chatbot, incluyendo la máquina de estados y las reglas de validación, la ejecutaríamos en el servidor, permitiendo gestionar múltiples usuarios al mismo tiempo y asegurando la persistencia de los datos de forma segura.

El despliegue lo realizaríamos en un servicio cloud como AWS, Azure o Google Cloud, utilizando endpoints HTTPS para la comunicación entre el chatbot y la plataforma de mensajería.




Manual de Usuario – Chatbot de Solicitud de Vacaciones (USUARIOS)

Para utilizar el sistema, primero ingrese su número de legajo en el chat. 
Este es el dato inicial obligatorio para que el sistema pueda identificarlo.

Si el sistema le muestra sus datos, continúe siguiendo las instrucciones que se le indiquen en pantalla.

Cuando se le solicite una fecha de inicio de vacaciones, debe ingresarla en formato DD-MM-AAAA (por ejemplo: 15-05-2026). 
Es importante respetar este formato.

Luego deberá ingresar la cantidad de días de vacaciones que desea solicitar. 
Ingrese únicamente números.

Si el sistema le solicita confirmación, responda SI para continuar con la solicitud o NO para cancelarla.

En caso de que ya tenga vacaciones programadas, el sistema le preguntará si desea modificarlas. 
Responda SI si desea continuar con el cambio o NO si desea mantenerlas como están.

Si el sistema deriva su solicitud a Recursos Humanos, deberá esperar la validación antes de continuar con el proceso.

Puede reiniciar el proceso en cualquier momento escribiendo “REINICIAR”.

También puede consultar en qué etapa se encuentra escribiendo “ESTADO”.

Le recomendamos seguir siempre las instrucciones del sistema paso a paso para completar correctamente la solicitud.



Manual de funcionamiento – Chatbot de Gestión de Vacaciones (GESTIÓN)

1. El usuario inicia la interacción ingresando su número de legajo en el chat.

2. El sistema valida el legajo contra la base de datos simulada de empleados.

3. Si el legajo es correcto, el sistema muestra los datos del empleado, incluyendo nombre, puesto, saldo de días de vacaciones y estado actual.

4. Si el empleado ya tiene vacaciones programadas, el sistema informa la fecha existente y consulta si desea modificarlas (SI o NO).

5. Si el usuario responde SI, la solicitud es derivada a una validación de Recursos Humanos (simulada). Luego de recibir la respuesta, el proceso continúa solicitando una nueva fecha de inicio de vacaciones.

6. Si el usuario responde NO en el caso de vacaciones ya programadas, el proceso finaliza sin cambios.

7. Si el empleado no tiene vacaciones programadas, el sistema solicita la fecha de inicio en formato DD-MM-AAAA.

8. El usuario ingresa la fecha y el sistema valida que el formato sea correcto y que la fecha sea válida.

9. Luego el sistema solicita la cantidad de días de vacaciones a tomar.

10. El usuario ingresa la cantidad de días y el sistema valida que sea un número válido y que no supere el saldo disponible de vacaciones.

11. Si la cantidad de días solicitada supera el saldo disponible, el sistema rechaza la solicitud y solicita una nueva carga.

12. Si la cantidad de días es mayor a 15, la solicitud se deriva a validación de Recursos Humanos (simulada) antes de continuar.

13. Una vez validado el caso (si corresponde), el sistema muestra un resumen de la solicitud con fecha y cantidad de días.

14. El sistema solicita confirmación final al usuario (SI o NO).

15. Si el usuario confirma (SI), la solicitud se registra, se genera un número de operación único y el proceso finaliza.

16. Si el usuario rechaza (NO), la solicitud se cancela y el proceso finaliza.

17. En cualquier momento del proceso, el usuario puede escribir "REINICIAR" para comenzar nuevamente desde el inicio.

18. El usuario puede escribir "ESTADO" para consultar la etapa actual del proceso dentro del flujo.




