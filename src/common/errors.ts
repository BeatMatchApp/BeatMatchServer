export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class aiParsingError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message || "failed to parse ai answer");
    this.name = "aiParsingError";
  }
}
