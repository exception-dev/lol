import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/features/champion/presentation/controller/champion_list_controller.dart';

void main() {
  test('applies a search query after the debounce duration', () async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final subscription = container.listen(
      championSearchControllerProvider,
      (previous, next) {},
    );
    addTearDown(subscription.close);

    container.read(championSearchControllerProvider.notifier).updateQuery('아');

    expect(container.read(championSearchControllerProvider).query, '아');
    expect(
      container.read(championSearchControllerProvider).appliedQuery,
      isEmpty,
    );

    await Future<void>.delayed(
      AppConstants.searchDebounce + const Duration(milliseconds: 20),
    );

    expect(container.read(championSearchControllerProvider).appliedQuery, '아');
  });
}
