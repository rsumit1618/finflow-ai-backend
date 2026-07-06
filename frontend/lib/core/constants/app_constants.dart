class AppConstants {
  static const String baseUrl = 'http://16.16.204.221:3000';

  static const int connectTimeout = 30;
  static const int receiveTimeout = 30;

  static const String register = '/api/auth/register';
  static const String login = '/api/auth/login';
  static const String profile = '/api/auth/profile';
  static const String refresh = '/api/auth/refresh';

  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
}