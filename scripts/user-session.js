// User Session Management
// Handles user profile display and logout functionality

class UserSession {
  constructor() {
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  getCurrentUser() {
    const user = localStorage.getItem('spotifyCurrentUser');
    return user ? JSON.parse(user) : null;
  }

  init() {
    // Check if user is logged in
    if (!this.currentUser) {
      window.location.href = 'auth.html';
      return;
    }

    // Display user name
    this.displayUserInfo();

    // Setup event listeners
    this.setupEventListeners();
  }

  displayUserInfo() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && this.currentUser) {
      userNameElement.textContent = this.currentUser.name;
    }
  }

  setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');

    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.logout();
      });
    }
  }

  logout() {
    // Clear current user session
    localStorage.removeItem('spotifyCurrentUser');
    
    // Optional: Clear other session data if needed
    // localStorage.removeItem('crrSong');
    // localStorage.removeItem('crrDuration');
    
    // Redirect to auth page
    window.location.href = 'auth.html';
  }
}

// Initialize user session when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new UserSession();
});
