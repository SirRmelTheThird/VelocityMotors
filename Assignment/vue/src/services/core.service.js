// Function to search items with optional query parameters
const searchItems = ({ q = "", status = "", limit = 20, offset = 0 } = {}) => {
  const url = new URL("http://localhost:3333/search");

  // Append query parameters if provided
  if (q) url.searchParams.append("q", q);
  if (status) url.searchParams.append("status", status);
  if (limit) url.searchParams.append("limit", parseInt(limit)) ;
  if (offset) url.searchParams.append("offset", parseInt(offset));

  return fetch(url, {
    headers: {
      "X-Authorization": localStorage.getItem("session_token")
    }
  })
    // Handle different response statuses
    .then(response => {
      if (response.status === 200) return response.json();
      if (response.status === 400) throw new Error("Please Log In");
      if (response.status === 500) throw new Error("Server error while fetching items");
      throw new Error("Failed to fetch items");
    });
};

// Function to create a new item
const createItem = (itemData) => {
    return fetch('http://localhost:3333/item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            name: itemData.name,
            description: itemData.description,
            starting_bid: itemData.starting_bid,
            end_date: itemData.end_date
          })
    })
    .then(response => {
        return response.json()
            .catch(() => ({}))
            .then(data => ({ status: response.status, data }));
    })
    .then(({ status, data }) => {

        // Handle different response statuses
        if (status === 201) {
            return data;
        }

        if (status === 400) {
            throw new Error(data.error_message || "Bad request");
        }

        if (status === 500) {
            throw new Error(data.error_message || "Server error");
        }

        throw new Error("Unexpected error");
        
    })
    .catch(error => {
        console.error("Error creating item:", error);
        return Promise.reject(error);
    });
};


// Function to get item details
const getItem = (itemId) => {
  return fetch(`http://localhost:3333/item/${itemId}`)
    .then(response => {

      // Handle different response statuses
      if (response.status === 200) {
        return response.json();
      }

      if (response.status === 404) {
        throw new Error('Item not found');
      }

      if (response.status === 500) {
        throw new Error('Server error while fetching item');
      }

      throw new Error('Failed to fetch item');
    })
    .catch(error => {
      console.error('Error fetching item:', error);
      return Promise.reject(error);
    });
};


// Function to place a bid on an item
const bidOnItem = (itemId, bidData) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem("session_token")
        },
        body: JSON.stringify(bidData)
    })
    .then(response => {
        return response.json()
            .catch(() => ({}))
            .then(data => ({ status: response.status, data }));
    })
    .then(({ status, data }) => {

        // Handle different response statuses
        if (status === 201) {
            return data;
        }
        if (status === 401) {
            throw new Error("Please Log In To Bid");
        }

        if (status === 400) {
            throw new Error(data.error_message || "Bad request");
        }

        if (status === 403) {
            throw new Error('Cannot bid on your own item');
        }

        if (status === 404) {
            throw new Error('Item does not exist');
        }

        if (status === 500) {
            throw new Error('Server error while placing bid');
        }

        throw new Error('Failed to place bid');
    })
    .catch(error => {
        console.error('Error placing bid:', error);
        return Promise.reject(error);
    });
};

// Function to get bid history for an item
const getBidHistory = (itemId) => {
    return fetch(`http://localhost:3333/item/${itemId}/bid`)
    .then(response => {

      // Handle different response statuses
        if (response.status === 200) {
            return response.json();
        }

        if (response.status === 403) {
            throw new Error('Cannot view bid history for your own item');
        }

        if (response.status === 404) {
            throw new Error('Auction not found');
        }

        if (response.status === 500) {
            throw new Error('Server error while fetching bid history');
        }

        throw new Error('Failed to fetch bid history');
    })
    .catch(error => {
        console.error('Error fetching bid history:', error);
        return Promise.reject(error);
    });
};

// Exporting the core service functions
export const coreService = { 
    searchItems, 
    createItem,
    getItem, 
    bidOnItem,
    getBidHistory

}

