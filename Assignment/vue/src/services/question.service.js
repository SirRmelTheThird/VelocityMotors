//  Function to get questions for a specific item
const getQuestions = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`)
    .then(response => {
        if (response.status === 200) {
        return response.json();
        }

        if (response.status === 404) {
            return [];
        }

        throw new Error('Failed to fetch item');
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
        return Promise.reject(error);
    });
};

// Function to ask a question about an item
const askQuestion = (itemId, questionData) => {
    return fetch(`http://localhost:3333/item/${itemId}/question`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem("session_token")
        },
        body: JSON.stringify(questionData)
    })
    // Handle different response statuses
    .then(response => {
    return response.json()
    .catch(() => ({}))
    .then(data => {
        if (response.ok) {
            return data;
        }

        if (response.status === 400) {
            throw new Error(data.error_message || "Invalid question");
        }

        if (response.status === 401) {
            throw new Error("Please log in to ask a question");
        }

        if (response.status === 403) {
            throw new Error("You cannot ask a question on your own item");
        }

        if (response.status === 404) {
            throw new Error("Item not found");
        }

        if (response.status === 500) {
            throw new Error("Server error — please try again later");
        }

        throw new Error("Failed to ask question");
    });
    })
    .catch(error => {
        console.error("Error asking question:", error);
        return Promise.reject(error);
    });
};

// Function to answer a question
const answerQuestion = (questionId, answerData) => {
    return fetch(`http://localhost:3333/question/${questionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem("session_token")
        },
        body: JSON.stringify(answerData)
    })
    // Handle different response statuses
    .then(response => {
        if (response.status === 200 || response.status === 201) {
            return response.json();
        } else {
            throw new Error('Failed to answer question');
        }
    })
    .catch(error => {
        console.error('Error answering question:', error);
        return Promise.reject(error);
    });
};

// Exporting the question service functions
export const questionService = {
    getQuestions,
    askQuestion,
    answerQuestion
};