sealed class AppException implements Exception {
  const AppException([this.cause]);

  final Object? cause;
}

final class NetworkException extends AppException {
  const NetworkException([super.cause]);
}

final class DataException extends AppException {
  const DataException([super.cause]);
}

final class ChampionNotFoundException extends AppException {
  const ChampionNotFoundException(this.championId);

  final String championId;
}
