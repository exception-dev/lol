import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:lol_champion/core/constants/app_constants.dart';

class PatchVersionLocalDataSource {
  const PatchVersionLocalDataSource(this._storage);

  static const _storageKey = 'latest_lol_patch_version';

  final FlutterSecureStorage _storage;

  Future<String> read() async {
    try {
      final version = await _storage.read(key: _storageKey);
      return version == null || version.trim().isEmpty
          ? AppConstants.fallbackPatchVersion
          : version;
    } on Object {
      return AppConstants.fallbackPatchVersion;
    }
  }

  Future<void> write(String version) async {
    if (version.trim().isEmpty) {
      return;
    }
    await _storage.write(key: _storageKey, value: version);
  }
}
