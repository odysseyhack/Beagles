import { DefaultApi, GenericProcessingOutput } from "./api_ml";
import { logObject } from "../utils";

export function handleResponse(
  response: GenericProcessingOutput
): GenericProcessingOutput {
  logObject(response, "response:");
  if (response.errorMessage !== undefined && response.errorMessage !== null) {
    throw new Error(response.errorMessage);
  }
  return response;
}

export const api: DefaultApi = new DefaultApi(undefined, undefined, fetch);

// in a real app, would likely call an error logging service.
export function handleError(error: Error): Error {
  // eslint-disable-next-line no-console
  console.error("API call failed. " + error);
  throw error;
}
