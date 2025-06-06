export class HttpError extends Error {
  readonly name = "HttpError";
  readonly statusCode: number;
  readonly statusText: string;
  readonly response: Response;

  constructor(message: string, response: Response, options?: ErrorOptions) {
    super(message, options);
    this.statusCode = response.status;
    this.statusText = response.statusText;
    this.response = response;
  }

  get status() {
    return `${this.statusCode} - ${this.statusText}`;
  }
}
