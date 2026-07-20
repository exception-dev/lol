class Skin {
  const Skin({
    required this.id,
    required this.number,
    required this.name,
    required this.hasChromas,
    this.parentSkin,
  });

  final String id;
  final int number;
  final String name;
  final bool hasChromas;
  final int? parentSkin;
}
