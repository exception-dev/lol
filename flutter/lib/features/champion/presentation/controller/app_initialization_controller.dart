import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/features/champion/data/provider/champion_data_providers.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_initialization_controller.g.dart';

@Riverpod(keepAlive: true)
Future<String> appInitialization(Ref ref) async {
  final refresh = ref.watch(refreshLatestPatchVersionProvider);
  final getStoredVersion = ref.watch(getPatchVersionProvider);

  try {
    return await refresh().timeout(AppConstants.startupNetworkLimit);
  } on Object {
    return getStoredVersion();
  }
}
