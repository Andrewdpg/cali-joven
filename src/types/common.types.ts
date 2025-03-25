export enum HTTPCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// TODO: Eliminar esta respuesta, demasiado basica (o mirar en que caasos seria adecuada)
export type CommonResponse = {
  message: {
    content: string;
    code: HTTPCode;
  };
};

export type BasicResponse = {
  success: boolean;
  message: string;
};

export type Metadata = {
  timestamp: Date;
  version: string;
};

export type CreationResponse = BasicResponse & {
  data: {
    createdAt: Date;
    resource: any;
  };
} & Metadata;

export type UpdateResponse = BasicResponse & {
  data: {
    updatedAt: Date;
    resource: any;
  };
} & Metadata;

export type DeleteResponse = BasicResponse & {
  data: {
    deletedAt: Date;
  };
} & Metadata;

export type ErrorResponse = BasicResponse & {
  error: {
    code: HTTPCode;
    details: string;
  };
} & Metadata;
