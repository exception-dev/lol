import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lol_champion/app/theme/app_theme.dart';
import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/core/l10n/app_localizations_extension.dart';
import 'package:lol_champion/features/champion/domain/entity/champion.dart';
import 'package:lol_champion/features/champion/domain/entity/passive.dart';
import 'package:lol_champion/features/champion/domain/entity/skin.dart';
import 'package:lol_champion/features/champion/domain/entity/spell.dart';
import 'package:lol_champion/features/champion/presentation/controller/champion_detail_controller.dart';
import 'package:lol_champion/features/champion/presentation/widget/async_state_views.dart';
import 'package:lol_champion/features/champion/presentation/widget/champion_network_image.dart';

class ChampionDetailPage extends ConsumerWidget {
  const ChampionDetailPage({required this.championId, super.key});

  final String championId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detail = ref.watch(championDetailControllerProvider(championId));

    return Scaffold(
      appBar: AppBar(
        title: Text(context.l10n.championDetailTitle),
        backgroundColor: Colors.transparent,
      ),
      body: detail.when(
        loading: () => const LoadingView(),
        error: (error, stackTrace) => ErrorView(
          error: error,
          onRetry: ref
              .read(championDetailControllerProvider(championId).notifier)
              .retry,
        ),
        data: (state) => _ChampionDetailContent(
          champion: state.champion,
          patchVersion: state.patchVersion,
        ),
      ),
    );
  }
}

class _ChampionDetailContent extends StatelessWidget {
  const _ChampionDetailContent({
    required this.champion,
    required this.patchVersion,
  });

  final Champion champion;
  final String patchVersion;

  @override
  Widget build(BuildContext context) => Center(
    child: ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 900),
      child: ListView(
        padding: const EdgeInsets.only(bottom: 40),
        children: [
          AspectRatio(
            aspectRatio: 885 / 522,
            child: ChampionNetworkImage(
              imageUrl: AppConstants.championSplashUrl(champion.id),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 20, 12, 0),
            child: Text(
              champion.name,
              style: Theme.of(
                context,
              ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          if (champion.tags.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
              child: Wrap(
                spacing: 8,
                runSpacing: 8,
                children: champion.tags
                    .map(
                      (tag) => Chip(
                        label: Text(tag),
                        backgroundColor: const Color(0xFFB3261E),
                        side: BorderSide.none,
                      ),
                    )
                    .toList(growable: false),
              ),
            ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 14, 12, 0),
            child: Text(
              champion.title,
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            child: Text(
              champion.lore,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(height: 1.45),
            ),
          ),
          const SizedBox(height: 16),
          _SkillSection(champion: champion, patchVersion: patchVersion),
          if (champion.skins
              .where((skin) => skin.parentSkin == null)
              .isNotEmpty)
            _SkinSection(champion: champion),
        ],
      ),
    ),
  );
}

class _SkillSection extends StatelessWidget {
  const _SkillSection({required this.champion, required this.patchVersion});

  static const _spellLabels = ['Q', 'W', 'E', 'R'];

  final Champion champion;
  final String patchVersion;

  @override
  Widget build(BuildContext context) {
    final skills = <Widget>[];
    final passive = champion.passive;
    if (passive != null) {
      skills.add(_PassiveInfo(passive: passive, patchVersion: patchVersion));
    }

    for (var index = 0; index < champion.spells.length; index++) {
      skills.add(
        _SpellInfo(
          label: index < _spellLabels.length ? _spellLabels[index] : '',
          spell: champion.spells[index],
          patchVersion: patchVersion,
        ),
      );
    }

    if (skills.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: Column(children: skills),
    );
  }
}

class _PassiveInfo extends StatelessWidget {
  const _PassiveInfo({required this.passive, required this.patchVersion});

  final Passive passive;
  final String patchVersion;

  @override
  Widget build(BuildContext context) => _SkillInfo(
    label: context.l10n.passiveSkillLabel,
    imageUrl: AppConstants.passiveImageUrl(passive.image.full, patchVersion),
    name: passive.name,
    description: passive.description,
  );
}

class _SpellInfo extends StatelessWidget {
  const _SpellInfo({
    required this.label,
    required this.spell,
    required this.patchVersion,
  });

  final String label;
  final Spell spell;
  final String patchVersion;

  @override
  Widget build(BuildContext context) {
    final description = spell.tooltip.trim().isEmpty
        ? spell.description
        : '${spell.description}\n\n${spell.tooltip}';

    return _SkillInfo(
      label: label,
      imageUrl: AppConstants.spellImageUrl(spell.image.full, patchVersion),
      name: spell.name,
      description: description,
      circularLabel: true,
    );
  }
}

class _SkillInfo extends StatelessWidget {
  const _SkillInfo({
    required this.label,
    required this.imageUrl,
    required this.name,
    required this.description,
    this.circularLabel = false,
  });

  final String label;
  final String imageUrl;
  final String name;
  final String description;
  final bool circularLabel;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 12),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 58,
          child: Column(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: SizedBox.square(
                  dimension: 50,
                  child: ChampionNetworkImage(imageUrl: imageUrl),
                ),
              ),
              const SizedBox(height: 8),
              Container(
                constraints: const BoxConstraints(minWidth: 20, minHeight: 20),
                padding: EdgeInsets.symmetric(
                  horizontal: circularLabel ? 4 : 8,
                  vertical: 2,
                ),
                decoration: BoxDecoration(
                  color: const Color(0xFF2166F3),
                  borderRadius: BorderRadius.circular(circularLabel ? 20 : 16),
                ),
                alignment: Alignment.center,
                child: Text(label, style: const TextStyle(fontSize: 10)),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text(
                description,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 12,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _SkinSection extends StatefulWidget {
  const _SkinSection({required this.champion});

  final Champion champion;

  @override
  State<_SkinSection> createState() => _SkinSectionState();
}

class _SkinSectionState extends State<_SkinSection> {
  late final PageController _pageController;

  List<Skin> get _skins => widget.champion.skins
      .where((skin) => skin.parentSkin == null)
      .toList(growable: false);

  @override
  void initState() {
    super.initState();
    _pageController = PageController(viewportFraction: 0.72);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(top: 20),
    child: SizedBox(
      height: 500,
      child: PageView.builder(
        controller: _pageController,
        itemCount: _skins.length,
        itemBuilder: (context, index) {
          final skin = _skins[index];
          return AnimatedBuilder(
            animation: _pageController,
            builder: (context, child) {
              final page = _pageController.hasClients
                  ? (_pageController.page ?? 0)
                  : 0.0;
              final distance = (page - index).abs().clamp(0.0, 1.0);
              final scale = 1 - (distance * 0.15);
              return Transform.scale(
                scale: scale,
                child: Opacity(opacity: 1 - (distance * 0.5), child: child),
              );
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Card(
                clipBehavior: Clip.antiAlias,
                color: AppTheme.card,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    ChampionNetworkImage(
                      imageUrl: AppConstants.championSkinUrl(
                        widget.champion.id,
                        skin.number,
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        color: Colors.black54,
                        child: Text(
                          skin.name,
                          textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 12),
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
