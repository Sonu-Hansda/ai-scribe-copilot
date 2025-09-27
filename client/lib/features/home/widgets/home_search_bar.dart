import 'package:flutter/material.dart';

class HomeSearchBar extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  const HomeSearchBar({
    super.key,
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
      child: SearchBar(
        controller: controller,
        hintText: 'Search patients or sessions',
        elevation: const WidgetStatePropertyAll(0),
        leading: Icon(Icons.search, color: scheme.onSurface.withAlpha(153)),
        trailing: [
          IconButton(
            icon: Icon(Icons.mic, color: scheme.onSurface.withAlpha(153)),
            onPressed: () {},
          ),
        ],
        onChanged: onChanged,
      ),
    );
  }
}
