import 'package:flutter/material.dart';

class PatientOrSessionTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final VoidCallback? onTap;

  const PatientOrSessionTile({
    super.key,
    required this.title,
    required this.subtitle,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      color: scheme.primaryContainer,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(20),
        leading: CircleAvatar(
          backgroundColor: scheme.onPrimaryContainer,
          foregroundColor: scheme.primaryContainer,
          child: Text(title.isNotEmpty ? title[0] : ''),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 17,
            color: scheme.onPrimaryContainer,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            color: scheme.onPrimaryContainer.withAlpha(
              217,
            ), // Replaced withOpacity
            fontSize: 14,
          ),
        ),
        trailing: Icon(Icons.chevron_right, color: scheme.onPrimaryContainer),
        onTap: onTap,
      ),
    );
  }
}
