import 'package:go_router/go_router.dart';
import 'package:lol_champion/features/champion/presentation/page/champion_detail_page.dart';
import 'package:lol_champion/features/champion/presentation/page/champion_list_page.dart';
import 'package:lol_champion/features/champion/presentation/page/splash_page.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'app_router.g.dart';

abstract final class AppRoutes {
  static const splash = '/splash';
  static const champions = '/champions';

  static String championDetail(String championId) =>
      '$champions/${Uri.encodeComponent(championId)}';
}

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref ref) => GoRouter(
  initialLocation: AppRoutes.splash,
  routes: [
    GoRoute(
      path: AppRoutes.splash,
      builder: (context, state) => const SplashPage(),
    ),
    GoRoute(
      path: AppRoutes.champions,
      builder: (context, state) => const ChampionListPage(),
      routes: [
        GoRoute(
          path: ':championId',
          builder: (context, state) => ChampionDetailPage(
            championId: state.pathParameters['championId'] ?? '',
          ),
        ),
      ],
    ),
  ],
);
