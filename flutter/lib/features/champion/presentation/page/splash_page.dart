import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lol_champion/app/router/app_router.dart';
import 'package:lol_champion/core/constants/app_constants.dart';
import 'package:lol_champion/core/l10n/app_localizations_extension.dart';
import 'package:lol_champion/features/champion/presentation/controller/app_initialization_controller.dart';

class SplashPage extends ConsumerStatefulWidget {
  const SplashPage({super.key});

  @override
  ConsumerState<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends ConsumerState<SplashPage> {
  String _visibleTitle = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _initialize());
  }

  Future<void> _initialize() async {
    await Future.wait([
      _animateTitle(),
      ref.read(appInitializationProvider.future),
    ]);

    if (mounted) {
      context.go(AppRoutes.champions);
    }
  }

  Future<void> _animateTitle() async {
    final characters = context.l10n.splashTitle.runes.map(
      (codePoint) => String.fromCharCode(codePoint),
    );
    for (final character in characters) {
      if (!mounted) {
        return;
      }
      setState(() => _visibleTitle += character);
      await Future<void>.delayed(AppConstants.splashCharacterDelay);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: Semantics(
        label: context.l10n.splashTitle,
        child: ExcludeSemantics(
          child: Text(
            _visibleTitle,
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
        ),
      ),
    ),
  );
}
