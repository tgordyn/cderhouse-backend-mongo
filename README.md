# Entrega Final curso Backend II - Tomas Gordyn
Este proyecto corresponde a la **Entrega final** del curso **Programación Backend II: Diseño y Arquitectura Backend**, comisión **70070**. Implementación de Login, Register, autorización, autenticación de usuario, arquitectura DAO, DTO, Repository, Ticket y nodemailer.

## Requisitos previos
Asegúrate de tener instalados los siguientes programas:
- [Node.js](https://nodejs.org) (v14 o superior)
- [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
- [Git](https://git-scm.com/) (para clonar el repositorio)

## Instalación
1. **Clonar el repositorio:**
   git clone https://github.com/tgordyn/cderhouse-backend-mongo.git
2. **Navegar al directorio del repositorio:**
   cd cderhouse-backend-mongo
   cd CODERHOUSE

3. **Instalar las dependencias:**
   npm install

4. **Configuración del archivo `.env`:**
   - Crea un archivo `.env` en la raíz del proyecto con el siguiente formato, reemplazando los valores con los apropiados para tu entorno de desarrollo.
  Ejemplo de archivo `.env.example` para referencia de variables.

1. **Iniciar la aplicación:**
   - npm start

2. **Poblar base de datos con productos:**
   - cd src
   - node seedProducts.js

## Servidor
El servidor está configurado para ejecutarse en `localhost` en el puerto `8080`. Una vez que la aplicación esté inicializada con el comando `npm start`, se puede visualizar el proyecto en un navegador utilizando el siguiente enlace:
http://localhost:8080/

### Notas
- Asegúrate de que el servicio de MongoDB esté en funcionamiento y configurado correctamente en el archivo `.env`.
- La aplicación también utiliza tokens JWT para autenticación, por lo que se debe especificar una clave secreta para el JWT en el archivo `.env`.


## Contacto
Si tienes alguna pregunta o problema relacionado con este proyecto, no dudes en contactarme a través de GitHub o correo, tomas.gordyn@gmail.com.
