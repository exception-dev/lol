import 'package:flutter/material.dart';
import 'package:lol_champion/core/error/app_exception.dart';
import 'package:lol_champion/core/l10n/app_localizations_extension.dart';

class LoadingView extends StatelessWidget {
  const LoadingView({super.key});

  @override
  Widget build(BuildContext context) =>
      const Center(child: CircularProgressIndicator());
}

class ErrorView extends StatelessWidget {
  const ErrorView({required this.error, required this.onRetry, super.key});

  final Object error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.cloud_off_outlined, size: 42),
          const SizedBox(height: 12),
          Text(
            _localizedErrorMessage(context, error),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          FilledButton(onPressed: onRetry, child: Text(context.l10n.retry)),
        ],
      ),
    ),
  );
}

String _localizedErrorMessage(BuildContext context, Object error) =>
    switch (error) {
      NetworkException() => context.l10n.networkError,
      DataException() => context.l10n.dataError,
      ChampionNotFoundException(:final championId) =>
        context.l10n.championNotFoundError(championId),
      _ => context.l10n.unknownError,
    };
