<template>
  <div class="container mt-4">

    <!-- Loading -->
    <div v-if="loading" class="text-center">
        <div class="spinner-border"></div>
        <p class="mt-2">Loading bid history...</p>
    </div>

    <!-- Bid History Card -->
    <div v-if="!loading && !error" class="card border-0 shadow-sm p-4 mt-4">
        <h3 class="mb-3 d-flex align-items-center"><i class="bi bi-clock-history me-2"></i>Bid History</h3>

      <!-- No Bids -->
      <p v-if="bids.length === 0" class="text-muted">No bids have been placed yet.</p>

      <!-- Bids List -->
    <ul v-else class="list-group list-group-flush">
        <li v-for="bid in bids" :key="bid.bid_id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>£{{ bid.amount }}</strong><br/>
                <small class="text-muted">{{ bid.first_name[0] }}, {{ bid.last_name }}</small><br/>
                <small class="text-muted">{{ formattedEndDate(bid.timestamp) }}</small>
            </div>

          <span class="badge bg-dark">Bidder{{ bid.bidder_id }}</span>
        </li>
    </ul>

    <!-- Back Button -->
    <div class="mt-4">
        <router-link :to="`/item/${itemId}`" class="btn btn-outline-dark">Back to Item</router-link>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>

    </div>

  </div>
</template>

<script>
import { coreService } from '../../services/core.service.js';

export default {
// Data
  data() {
    return {
      bids: [],
      loading: true,
      error: "",
      itemId: null
    };
  },

  mounted() {
    this.itemId = this.$route.params.id;

    coreService.getBidHistory(this.itemId)
      .then(bids => {
        this.bids = bids || [];
        this.loading = false;
      })
      .catch(err => {
        this.error = err.message || "Failed to load bid history.";
        this.loading = false;
      });
  },

  methods: {
    // Format date to string
    formattedEndDate(stamp) {
      return new Date(stamp).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short"
      });
    }
  }
};
</script>
