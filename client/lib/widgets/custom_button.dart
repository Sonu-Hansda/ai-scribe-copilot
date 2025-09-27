import 'package:flutter/material.dart';

class AppButton extends StatelessWidget {
  const AppButton.primary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.width,
    this.height = 48,
  }) : _style = _ButtonStyle.primary;

  const AppButton.secondary({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.width,
    this.height = 48,
  }) : _style = _ButtonStyle.secondary;

  const AppButton.text({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.width,
    this.height = 48,
  }) : _style = _ButtonStyle.text;

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final double? width;
  final double height;
  final _ButtonStyle _style;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    final foreground = _style == _ButtonStyle.primary
        ? Colors.white
        : _style == _ButtonStyle.secondary
        ? scheme.primary
        : scheme.primary;

    final background = _style == _ButtonStyle.primary
        ? scheme.primary
        : Colors.transparent;

    final side = _style == _ButtonStyle.secondary
        ? BorderSide(color: scheme.primary, width: 1.5)
        : BorderSide.none;

    final button = SizedBox(
      width: width,
      height: height,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: background,
          foregroundColor: foreground,
          side: side,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 20),
              const SizedBox(width: 8),
            ],
            Text(label),
          ],
        ),
      ),
    );

    return _style == _ButtonStyle.text
        ? TextButton(
            onPressed: onPressed,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (icon != null) ...[
                  Icon(icon, size: 20, color: foreground),
                  const SizedBox(width: 8),
                ],
                Text(label, style: TextStyle(color: foreground)),
              ],
            ),
          )
        : button;
  }
}

enum _ButtonStyle { primary, secondary, text }
