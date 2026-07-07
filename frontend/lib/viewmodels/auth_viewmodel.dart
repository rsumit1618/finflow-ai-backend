import 'package:flutter/material.dart';
import '../core/services/api_service.dart';
import '../core/storage/secure_storage.dart';
import '../models/auth_model.dart';

class AuthViewModel extends ChangeNotifier {
  final ApiService _api = ApiService();

  bool _isLoading = false;
  bool _isLoggedIn = false;
  String _userName = '';
  String _userEmail = '';
  String? _errorMessage;

  bool get isLoading => _isLoading;
  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  String get userEmail => _userEmail;
  String? get errorMessage => _errorMessage;

  Future<void> checkLoginStatus() async {
    final token = await SecureStorage.getAccessToken();
    _isLoggedIn = token != null && token.isNotEmpty;
    notifyListeners();
  }

  Future<bool> register(String name, String email, String password) async {
    _setLoading(true);
    _errorMessage = null;

    final response = await _api.register(name, email, password);

    if (response.success) {
      // Auto login after registration
      final loginSuccess = await login(email, password);
      _setLoading(false);
      return loginSuccess;
    } else {
      _errorMessage = response.message ?? 'Registration failed';
      _setLoading(false);
      return false;
    }
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _errorMessage = null;

    final response = await _api.login(email, password);

    if (response.success && response.user != null) {
      _userName = response.user!.name;
      _userEmail = response.user!.email;
      _isLoggedIn = true;
      _setLoading(false);
      return true;
    } else {
      _errorMessage = response.message ?? 'Login failed';
      _setLoading(false);
      return false;
    }
  }

  Future<void> logout() async {
    await _api.logout();
    _isLoggedIn = false;
    _userName = '';
    _userEmail = '';
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}