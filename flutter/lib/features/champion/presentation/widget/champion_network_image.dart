import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class ChampionNetworkImage extends StatelessWidget {
  const ChampionNetworkImage({
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.alignment = Alignment.center,
    super.key,
  });

  final String imageUrl;
  final BoxFit fit;
  final Alignment alignment;

  @override
  Widget build(BuildContext context) => CachedNetworkImage(
    imageUrl: imageUrl,
    fit: fit,
    alignment: alignment,
    fadeInDuration: const Duration(milliseconds: 180),
    placeholder: (context, url) => const ColoredBox(
      color: Color(0xFF2C2C34),
      child: Center(
        child: SizedBox.square(
          dimension: 22,
          child: CircularProgressIndicator(strokeWidth: 2),
        ),
      ),
    ),
    errorWidget: (context, url, error) => const ColoredBox(
      color: Color(0xFF2C2C34),
      child: Center(child: Icon(Icons.broken_image_outlined)),
    ),
  );
}
