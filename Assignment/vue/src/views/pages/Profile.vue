<template>
  <!-- Tabs Navigation -->
  <ul class="nav justify-content-center my-3">
    <li class="nav-item mx-2">
      <button class="btn btn-outline-dark px-4 py-2 active" data-bs-toggle="tab" data-bs-target="#selling">Selling</button>
    </li>

    <li class="nav-item mx-2">
      <button class="btn btn-outline-dark px-4 py-2" data-bs-toggle="tab" data-bs-target="#bidding">Bids</button>
    </li>

    <li class="nav-item mx-2">
      <button class="btn btn-outline-dark px-4 py-2" data-bs-toggle="tab" data-bs-target="#history">History</button>
    </li>
  </ul>

  <div class="tab-content container mt-4 border-top-0 border-0">

  <!-- SELLING -->
  <div class="tab-pane fade show active" id="selling" role="tabpanel">

    <div v-if="profile.selling.length" class="row g-4 justify-content-center">
      <div v-for="item in profile.selling" :key="item.item_id" class="col-12 col-sm-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2 d-flex align-items-center"><i class="bi bi-car-front me-2"></i>{{ item.name }}</h6>
            <p class="text-muted small mb-1" style="font-size: 0.75rem;">Desc: {{ item.description }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Seller: {{ item.first_name }}, {{ item.last_name }}</p>
            <p class="text-muted small mb-0 " style="font-size: 0.75rem;">Ends: {{ formattedEndDate(item.end_date) }}</p>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-muted text-center">You are not selling any items.</p>
  </div>


  <!-- BIDDING -->
  <div class="tab-pane fade" id="bidding" role="tabpanel">

    <div v-if="profile.bidding_on.length" class="row g-4 justify-content-center">
      <div v-for="item in profile.bidding_on" :key="item.item_id" class="col-12 col-sm-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2 d-flex align-items-center"><i class="bi bi-hammer me-2"></i>{{ item.name }}</h6>
            <p class="text-muted small mb-1" style="font-size: 0.75rem;">Desc: {{ item.description }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Seller: {{ item.first_name }}, {{ item.last_name }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Ends: {{ formattedEndDate(item.end_date) }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted text-center">You are not bidding on any items.</p>
  </div>

  <!-- HISTORY -->
  <div class="tab-pane fade" id="history" role="tabpanel">
    <div v-if="profile.auctions_ended.length" class="row g-4 justify-content-center">
      <div v-for="item in profile.auctions_ended" :key="item.item_id" class="col-12 col-sm-6 col-md-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <h6 class="card-title mb-2 d-flex align-items-center"><i class="bi bi-clock-history me-2"></i>{{ item.name }}</h6>
            <p class="text-muted small mb-1" style="font-size: 0.75rem;">Desc: {{ item.description }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Seller: {{ item.first_name }}, {{ item.last_name }}</p>
            <p class="text-muted small mb-0" style="font-size: 0.75rem;">Ended: {{ formattedEndDate(item.end_date) }}</p>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-muted text-center">No auction history yet.</p>
  </div>
</div>
</template>

<script>
import { userService } from '../../services/user.service.js';

export default {
// Data
data() {
  return {
    profile: {
      selling: [],
      bidding_on: [],
      auctions_ended: []
    }
  };
},

mounted() {
  const userId = localStorage.getItem("user_id");

  // Fetch user profile
  userService.getUser(userId)
    .then(profile => {
    this.profile = profile;

    })
    .catch(err => console.error(err));
  },

    methods: {
    formattedEndDate(stamp) {
      return new Date(stamp).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short"
      });
    }
  }
};

</script>