// Function to register a new user
const register = (userData) => {
  return fetch('http://localhost:3333/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password
      })
  })
    // Handle different response statuses
  .then(async response => {
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error_message || 'Failed to create account');
      }
  });
};

// Function to login the user
const login = (credentials) => {
  return fetch('http://localhost:3333/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(response => {
    return response.json()
      .catch(() => ({})) 
      .then(data => {

        if (response.status === 200) {
          return data;
        }

        if (response.status === 400) {
          throw new Error(data.error_message || 'User Not Found');
        }

        throw new Error('Failed to login');
      });
  })
  .catch(error => {
    console.error('Error logging in:', error);
    return Promise.reject(error);
  });
};


// Function to logout the user
const logout = () => {
    return fetch('http://localhost:3333/logout', {
        method: 'POST',
        headers: {
            'X-Authorization': localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if (response.status === 200) {
            return response.json();
        }

        if (response.status === 500) {
            throw new Error('Server error while logging out');
        }

        throw new Error('Failed to logout');
    })
    .catch(error => {
        console.error('Error logging out:', error);
        return Promise.reject(error);
    });
};

// Function to get user details
const getUser = (userId) => {
    return fetch(`http://localhost:3333/users/${userId}`)
    .then(response => {
        // Handle different response statuses
        if (response.status === 200) {
            return response.json();
        }

        if (response.status === 404) {
            throw new Error('User not found');
        }

        throw new Error('Failed to fetch user');
    })
    .catch(error => {
        console.error('Error fetching user:', error);
        return Promise.reject(error);
    });
};

// user.services.js

export const validateToken = () => {
    const token = localStorage.getItem('session_token');
    if (!token) {
        return Promise.resolve(false);
    }

    return fetch('http://localhost:3333/logout', {
        method: 'POST',
        headers: {
            'X-Authorization': token
        }
    })
    .then(response => {
        // Token valid → backend returns 200
        if (response.status === 200) {
            return true;
        }

        // Token invalid, expired, or user deleted → backend returns 401
        if (response.status === 401) {
            localStorage.removeItem('session_token');
            return false;
        }

        // Any other status = unexpected
        throw new Error('Unexpected response while validating token');
    })
    .catch(error => {
        console.error('Error validating token:', error);
        return false;
    });
};


// Exporting the user service functions
export const userService = {
    register,
    login,
    logout,
    getUser,
    validateToken
};
