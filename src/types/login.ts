export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginSelectors {
  emailInput: string;
  passwordInput: string;
  loginButton: string;
  errorMessage: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  error?: string;
} 