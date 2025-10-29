// Authentication System for Spotify Clone
// Uses localStorage for persistent user data

class AuthSystem {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.getCurrentUser();
    this.initializeEventListeners();
    this.checkAuthStatus();
  }

  // Load users from localStorage
  loadUsers() {
    const users = localStorage.getItem('spotifyUsers');
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  saveUsers() {
    localStorage.setItem('spotifyUsers', JSON.stringify(this.users));
  }

  // Get current logged-in user
  getCurrentUser() {
    const user = localStorage.getItem('spotifyCurrentUser');
    return user ? JSON.parse(user) : null;
  }

  // Set current user
  setCurrentUser(user) {
    localStorage.setItem('spotifyCurrentUser', JSON.stringify(user));
    this.currentUser = user;
  }

  // Clear current user (logout)
  clearCurrentUser() {
    localStorage.removeItem('spotifyCurrentUser');
    this.currentUser = null;
  }

  // Check if user is already logged in
  checkAuthStatus() {
    if (this.currentUser) {
      // Redirect to main app if already logged in
      window.location.href = 'index.html';
    }
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Form switching
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (showSignupBtn) {
      showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        this.clearErrors();
      });
    }

    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        this.clearErrors();
      });
    }

    // Login button
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Signup button
    const signupButton = document.getElementById('signupButton');
    if (signupButton) {
      signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSignup();
      });
    }

    // Enter key support
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    if (loginEmail && loginPassword) {
      [loginEmail, loginPassword].forEach(input => {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleLogin();
          }
        });
      });
    }

    const signupInputs = [
      document.getElementById('signupEmail'),
      document.getElementById('signupPassword'),
      document.getElementById('signupConfirmPassword'),
      document.getElementById('signupName')
    ];
    signupInputs.forEach(input => {
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.handleSignup();
          }
        });
      }
    });

    // Real-time validation
    const allInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
    allInputs.forEach(input => {
      input.addEventListener('input', () => {
        this.clearFieldError(input.id);
      });
    });
  }

  // Clear all error messages
  clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('error', 'success');
    });
  }

  // Clear error for specific field
  clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    const input = document.getElementById(fieldId);
    if (input) {
      input.classList.remove('error');
    }
  }

  // Show error for specific field
  showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
    const input = document.getElementById(fieldId);
    if (input) {
      input.classList.add('error');
    }
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return password.length >= 6;
  }

  // Handle login
  handleLogin() {
    this.clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    let isValid = true;

    // Validate email
    if (!email) {
      this.showError('loginEmail', 'Please enter your email or username.');
      isValid = false;
    }

    // Validate password
    if (!password) {
      this.showError('loginPassword', 'Please enter your password.');
      isValid = false;
    }

    if (!isValid) return;

    // Check credentials
    const user = this.users.find(u => 
      (u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()) && 
      u.password === password
    );

    if (user) {
      // Successful login
      const loginButton = document.getElementById('loginButton');
      loginButton.classList.add('loading');
      loginButton.textContent = '';

      setTimeout(() => {
        this.setCurrentUser({
          email: user.email,
          name: user.name,
          rememberMe: rememberMe
        });
        window.location.href = 'index.html';
      }, 800);
    } else {
      this.showError('loginPassword', 'Incorrect email or password.');
    }
  }

  // Handle signup
  handleSignup() {
    this.clearErrors();

    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const name = document.getElementById('signupName').value.trim();

    let isValid = true;

    // Validate email
    if (!email) {
      this.showError('signupEmail', 'Please enter your email.');
      isValid = false;
    } else if (!this.validateEmail(email)) {
      this.showError('signupEmail', 'Please enter a valid email address.');
      isValid = false;
    } else if (this.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      this.showError('signupEmail', 'This email is already registered.');
      isValid = false;
    }

    // Validate password
    if (!password) {
      this.showError('signupPassword', 'Please create a password.');
      isValid = false;
    } else if (!this.validatePassword(password)) {
      this.showError('signupPassword', 'Password must be at least 6 characters.');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      this.showError('signupConfirmPassword', 'Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      this.showError('signupConfirmPassword', 'Passwords do not match.');
      isValid = false;
    }

    // Validate name
    if (!name) {
      this.showError('signupName', 'Please enter a profile name.');
      isValid = false;
    } else if (name.length < 2) {
      this.showError('signupName', 'Name must be at least 2 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Create new user
    const newUser = {
      email: email,
      password: password,
      name: name,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();

    // Show success and redirect
    const signupButton = document.getElementById('signupButton');
    signupButton.classList.add('loading');
    signupButton.textContent = '';

    setTimeout(() => {
      this.setCurrentUser({
        email: newUser.email,
        name: newUser.name,
        rememberMe: true
      });
      window.location.href = 'index.html';
    }, 800);
  }
}

// Initialize auth system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AuthSystem();
});
