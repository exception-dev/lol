import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lol_champion/app/router/app_router.dart';
import 'package:lol_champion/app/theme/app_theme.dart';
import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/core/l10n/app_localizations_extension.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/presentation/controller/champion_list_controller.dart';
import 'package:lol_champion/features/champion/presentation/widget/async_state_views.dart';
import 'package:lol_champion/features/champion/presentation/widget/champion_network_image.dart';

class ChampionListPage extends ConsumerStatefulWidget {
  const ChampionListPage({super.key});

  @override
  ConsumerState<ChampionListPage> createState() => _ChampionListPageState();
}

class _ChampionListPageState extends ConsumerState<ChampionListPage> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _clearSearch() {
    _searchController.clear();
    ref.read(championSearchControllerProvider.notifier).clear();
  }

  void _openChampion(String championId) {
    _clearSearch();
    context.go(AppRoutes.championDetail(championId));
  }

  @override
  Widget build(BuildContext context) {
    final champions = ref.watch(championListControllerProvider);
    final search = ref.watch(championSearchControllerProvider);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              child: TextField(
                controller: _searchController,
                onChanged: ref
                    .read(championSearchControllerProvider.notifier)
                    .updateQuery,
                textInputAction: TextInputAction.search,
                decoration: InputDecoration(
                  hintText: context.l10n.championSearchHint,
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: search.query.isEmpty
                      ? null
                      : IconButton(
                          tooltip: context.l10n.clearSearchTooltip,
                          onPressed: _clearSearch,
                          icon: const Icon(Icons.close),
                        ),
                ),
              ),
            ),
            Expanded(
              child: champions.when(
                loading: () => const LoadingView(),
                error: (error, stackTrace) => ErrorView(
                  error: error,
                  onRetry: ref
                      .read(championListControllerProvider.notifier)
                      .retry,
                ),
                data: (data) {
                  final query = search.appliedQuery.toLowerCase();
                  final filtered = query.isEmpty
                      ? data
                      : data
                            .where(
                              (champion) =>
                                  champion.name.toLowerCase().contains(query),
                            )
                            .toList(growable: false);
                  return search.query.trim().isEmpty
                      ? _ChampionGrid(
                          champions: filtered,
                          onChampionTap: _openChampion,
                        )
                      : _ChampionSearchResults(
                          champions: filtered,
                          onChampionTap: _openChampion,
                        );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChampionGrid extends StatelessWidget {
  const _ChampionGrid({required this.champions, required this.onChampionTap});

  final List<Champion> champions;
  final ValueChanged<String> onChampionTap;

  @override
  Widget build(BuildContext context) {
    if (champions.isEmpty) {
      return _EmptyView(message: context.l10n.emptyChampionList);
    }

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 900),
        child: GridView.builder(
          padding: const EdgeInsets.fromLTRB(10, 16, 10, 16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 8,
            childAspectRatio: 1.45,
          ),
          itemCount: champions.length,
          itemBuilder: (context, index) {
            final champion = champions[index];
            return Card(
              clipBehavior: Clip.antiAlias,
              color: AppTheme.card,
              child: InkWell(
                onTap: () => onChampionTap(champion.id),
                child: Column(
                  children: [
                    Expanded(
                      child: SizedBox.expand(
                        child: ChampionNetworkImage(
                          imageUrl: AppConstants.championSplashUrl(champion.id),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Text(
                        champion.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _ChampionSearchResults extends StatelessWidget {
  const _ChampionSearchResults({
    required this.champions,
    required this.onChampionTap,
  });

  final List<Champion> champions;
  final ValueChanged<String> onChampionTap;

  @override
  Widget build(BuildContext context) {
    if (champions.isEmpty) {
      return _EmptyView(message: context.l10n.emptySearchResults);
    }

    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 900),
        child: ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
          itemCount: champions.length,
          separatorBuilder: (context, index) => const SizedBox(height: 8),
          itemBuilder: (context, index) {
            final champion = champions[index];
            return Card(
              clipBehavior: Clip.antiAlias,
              color: AppTheme.card,
              child: InkWell(
                onTap: () => onChampionTap(champion.id),
                child: SizedBox(
                  height: 66,
                  child: Row(
                    children: [
                      AspectRatio(
                        aspectRatio: 885 / 522,
                        child: ChampionNetworkImage(
                          imageUrl: AppConstants.championSplashUrl(champion.id),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            champion.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  const _EmptyView({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) => Center(child: Text(message));
}
