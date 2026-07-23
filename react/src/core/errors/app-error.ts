export abstract class AppError extends Error {
  readonly cause: unknown;

  protected constructor(message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.cause = cause;
  }
}

export class NetworkError extends AppError {
  constructor(cause?: unknown) {
    super('Network request failed', cause);
  }
}

export class DataError extends AppError {
  constructor(cause?: unknown) {
    super('Response data validation failed', cause);
  }
}

export class ChampionNotFoundError extends AppError {
  constructor(readonly championId: string) {
    super(`Champion not found: ${championId}`);
  }
}
