import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/home_viewmodel.dart';
import '../viewmodels/auth_viewmodel.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _countController = TextEditingController(text: '10');

  @override
  Widget build(BuildContext context) {
    final authViewModel = context.watch<AuthViewModel>();
    final homeViewModel = context.watch<HomeViewModel>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('🏠 FinFlow AI'),
        backgroundColor: Colors.deepPurple,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8),
            child: Text(
              '👋 ${authViewModel.userName}',
              style: const TextStyle(color: Colors.white),
            ),
          ),
          IconButton(
            onPressed: () => authViewModel.logout(),
            icon: const Icon(Icons.logout, color: Colors.white),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ============================================================
              // STATS CARD
              // ============================================================
              Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const Text(
                        '📊 API Stats',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildStat('✅', homeViewModel.successCount, Colors.green),
                          _buildStat('❌', homeViewModel.failureCount, Colors.red),
                          _buildStat('⏱️', '${homeViewModel.avgTime}ms', Colors.blue),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ============================================================
              // QUICK TEST BUTTONS
              // ============================================================
              const Text(
                '⚡ Quick API Tests',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _buildQuickButton(
                      label: '📡 Profile',
                      color: Colors.blue,
                      onTap: homeViewModel.isLoading ? null : homeViewModel.callSingleApi,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildQuickButton(
                      label: '🔥 10 Calls',
                      color: Colors.orange,
                      onTap: homeViewModel.isLoading
                          ? null
                          : () => homeViewModel.testPerformance(10),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _buildQuickButton(
                      label: '🚀 100 Calls',
                      color: Colors.purple,
                      onTap: homeViewModel.isLoading
                          ? null
                          : () => homeViewModel.testPerformance(100),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildQuickButton(
                      label: '💥 1000 Calls',
                      color: Colors.red,
                      onTap: homeViewModel.isLoading
                          ? null
                          : () => homeViewModel.testPerformance(1000),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: _buildQuickButton(
                      label: '⚡ 10K Load Test',
                      color: Colors.deepOrange,
                      onTap: homeViewModel.isLoading
                          ? null
                          : () => homeViewModel.testPerformance(10000),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildQuickButton(
                      label: '🔄 Clear Stats',
                      color: Colors.grey,
                      onTap: homeViewModel.isLoading
                          ? null
                          : () {
                        homeViewModel.clearStats();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Stats Cleared!')),
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              // Quick Test Buttons ke neechay
              Row(
                children: [
                  Expanded(
                    child: _buildQuickButton(
                      label: '⏹️ Stop',
                      color: Colors.red,
                      onTap: () {
                        // API call cancel karo
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('⏹️ API calls stopped!')),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _buildQuickButton(
                      label: '🔄 Reset App',
                      color: Colors.black87,
                      onTap: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => const HomeScreen()),
                        );
                      },
                    ),
                  ),
                ],
              ),

              // ============================================================
              // CUSTOM COUNT TEST
              // ============================================================
              const Text(
                '🎯 Custom Count Test',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _countController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: 'Enter count',
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: homeViewModel.isLoading
                        ? null
                        : () {
                      final count = int.tryParse(_countController.text) ?? 10;
                      homeViewModel.testPerformance(count);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                    ),
                    child: const Text('▶️ Run'),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // ============================================================
              // PROGRESS INDICATOR
              // ============================================================
              if (homeViewModel.isLoading) ...[
                const LinearProgressIndicator(),
                const SizedBox(height: 8),
                const Text(
                  '⏳ Loading... Please wait',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 8),
              ],

              // ============================================================
              // RESULT CARD
              // ============================================================
              Card(
                elevation: 2,
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
                      Container(
                        height: 150,
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: SingleChildScrollView(
                          child: Text(
                            homeViewModel.result.isEmpty
                                ? 'Press any button to test API...'
                                : homeViewModel.result,
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                      ),
                      if (homeViewModel.debugInfo.isNotEmpty) ...[
                        const Divider(),
                        const Text(
                          '🐞 Debug:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: SingleChildScrollView(
                            child: Text(
                              homeViewModel.debugInfo,
                              style: const TextStyle(fontSize: 10, color: Colors.red),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // ============================================================
  // WIDGET: Stat Builder
  // ============================================================
  Widget _buildStat(String icon, dynamic value, Color color) {
    return Column(
      children: [
        Text(
          icon,
          style: const TextStyle(fontSize: 24),
        ),
        Text(
          value.toString(),
          style: TextStyle(
            color: color,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  // ============================================================
  // WIDGET: Quick Button
  // ============================================================
  Widget _buildQuickButton({
    required String label,
    required Color color,
    VoidCallback? onTap,
  }) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 13,
        ),
      ),
    );
  }
}