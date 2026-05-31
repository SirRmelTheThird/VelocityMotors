<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Search Items</h2>

    <form @submit.prevent="handleSearch" class="row g-2 justify-content-center">

      <!-- Search Query -->
      <div class="col-12 col-md-4">
        <input type="text" v-model="query" class="form-control form-control-lg" placeholder="Search by item name..."/>
      </div>

      <!-- Status Filter -->
      <div class="col-12 col-md-2">
        <select v-model="status" class="form-select form-select-lg">
          <option value="" disabled="">None</option>
          <option value="BID">Bids</option>
          <option value="OPEN">Active Listings</option>
          <option value="ARCHIVE">Ended Listings</option>
        </select>
      </div>

      <!-- Limit -->
      <div class="col-6 col-md-1">
        <input type="number" v-model.number="limit" class="form-control form-control-lg" min="1"placeholder="Max"
        />
      </div>

      <!-- Offset -->
      <div class="col-6 col-md-1">
        <input type="number" v-model.number="offset" class="form-control form-control-lg" min="0"placeholder="Min"/>
      </div>

      <!-- Submit Button -->
      <div class="col-6 col-md-2">
        <button class="btn btn-primary btn-lg" type="submit">Search</button>
      </div>

    </form>
  </div>
</template>

<!-- Script -->
<script>
export default {
  data() {
    return {
      query: '',
      limit: null,
      offset: null,
      status: ''
    };
  },

  // Search Parameters
  methods: {
    handleSearch() {
      if (!this.query.trim()) return;

      this.$router.push({
        name: "items",
        query: { 
          q: (this.query).toString().trim(),
          limit: this.limit || "",
          offset: this.offset || "",
          status: this.status || ""
        }
      });
    }
  }
};
</script>
