import 'package:flutter/material.dart';
import '../core/services/api_service.dart';

class HomeViewModel extends ChangeNotifier {
  final ApiService _api = ApiService();

  bool _isLoading = false;
  int _successCount = 0;
  int _failureCount = 0;
  int _avgTime = 0;
  String _result = '';
  String _debugInfo = '';

  bool _rateLimitEnabled = true;

  bool get isLoading => _isLoading;
  int get successCount => _successCount;
  int get failureCount => _failureCount;
  int get avgTime => _avgTime;
  String get result => _result;
  String get debugInfo => _debugInfo;
  bool get rateLimitEnabled => _rateLimitEnabled;

  // ============================================================
  // CLEAR STATS
  // ============================================================
  void clearStats() {
    _successCount = 0;
    _failureCount = 0;
    _avgTime = 0;
    _result = '';
    _debugInfo = '';
    notifyListeners();
  }

  // ============================================================
  // TOGGLE RATE LIMIT
  // ============================================================
  void toggleRateLimit(bool value) {
    _rateLimitEnabled = value;
    notifyListeners();
  }

  // ============================================================
  // SINGLE API CALL
  // ============================================================
  Future<void> callSingleApi() async {
    _reset();
    _setLoading(true);

    final result = await _api.callApi();

    if (result['success']) {
      _successCount = 1;
      _result = '✅ Response:\n${result['data']}';
      _avgTime = result['duration'] ?? 0;
    } else {
      _failureCount = 1;
      _result = '❌ Error: ${result['message']}';
    }
    _debugInfo = result.toString();
    _setLoading(false);
  }

  // ============================================================
  // SEQUENTIAL PERFORMANCE TEST
  // ============================================================
  Future<void> testPerformance(int count) async {
    _reset();
    _setLoading(true);

    try {
      final result = await _api.testPerformance(count).timeout(
        const Duration(seconds: 300),
        onTimeout: () {
          return {
            'success': 0,
            'failure': count,
            'avgResponseTime': 0,
            'total': count,
            'errors': ['Timeout after 300 seconds']
          };
        },
      );

      _successCount = result['success'] ?? 0;
      _failureCount = result['failure'] ?? 0;
      _avgTime = result['avgResponseTime'] ?? 0;
      _result = '✅ Success: ${result['success']}\n'
          '❌ Failure: ${result['failure']}\n'
          '⏱️ Avg: ${result['avgResponseTime']}ms\n'
          '📊 Total: ${result['total']}';
      _debugInfo = result['errors']?.join('\n') ?? '';
    } catch (e) {
      _result = '❌ Error: $e';
      _failureCount = count;
      _debugInfo = e.toString();
    }

    _setLoading(false);
  }

  // ============================================================
  // PARALLEL PERFORMANCE TEST (WITH BYPASS)
  // ============================================================
  Future<void> testPerformanceParallel(int count, {bool bypass = false}) async {
    _reset();
    _setLoading(true);

    try {
      final result = await _api.testPerformanceParallel(count, bypass: bypass).timeout(
        const Duration(seconds: 300),
        onTimeout: () {
          return {
            'success': 0,
            'failure': count,
            'avgResponseTime': 0,
            'total': count,
            'errors': ['Timeout after 300 seconds']
          };
        },
      );

      _successCount = result['success'] ?? 0;
      _failureCount = result['failure'] ?? 0;
      _avgTime = result['avgResponseTime'] ?? 0;
      _result = '✅ Success: ${result['success']}\n'
          '❌ Failure: ${result['failure']}\n'
          '⏱️ Avg: ${result['avgResponseTime']}ms\n'
          '📊 Total: ${result['total']}';
      _debugInfo = result['errors']?.join('\n') ?? '';
    } catch (e) {
      _result = '❌ Error: $e';
      _failureCount = count;
      _debugInfo = e.toString();
    }

    _setLoading(false);
  }

  // ============================================================
  // 500 ERROR TEST (SENTRY)
  // ============================================================
  Future<void> test500Error() async {
    _reset();
    _setLoading(true);

    try {
      final result = await _api.test500Error();
      if (result['success']) {
        _result = '✅ Response:\n${result['data']}';
      } else {
        _result = '❌ 500 Error: ${result['message']}\n'
            'Status Code: ${result['statusCode']}';
      }
      _debugInfo = result.toString();
    } catch (e) {
      _result = '❌ Error: $e';
    }

    _setLoading(false);
  }

  // ============================================================
  // HELPERS
  // ============================================================
  void _reset() {
    _successCount = 0;
    _failureCount = 0;
    _avgTime = 0;
    _result = '';
    _debugInfo = '';
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}