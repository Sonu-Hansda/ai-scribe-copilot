import 'package:ai_scribe_copilot/features/home/ui/home_screen.dart';
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Scribe Copilot',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0D47A1),
          primary: const Color(0xFF0D47A1),
          onPrimary: Colors.white,
          surface: const Color(0xFFF5F7FA),
          onSurface: const Color(0xFF121212),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
