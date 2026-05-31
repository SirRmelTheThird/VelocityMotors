<template>
  <div class="d-flex justify-content-center align-items-center"
       style="min-height: 70vh;">

    <div class="card shadow-sm p-3" style="width: 35vw; font-size: 1.2rem;">
      <div class="d-flex justify-content-center card-header bg-dark text-white">
        <h3 class="mb-0">Register</h3>
      </div>

      <!-- Register Form -->
      <div class="card-body">
        <form @submit.prevent="handleSubmit">

          <div class="mb-4">
            <label class="form-label fw-bold">First Name</label>
            <input type="text" class="form-control form-control-lg" v-model="firstName" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Last Name</label>
            <input type="text" class="form-control form-control-lg" v-model="lastName" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Email</label>
            <input type="email" class="form-control form-control-lg" v-model="email" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Password</label>
            <input type="password" class="form-control form-control-lg" v-model="password" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Confirm Password</label>
            <input type="password" class="form-control form-control-lg" v-model="confirmedPassword" required />
          </div>

          <button type="submit" class="btn btn-primary w-100 btn-lg"> Register</button>

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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmedPassword: '',
      submitted: false,
      error: ''
    };
  },

  methods: {
    // Function from query
    handleSubmit() {
      this.submitted = true;

      const {
        firstName,
        lastName,
        email,
        password,
        confirmedPassword
      } = this;

      // Basic empty-field validation
      if (!(firstName && lastName && email && password && confirmedPassword)) {
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
        this.error =
          'Password must contain uppercase, lowercase, number, and special character.';
        return;
      }

      // Password confirmation
      if (password !== confirmedPassword) {
        this.error = "Passwords do not match.";
        return;
      }

      // Submit to backend
      userService.register({ firstName, lastName, email, password })
        .then(() => this.$router.push('/login'))
        .catch(err => this.error = err.message);
    }
  }
};
</script>