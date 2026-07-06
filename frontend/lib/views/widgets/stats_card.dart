import 'package:flutter/material.dart';

class StatsCard extends StatelessWidget {
  final int successCount;
  final int failureCount;
  final int avgTime;

  const StatsCard({
    Key? key,
    required this.successCount,
    required this.failureCount,
    required this.avgTime,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text(
              '📊 API Stats',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStat('✅ $successCount', Colors.green),
                _buildStat('❌ $failureCount', Colors.red),
                _buildStat('$avgTime ms', Colors.blue),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String text, Color color) {
    return Column(
      children: [
        Text(
          text,
          style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const Text(''),
      ],
    );
  }
}