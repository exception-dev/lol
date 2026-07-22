export class AppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class NetworkError extends AppError {}

export class DataError extends AppError {}

export class ChampionNotFoundError extends AppError {
  constructor(
    readonly championId: string,
    options?: ErrorOptions,
  ) {
    super(`Champion not found: ${championId}`, options);
  }
}
