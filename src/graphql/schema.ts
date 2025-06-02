import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # Interfaz base para publicaciones
  interface Post {
    id: ID!
    title: String!
    description: String!
    type: String!
    attachments: String
    images: [String!]!
    published_by: User!
    organizer_id: ID!
    cities: [String!]!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  # Tipo de publicación: Evento
  type Event implements Post {
    id: ID!
    title: String!
    description: String!
    type: String!
    attachments: String
    images: [String!]!
    published_by: User!
    organizer_id: ID!
    cities: [String!]!
    tags: [String!]!
    date: String!
    location: String!
    registration_link: String!
    createdAt: String!
    updatedAt: String!
  }

  # Tipo de publicación: Oferta
  type Offer implements Post {
    id: ID!
    title: String!
    description: String!
    type: String!
    attachments: String
    images: [String!]!
    published_by: User!
    organizer_id: ID!
    cities: [String!]!
    tags: [String!]!
    external_link: String!
    deadline: String!
    createdAt: String!
    updatedAt: String!
  }

  # Tipo de publicación: Noticia
  type News implements Post {
    id: ID!
    title: String!
    description: String!
    type: String!
    attachments: String
    images: [String!]!
    published_by: User!
    organizer_id: ID!
    cities: [String!]!
    tags: [String!]!
    author: String!
    createdAt: String!
    updatedAt: String!
  }

  # Unión de tipos de publicación
  union PostResult = Event | Offer | News

  # Tipo de usuario
  type User {
    id: ID!
    name: String!
    email: String!
    authorities: [String]
  }

  # Consultas disponibles
  type Query {
    me: User # Usuario autenticado
    users: [User!]! # Lista de usuarios (solo admin)
    posts(type: String, userId: ID): [PostResult!]! # Lista de publicaciones
    post(id: ID!): PostResult # Publicación por ID
  }

  # Mutaciones disponibles
  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload! # Registro
    login(email: String!, password: String!): AuthPayload! # Login
    createUser(name: String!, email: String!, password: String!, authorities: [String]): User! # Crear usuario (admin)
    updateUser(id: ID!, name: String, email: String, password: String, authorities: [String]): User! # Actualizar usuario (admin)
    deleteUser(id: ID!): Boolean! # Eliminar usuario (admin)
    createEvent(
      title: String!,
      description: String!,
      attachments: String,
      images: [String!],
      organizer_id: ID!,
      cities: [String!]!,
      tags: [String!]!,
      date: String!,
      location: String!,
      registration_link: String!
    ): Event! # Crear evento
    createOffer(
      title: String!,
      description: String!,
      attachments: String,
      images: [String!],
      organizer_id: ID!,
      cities: [String!]!,
      tags: [String!]!,
      external_link: String!,
      deadline: String!
    ): Offer! # Crear oferta
    createNews(
      title: String!,
      description: String!,
      attachments: String,
      images: [String!],
      organizer_id: ID!,
      cities: [String!]!,
      tags: [String!]!,
      author: String!
    ): News! # Crear noticia
    updatePost(id: ID!, data: UpdatePostInput!): PostResult! # Actualizar publicación
    deletePost(id: ID!): Boolean! # Eliminar publicación
  }

  # Input para actualizar publicaciones
  input UpdatePostInput {
    title: String
    description: String
    attachments: String
    images: [String!]
    cities: [String!]
    tags: [String!]
    date: String
    location: String
    registration_link: String
    external_link: String
    deadline: String
    author: String
  }

  # Payload de autenticación
  type AuthPayload {
    token: String!
    user: User!
  }
`; 