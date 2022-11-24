interface DataResponse {
  data: unknown;
}

interface ErrorResponse {
  error: string;
}

export type ServerResponse = DataResponse | ErrorResponse;

export function serverResponse(body: DataResponse): string;
export function serverResponse(body: ErrorResponse): string;
export function serverResponse(body: ServerResponse): string {
  return JSON.stringify(body);
}
