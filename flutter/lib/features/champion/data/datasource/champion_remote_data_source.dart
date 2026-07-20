import 'package:dio/dio.dart';
import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/features/champion/data/dto/champion_dto.dart';

class ChampionRemoteDataSource {
  const ChampionRemoteDataSource(this._dio);

  final Dio _dio;

  Future<ChampionResponseDto> getChampionList(String patchVersion) async {
    final response = await _dio.get<Map<String, dynamic>>(
      '/cdn/$patchVersion/data/${AppConstants.locale}/champion.json',
    );
    return ChampionResponseDto.fromJson(_requireJson(response));
  }

  Future<ChampionResponseDto> getChampion(
    String patchVersion,
    String championId,
  ) async {
    final response = await _dio.get<Map<String, dynamic>>(
      '/cdn/$patchVersion/data/${AppConstants.locale}/champion/'
      '$championId.json',
    );
    return ChampionResponseDto.fromJson(_requireJson(response));
  }

  Map<String, dynamic> _requireJson(Response<Map<String, dynamic>> response) {
    final data = response.data;
    if (data == null) {
      throw const FormatException('Empty Data Dragon response');
    }
    return data;
  }
}
