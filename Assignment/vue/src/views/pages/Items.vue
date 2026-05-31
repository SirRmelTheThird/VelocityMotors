<template>
  <div class="container mt-4">

    <h2 class="text-center mb-4">Cars</h2>

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-dark"></div>
      <p class="mt-2">Searching...</p>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-danger text-center">{{ error }}</p>

    <!-- No results -->
    <p v-if="!loading && items.length === 0 && !error" class="text-center">No Cars found.</p>

    <!-- Results -->
    <div v-if="items.length" class="row g-4 justify-content-center">
      <div v-for="item in items" :key="item.item_id" class="col-12 col-sm-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2 d-flex align-items-center">
              <i class="bi bi-car-front me-2"></i>
              <router-link :to="`/item/${item.item_id}`" class="text-decoration-none fw-semibold text-dark">{{ item.name }}</router-link>
            </h6>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Desc: {{ item.description }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Sale Ends: {{ formattedEndDate(item.end_date) }}</p>
          </div>
        </div>
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
      items: [],
      loading: false,
      error: ""
    };
  },

  // 
  created() {
    this.searchFromQuery();
  },

  // Listen for query changes
  watch: {
    '$route.query': {
      handler() {
        this.searchFromQuery();
      },
      deep: true
    }
  },

  // Methods
  methods: {
    // Function from query
    searchFromQuery() {
      const { q, status, limit, offset } = this.$route.query;

      if (!q) {
        this.items = [];
        return;
      }

      this.loading = true;
      this.error = "";
      this.items = [];

      // Search items
      coreService.searchItems({
        q,
        status,
        limit,
        offset
      })
        .then(items => {
          this.items = items;
          this.loading = false;
        })
        .catch(err => {
          this.error = err.message || "Something went wrong.";
          this.loading = false;
        });
    },
    // Changes Date To String
    formattedEndDate(stamp) {
      return new Date(stamp).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short"
      });
    }
  }
};
</script>

