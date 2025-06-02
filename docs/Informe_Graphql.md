# Informe de Implementación GraphQL

## Índice

1. [Introducción](#introducción)
2. [Arquitectura GraphQL](#arquitectura-graphql)
3. [Esquema y Tipos](#esquema-y-tipos)
4. [Consultas y Mutaciones](#consultas-y-mutaciones)
5. [Manejo de Errores](#manejo-de-errores)
6. [Autenticación y Autorización](#autenticación-y-autorización)
7. [Validaciones](#validaciones)

## Introducción

Este informe detalla la implementación de GraphQL en el proyecto, que consiste en la migración de una API REST existente a GraphQL. La implementación mantiene las funcionalidades originales mientras aprovecha las ventajas de GraphQL para mejorar la eficiencia y flexibilidad en la gestión de datos.

## Arquitectura GraphQL

La arquitectura GraphQL está implementada utilizando Apollo Server con Express, siguiendo una estructura modular y bien organizada:

- **Servidor Apollo**: Configurado en `app.ts` con middleware personalizado para manejo de errores
- **Contexto**: Implementado en `context.ts` para manejar la autenticación y el estado de la sesión
- **Resolvers**: Organizados en módulos separados para usuarios y posts
- **Helpers**: Utilidades para autenticación y formateo de errores

## Esquema y Tipos

El esquema GraphQL (`schema.ts`) define una estructura tipada que incluye:

### Interfaces y Tipos Base

- **Post**: Interfaz base para todas las publicaciones
- **User**: Tipo para usuarios del sistema

### Tipos Específicos

- **Event**: Implementación de Post para eventos
- **Offer**: Implementación de Post para ofertas
- **News**: Implementación de Post para noticias

### Uniones

- **PostResult**: Unión de tipos Event, Offer y News

## Consultas y Mutaciones

### Consultas Implementadas

- `me`: Obtiene el usuario autenticado actual
- `users`: Lista todos los usuarios (solo admin)
- `posts`: Obtiene publicaciones con filtros opcionales
- `post`: Obtiene una publicación específica por ID

### Mutaciones Implementadas

- **Autenticación**:

  - `register`: Registro de nuevos usuarios
  - `login`: Inicio de sesión
- **Gestión de Usuarios**:

  - `createUser`: Crear usuario (admin)
  - `updateUser`: Actualizar usuario (admin)
  - `deleteUser`: Eliminar usuario (admin)
- **Gestión de Publicaciones**:

  - `createEvent`: Crear evento
  - `createOffer`: Crear oferta
  - `createNews`: Crear noticia
  - `updatePost`: Actualizar publicación
  - `deletePost`: Eliminar publicación

## Manejo de Errores

El sistema implementa un manejo de errores robusto:

- **Formateador de Errores**: Implementado en `errorFormatter.ts`
- **Validación con Zod**: Integración para validación de datos
- **Errores Personalizados**: Para autenticación y autorización
- **Mensajes Claros**: Errores formateados para mejor comprensión

## Autenticación y Autorización

### Sistema de Autenticación

- JWT (JSON Web Tokens) para autenticación
- Middleware de contexto para extraer y validar tokens
- Manejo seguro de credenciales

### Sistema de Autorización

- Roles y permisos basados en `authorities`
- Wrapper de resolvers para verificación de permisos
- Control granular de acceso a operaciones

## Validaciones

### Validación de Datos

- Esquemas Zod para validación de entrada
- Validación de tipos en tiempo de ejecución
- Mensajes de error descriptivos

### Esquemas de Validación

- `CreatePostSchema`: Validación para creación de posts
- `UpdatePostSchema`: Validación para actualización de posts
- `LoginSchema`: Validación para autenticación
