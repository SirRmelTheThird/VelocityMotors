<template>
  <div class="container mt-4">

    <!-- Loading -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border"></div>
      <p class="mt-2">Loading item...</p>
    </div>

    <!-- ITEM CARD -->
    <div v-if="item" class="card border-0 shadow-sm p-4 mt-5">

      <!-- FLEX LAYOUT: LEFT INFO + RIGHT ACTIONS -->
      <div class="d-flex justify-content-between align-items-start">

        <!-- LEFT SIDE -->
        <div class="flex-grow-1 pe-4">
          <h3 class="mb-3 d-flex align-items-center">
            <i class="bi bi-car-front me-2"></i>{{ item.name }}
          </h3>
          <p class="text-muted mb-1"><strong>Description:</strong> {{ item.description }}</p>
          <p class="text-muted mb-1"><strong>£</strong> {{ item.starting_bid }}</p>
          <p class="text-muted mb-1"><strong>Sale Ends:</strong> {{ formattedEndDate  }}</p>
        </div>

        <!-- RIGHT SIDE ACTIONS -->
        <div class="text-end flex-shrink-0" style="min-width: 180px;">
          <ul class="list-unstyled">
            <li class="mb-2"><router-link :to="`/item/${item.item_id}/bid`" class="text-decoration-none text-muted">View Bid History</router-link></li>
            <li><router-link to="/" class="text-decoration-none text-muted">Back to Search</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- BID FORM -->
    <div class="mt-4 p-4 rounded bg-light d-flex flex-column align-items-center">
      <h5 class="mb-3"><i class="bi bi-cash-coin me-2 text-success"></i>Place a Bid</h5>
      <div class="row g-3 align-items-center">
        <div class="col-auto"><label class="col-form-label fw-semibold">£</label></div>
        <div class="col-auto">
          <input type="number"  class="form-control" v-model="amount" min="1" placeholder="Enter your bid">
        </div>
        <div class="col-auto">
          <button class="btn btn-success" @click="submitBid":disabled="!amount"><i class="bi bi-check-circle me-1"></i>Submit Bid</button>
        </div>
      </div>
    </div>

    <!-- MESSAGE -->
    <router-link v-if="bidMessage" to="/" class="text-success fw-bold d-flex justify-content-center">{{ bidMessage }}</router-link>


    <!-- ERROR -->
    <p v-if="bidError" class="d-flex justify-content-center text-danger fw-bold">{{ bidError }}</p>


    <!-- QUESTIONS SECTION -->
    <div v-if="questions.length" class="mt-4">
      <h5 class="mb-3">Questions</h5>
      <div v-for="q in questions" :key="q.question_id" class="p-3 border rounded mb-3 bg-light">
        <p class="mb-1 fw-semibold"><i class="bi bi-question-circle me-2 text-primary"></i></p>
        <p class="mb-0 text-muted small"><strong>Question:</strong> {{ q.question_text }}</p>

        <!-- ANSWER FORM (only visible to item creator) -->
        <div v-if="isCreator" class="mt-2 p-3 bg-white border rounded">
          <div class="fw-semibold text-primary mb-2">
            <i class="bi bi-reply-fill me-2"></i>Provide an Answer</div>
            <textarea v-model="q.newAnswer"class="form-control mb-2" rows="1" placeholder="Type your answer here..."></textarea>
            <button class="btn btn-sm btn-primary"@click="submitAnswer(q)" :disabled="!q.newAnswer || submitted"><i class="bi bi-send me-1"></i>Submit Answer</button>
        </div>
        <p class="mb-0 text-muted small"><strong>Answer:</strong> {{ q.answer_text || "No answer yet" }}</p>
      </div>
    </div>

    <!-- NO QUESTIONS -->
    <div v-else class="mt-4 text-muted">
      <i class="bi bi-chat-left-dots me-1"></i>
      No questions have been asked yet.
    </div>

    <!-- ASK A QUESTION -->
    <div class="mt-4">
      <h5 class="mb-3">Ask a Question</h5>
      <div class="mb-3">
        <label for="questionInput" class="form-label fw-semibold"><i class="bi bi-pencil-square me-2 text-primary"></i>Your Question</label>
        <textarea id="questionInput" v-model="newQuestion" class="form-control" rows="3" placeholder="Type your question here..."></textarea>
      </div>
      <button class="btn btn-primary" @click="submitQuestion" :disabled="!newQuestion"><i class="bi bi-send me-1"></i>Submit Question</button>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="d-flex justify-content-center text-danger fw-bold">{{ error }}</p>

  </div>
</template>

<script>
import { coreService } from '../../services/core.service.js';
import { questionService } from '../../services/question.service.js';

export default {
  // Data
  data() {
    return {
      item: null,
      questions: [],
      error: "",
      bidError: "",
      newQuestion: "",
      amount: "",
      bidMessage: "",
      loading: true,
      submitted: false
    };
  },

  mounted() {
    const itemId = this.$route.params.id;

    // Fetch item and questions
    Promise.all([
      coreService.getItem(itemId),
      questionService.getQuestions(itemId)
    ])
      .then(([item, questions]) => {
        this.item = item;
        this.questions = questions || [];
        this.loading = false;
      })
      .catch(error => {
        this.error = error.message || "Failed to load item.";
        this.loading = false;
      });
  },

  methods: {
    // Function from questions query
    submitQuestion() {
      const questionInput = this.newQuestion.trim();
      if (!questionInput) return;

      this.submitted = true;
      this.error = null;

      const token = localStorage.getItem('session_token');

      questionService.askQuestion(
        this.item.item_id,
        { question_text: questionInput },
        token
      )
      .then(() => questionService.getQuestions(this.item.item_id))
      .then(questions => {
        this.questions = questions || [];
        this.newQuestion = "";
        this.submitted = false;
      })
      .catch(err => {
        this.error = err.message;
        this.submitted = false;
      });
    },
  // Function from answers query
  submitAnswer(q) {
    const answer = q.newAnswer.trim();
    if (!answer) return;
    this.submitted = true;

    const token = localStorage.getItem("session_token");

    questionService.answerQuestion(
      q.question_id,
      { answer_text: answer },
      token
      )
      .then(() => {
        q.answer_text = answer;  
        q.newAnswer = "";   
        this.submitted = false;
      })
      .catch(err => {
        this.error = err.message;
        this.submitted = false;
      });
    },
  // Function from bids query
  submitBid() {
    const amount = parseInt(this.amount);
    if (!amount || amount <= 0) return;

    this.submitted = true;

    coreService.bidOnItem(this.item.item_id, { amount: amount })
      .then(() => {
        this.amount = "";
        this.submitted = false;
        this.bidMessage = "Bid placed successfully!";

        setTimeout(() => {
          this.bidMessage = "";
          }, 1500);
        })
      .catch(err => {
        this.bidError = err.message;
        this.submitted = false;

        setTimeout(() => {
          this.bidError = "";
          }, 2000);
        });
      },
    },

    // Checks if user is item creator
    computed: {
      isCreator() {
        const userId = parseInt(localStorage.getItem("user_id"));
        return parseInt(this.item.creator_id) === userId;
      },

      // Changes Date To String
      formattedEndDate() {
        return new Date(this.item.end_date).toLocaleString("en-GB", {
          dateStyle: "long",
          timeStyle: "short"
        });
      }
    }
  };
</script>
