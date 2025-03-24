import {
  CreationResponse,
  DeleteResponse,
  ErrorResponse,
  UpdateResponse,
} from "../types";

export const toCreationResponse = (
  resource: any,
  version = "1.0.0"
): CreationResponse => {
  return {
    success: true,
    message: "Resource created",
    data: {
      createdAt: new Date(),
      resource,
    },
    timestamp: new Date(),
    version,
  };
};

export const toUpdateResponse = (
  resource: any,
  version = "1.0.0"
): UpdateResponse => {
  return {
    success: true,
    message: "Resource updated",
    data: {
      updatedAt: new Date(),
      resource,
    },
    timestamp: new Date(),
    version,
  };
};

export const toDeleteResponse = (version = "1.0.0"): DeleteResponse => {
  return {
    success: true,
    message: "Resource deleted",
    data: {
      deletedAt: new Date(),
    },
    timestamp: new Date(),
    version,
  };
};

export const toErrorResponse = (
  code: number,
  details: string,
  version = "1.0.0"
): ErrorResponse => {
  return {
    success: false,
    message: "Error",
    error: {
      code,
      details,
    },
    timestamp: new Date(),
    version,
  };
};
