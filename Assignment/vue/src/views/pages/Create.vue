<template>
  <div class="d-flex justify-content-center align-items-center" style="min-height: 70vh;">
    <div class="card shadow-sm p-3" style="width: 35vw; font-size: 1.2rem;">
      <div class="d-flex justify-content-center card-header bg-dark text-white">
        <h3 class="mb-0">Sell Your Car</h3>
      </div>

      <!-- Sell Form -->
      <div class="card-body">
        <form @submit.prevent="handleSubmit">

          <div class="mb-4">
            <label class="form-label fw-bold">Item Name</label>
            <input type="text" class="form-control form-control-lg" v-model="name" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Description</label>
            <textarea class="form-control form-control-lg" v-model="description" rows="4" required></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Starting Bid (£)</label>
            <input type="number" class="form-control form-control-lg" v-model.number="starting_bid" min="1" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">End Date</label>
            <input type="datetime-local" class="form-control form-control-lg" v-model="end_date" required />
          </div>

          <button type="submit" class="btn btn-primary w-100 btn-lg">Sell</button>

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
import { coreService } from '../../services/core.service.js';

export default {
  // Data
  data() {
    return {
      name: '',
      description: '',
      starting_bid: null,
      end_date: '',
      submitted: false,
      error: ''
    };
  },

  methods: {
    handleSubmit() {
      this.submitted = true;

      const { name, description, starting_bid, end_date } = this;

      // Basic empty-field validation
      if (!(name && description && starting_bid && end_date)) {
        this.error = "Please fill in all fields.";
        return;
      }

      // Starting bid must be >= 1
      if (starting_bid < 1) {
        this.error = "Starting bid must be at least £1.";
        return;
      }

      // End date must be in the future
      const now = new Date();
      const end = new Date(end_date);

      if (end <= now) {
        this.error = "End date must be in the future.";
        return;
      }

      // Submit to backend
      coreService.createItem({name, description, starting_bid, end_date })
        .then(() => this.$router.push('/'))
        .catch(err => this.error = err.message);
    }
  }
};
</script>
