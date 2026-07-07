import 'package:flutter/material.dart';

class ResultCard extends StatelessWidget {
  final String result;
  final String? debugInfo;

  const ResultCard({
    Key? key,
    required this.result,
    this.debugInfo,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '📝 Response:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  result.isEmpty ? 'Click a button to test...' : result,
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ),
            if (debugInfo != null && debugInfo!.isNotEmpty) ...[
              const Divider(),
              const Text(
                '🐞 Debug:',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
              ),
              const SizedBox(height: 4),
              Text(
                debugInfo!,
                style: const TextStyle(fontSize: 10, color: Colors.red),
              ),
            ],
          ],
        ),
      ),
    );
  }
}