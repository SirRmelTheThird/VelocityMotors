<template>
  <div class="d-flex justify-content-center align-items-center"
       style="min-height: 50vh;">

    <div class="card shadow-sm p-3" style="width: 35vw; font-size: 1.2rem;">
      <div class="d-flex justify-content-center card-header bg-dark text-white">
        <h3 class="mb-0">Login</h3>
      </div>

      <!-- Login Form-->
      <div class="card-body">
        <form @submit.prevent="handleSubmit">

          <div class="mb-4">
            <label class="form-label fw-bold">Email</label>
            <input type="email" class="form-control form-control-lg" v-model="email" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Password</label>
            <input type="password" class="form-control form-control-lg" v-model="password" required />
          </div>

          <button type="submit" class="btn btn-primary w-100 btn-lg">Login</button>

          <!-- Error -->
          <div class="mt-3">
            <span v-if="error" class="d-flex justify-content-center text-danger fw-bold">{{ error }}</span>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>


<script>
import emailValidator from 'email-validator';
import { userService } from '../../services/user.service.js';

export default {
  // Data
  data() {
    return {
      email: '',
      password: '',
      submitted: false,
      error: ''
    };
  },

  methods: {
    handleSubmit() {
      this.submitted = true;
      const { email, password } = this;

      // Basic empty-field validation
      if (!(email && password)) {
        this.error = "Please fill in all fields.";
        return;
      }

      // Email validation
      if (!emailValidator.validate(email)) {
        this.error = 'Invalid Email';
        return;
      }

      // Password validation
      const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/;
      if (!pattern.test(password)) {
        this.error = 'Invalid Password';
        return;
      }

      // Submit to backend
      userService.login({email: this.email, password: this.password})
        .then(data => {
          localStorage.setItem('session_token', data.session_token);
          localStorage.setItem('user_id', data.user_id);
          window.dispatchEvent(new Event('login'));
          this.$router.push('/');
        })
        .catch(err => this.error = err.message);
    }
  }
};
</script>
