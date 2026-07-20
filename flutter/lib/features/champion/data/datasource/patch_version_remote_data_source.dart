import 'package:dio/dio.dart';

class PatchVersionRemoteDataSource {
  const PatchVersionRemoteDataSource(this._dio);

  final Dio _dio;

  Future<String?> getLatestPatchVersion() async {
    final response = await _dio.get<List<dynamic>>('/api/versions.json');
    final versions = response.data;
    if (versions == null || versions.isEmpty) {
      return null;
    }

    final version = versions.first;
    return version is String && version.trim().isNotEmpty ? version : null;
  }
}
