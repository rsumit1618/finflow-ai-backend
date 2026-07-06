class User {
  final int id;
  final String name;
  final String email;
  final String? createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      createdAt: json['createdAt'],
    );
  }
}

class AuthTokens {
  final String accessToken;
  final String refreshToken;

  AuthTokens({
    required this.accessToken,
    required this.refreshToken,
  });

  factory AuthTokens.fromJson(Map<String, dynamic> json) {
    return AuthTokens(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
    );
  }
}

class AuthResponse {
  final bool success;
  final String? message;
  final User? user;
  final AuthTokens? tokens;

  AuthResponse({
    required this.success,
    this.message,
    this.user,
    this.tokens,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'] ?? false,
      message: json['message'],
      user: json['data']?['user'] != null
          ? User.fromJson(json['data']['user'])
          : null,
      tokens: json['data']?['tokens'] != null
          ? AuthTokens.fromJson(json['data']['tokens'])
          : null,
    );
  }
}