import 'package:flutter/material.dart';

abstract final class AppTheme {
  static const background = Color(0xFF181818);
  static const card = Color(0xFF40404D);

  static ThemeData get dark {
    const scheme = ColorScheme.dark(
      primary: Color(0xFF6D9EFF),
      secondary: Color(0xFF9BB9FF),
      surface: background,
      error: Color(0xFFFFB4AB),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: background,
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: Colors.white,
      ),
      inputDecorationTheme: const InputDecorationTheme(
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Color(0x8CFFFFFF)),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
    );
  }
}
