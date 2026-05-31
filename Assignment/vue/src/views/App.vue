<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-3 py-2">
      <div class="container-fluid d-flex justify-content-between align-items-center">

        <!-- Brand -->
        <router-link class="navbar-brand fs-6" to="/"><i class="bi bi-car-front"></i> Velocity Motors</router-link>

        <!-- Menu -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">

          <!-- NOT Logged IN -->
          <ul class="navbar-nav d-flex small" v-if="!isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Sign Up</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </ul>

          <!-- Logged IN -->
          <ul class="navbar-nav d-flex small" v-else>

            <!-- Profile Dropdown -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-person-circle me-1"></i> Profile</a>

              <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="profileDropdown">
                <li>
                  <router-link class="dropdown-item d-flex align-items-center" to="/profile"><i class="bi bi-person-circle me-2"></i> View Profile</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item d-flex align-items-center" to="/create"><i class="bi bi-plus-square me-2"></i> Add Item</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item d-flex align-items-center" to="/logout"><i class="bi bi-box-arrow-right me-2"></i> Logout</router-link>
                </li>
              </ul>
            </li>
          </ul>

        </div>
      </div>
    </nav>

    <router-view />
  </div>
</template>
<script>
// import { validateToken } from '../services/user.service.js';

export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('session_token')
    };
  },

  created() {
    // Listen for login/logout events
    window.addEventListener('login', () => {
      this.isLoggedIn = true;
    });

    window.addEventListener('logout', () => {
      this.isLoggedIn = false;
    });

    // Validate token with backend on app load
    // validateToken().then(valid => {
    //   if (!valid) {
    //     localStorage.removeItem('session_token');
    //     this.isLoggedIn = false;
    //     window.dispatchEvent(new Event('logout'));
    //   }
    // });
  }
};
</script>

