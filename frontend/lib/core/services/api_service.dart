import 'package:dio/dio.dart';
import '../../models/auth_model.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';

class ApiService {
  final Dio _dio = Dio();
  bool _isRefreshing = false;

  ApiService() {
    _dio.options.baseUrl = AppConstants.baseUrl;
    _dio.options.connectTimeout = Duration(seconds: AppConstants.connectTimeout);
    _dio.options.receiveTimeout = Duration(seconds: AppConstants.receiveTimeout);

    _dio.interceptors.add(LogInterceptor(
      request: true,
      requestBody: true,
      responseBody: true,
      error: true,
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await SecureStorage.getAccessToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) => handler.next(response),
      onError: (error, handler) async {
        if (error.response?.statusCode == 401 && !_isRefreshing) {
          _isRefreshing = true;
          try {
            final refreshToken = await SecureStorage.getRefreshToken();
            if (refreshToken != null) {
              final response = await _dio.post(
                AppConstants.refresh,
                data: {'refreshToken': refreshToken},
              );
              if (response.statusCode == 200) {
                final newToken = response.data['data']['accessToken'];
                await SecureStorage.saveAccessToken(newToken);
                error.requestOptions.headers['Authorization'] =
                'Bearer $newToken';
                final retryResponse = await _dio.fetch(error.requestOptions);
                _isRefreshing = false;
                return handler.resolve(retryResponse);
              }
            }
          } catch (e) {
            await SecureStorage.clearTokens();
            _isRefreshing = false;
          }
        }
        _isRefreshing = false;
        return handler.next(error);
      },
    ));
  }

  Future<AuthResponse> register(String name, String email, String password) async {
    try {
      final response = await _dio.post(
        AppConstants.register,
        data: {'name': name, 'email': email, 'password': password},
      );
      return AuthResponse.fromJson(response.data);
    } on DioException catch (e) {
      return AuthResponse(
        success: false,
        message: e.response?.data['message'] ?? e.message,
      );
    }
  }

  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await _dio.post(
        AppConstants.login,
        data: {'email': email, 'password': password},
      );
      final authResponse = AuthResponse.fromJson(response.data);
      if (authResponse.success && authResponse.tokens != null) {
        await SecureStorage.saveAccessToken(authResponse.tokens!.accessToken);
        await SecureStorage.saveRefreshToken(authResponse.tokens!.refreshToken);
      }
      return authResponse;
    } on DioException catch (e) {
      return AuthResponse(
        success: false,
        message: e.response?.data['message'] ?? e.message,
      );
    }
  }

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dio.get(AppConstants.profile);
      return {'success': true, 'data': response.data};
    } on DioException catch (e) {
      return {
        'success': false,
        'message': e.response?.data['message'] ?? e.message,
      };
    }
  }

  Future<Map<String, dynamic>> testPerformance(int count) async {
    int success = 0;
    int failure = 0;
    List<int> responseTimes = [];

    for (int i = 0; i < count; i++) {
      try {
        final start = DateTime.now();
        await _dio.get(AppConstants.profile);
        final end = DateTime.now();
        responseTimes.add(end.difference(start).inMilliseconds);
        success++;
      } catch (e) {
        failure++;
      }
    }

    final avgTime = responseTimes.isNotEmpty
        ? responseTimes.reduce((a, b) => a + b) ~/ responseTimes.length
        : 0;

    return {
      'total': count,
      'success': success,
      'failure': failure,
      'avgResponseTime': avgTime,
    };
  }

  Future<Map<String, dynamic>> callApi() async {
    try {
      final start = DateTime.now();
      final response = await _dio.get(AppConstants.profile);
      final duration = DateTime.now().difference(start).inMilliseconds;
      return {
        'success': true,
        'data': response.data,
        'duration': duration,
      };
    } on DioException catch (e) {
      return {
        'success': false,
        'message': e.response?.data['message'] ?? e.message,
      };
    }
  }

  Future<void> logout() async {
    await SecureStorage.clearTokens();
  }
}