# Cali Joven - Plataforma Digital para Juventudes

**Cali Joven** es una plataforma digital diseñada para fortalecer la participación juvenil en Santiago de Cali. Su objetivo es servir como un canal centralizado donde los jóvenes puedan acceder a oportunidades, eventos y recursos proporcionados por la **Plataforma Distrital de Juventudes (PDJ)** y el **Consejo Distrital de Juventud (CDJ)**.

Esta solución busca cerrar la brecha digital y mejorar la transparencia, comunicación y acceso a información clave, como normativas, becas, eventos y espacios de participación juvenil.

## **Objetivos del Proyecto**

1. **Centralizar y difundir información institucional**  
   Permitir el acceso a documentos oficiales, reglamentos, actas de reuniones y listados de integrantes de la PDJ/CDJ.

2. **Facilitar la gestión y promoción de eventos y oportunidades**  
   Publicación de convocatorias, eventos, becas y programas juveniles.

3. **Mejorar la comunicación directa con jóvenes y organizaciones**  
   Implementación de notificaciones, foros y mensajes personalizados.

4. **Garantizar transparencia y eficiencia en la gestión**  
   Implementación de reportes y paneles administrativos para monitorear actividades.

5. **Facilitar la generación de reportes y seguimiento de actividades**  
   Generación de estadísticas sobre asistencia a eventos, postulaciones y participación juvenil.

---

##  **Tecnologías Utilizadas**

| Tecnología  | Descripción |
|------------|------------|
| **Node.js** | Plataforma de ejecución para JavaScript en el backend. |
| **Express.js** | Framework web para crear y gestionar API REST. |
| **TypeScript** | Lenguaje tipado que mejora la seguridad y legibilidad del código. |
| **PostgreSQL** | Base de datos relacional para almacenar información de usuarios y publicaciones. |
| **Jest** | Framework de pruebas automatizadas. |
| **JWT (JSON Web Tokens)** | Sistema de autenticación y autorización seguro. |
| **Postman** | Herramienta para probar y documentar la API. |

---

## **Arquitectura del Proyecto**

El proyecto sigue una arquitectura **MVC (Modelo-Vista-Controlador)** con módulos específicos para cada funcionalidad.

```plaintext
📂 cali-joven
 ┣ 📂 src
 ┃ ┣ 📂 controllers   # Controladores de las rutas
 ┃ ┣ 📂 middleware    # Middlewares para validaciones y seguridad
 ┃ ┣ 📂 models        # Definición de modelos y esquemas
 ┃ ┣ 📂 routes        # Definición de rutas y endpoints
 ┃ ┣ 📂 services      # Lógica de negocio y consultas a la base de datos
 ┃ ┣ 📂 config        # Configuración de variables de entorno
 ┃ ┣ 📂 utils         # Funciones auxiliares
 ┃ ┣ 📜 app.ts        # Configuración del servidor Express
 ┃ ┗ 📜 index.ts      # Punto de entrada del servidor
 ┣ 📜 package.json    # Dependencias y scripts del proyecto
 ┣ 📜 tsconfig.json   # Configuración de TypeScript
 ┗ 📜 README.md       # Documentación del proyecto
```
##  Módulos Clave del Proyecto

###  1. Autenticación y Gestión de Usuarios
-  **Registro y Login** con JWT.
-  **Roles y Permisos**: Público, Integrantes PDJ/CDJ y Administradores.
-  **Perfil Personalizado** con notificaciones y acceso a contenido relevante.

###  2. Gestión de Eventos y Convocatorias
-  **Publicación de eventos** por parte de administradores.
-  **Registro de asistentes** y confirmación por correo electrónico.
-  **Notificaciones automáticas** antes del evento.

###  3. Contenido Institucional
-  Acceso a **documentos oficiales** (reglamentos, actas, resoluciones).
-  **Directorio de integrantes** con sus roles y datos de contacto.

###  4. Comunicación y Notificaciones
-  **Suscripción a categorías de interés** (educación, empleo, cultura).
-  **Alertas automáticas** sobre nuevos eventos y convocatorias.

###  5. Reportes y Transparencia
-  **Generación de estadísticas** sobre participación juvenil.
-  **Reportes descargables** en **PDF, Word o PNG**.

# Configuración y Ejecución

## 1️⃣ Instalación de Dependencias
```sh
npm install
```

## 2️⃣ Configuración del Entorno
Crea un archivo `.env` con las siguientes variables:

```env
PORT=5000
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/cali_joven
JWT_SECRET=tu_secreto_seguro
```

## 3️⃣ Inicialización de la Base de Datos
```sh
npm run db:migrate
npm run db:seed
```

## 4️⃣ Iniciar el Servidor
```sh
npm run dev
```

---

## Endpoints Principales

### Usuarios `/api/user`
- **POST** `/register` - Registrar un nuevo usuario.
- **POST** `/login` - Autenticar usuario y generar JWT.
- **GET** `/profile` - Obtener perfil del usuario autenticado.

### Publicaciones `/api/post`
- **POST** `/` - Crear una nueva publicación.
- **GET** `/` - Obtener todas las publicaciones.
- **PUT** `/:id` - Editar una publicación existente.
- **DELETE** `/:id` - Eliminar una publicación.

### Organizaciones `/api/organization`
- **POST** `/` - Registrar una organización.
- **GET** `/` - Listar organizaciones registradas.
- **GET** `/:id` - Obtener información de una organización específica.

---

## Pruebas con Jest
Ejecuta pruebas unitarias y de integración:

```sh
npm test
```

Genera reportes de cobertura en la carpeta `coverage/`.

