export const loginSelectors = {
  emailInput: 'input[type="email"], input[name="email"], #email',
  passwordInput: 'input[type="password"], input[name="password"], #password',
  loginButton: 'button[type="submit"], input[type="submit"], .login-button, #login-button',
  errorMessage: '.error-message, .alert-error, .login-error',
  successMessage: '.success-message, .alert-success'
};

export const pageSelectors = {
  body: 'body',
  mainContent: 'main, .main-content, #main',
  
  navigation: 'nav, .navigation, #navigation',
  
  form: 'form',
  input: 'input',
  button: 'button',
  
  loading: '.loading, .spinner, [data-loading]',
  error: '.error, .alert, .message-error',
  success: '.success, .alert-success, .message-success'
}; 