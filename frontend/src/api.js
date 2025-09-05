const ACCOUNT_SERVICE_URL = 'http://localhost:8081/account';
const RESOURCE_SERVICE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    // Use sessionStorage instead of localStorage for better security
    this.token = sessionStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}, useAccountService = false) {
    const baseUrl = useAccountService ? ACCOUNT_SERVICE_URL : RESOURCE_SERVICE_URL;
    const url = `${baseUrl}${endpoint}`;
    const config = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null);
          throw new Error('Authentication failed. Please log in again.');
        }
        
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          if (error.error) {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (typeof error === 'object') {
            // Handle validation errors (field-specific errors)
            const validationErrors = Object.entries(error)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ');
            errorMessage = validationErrors || 'Validation failed';
          }
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Handle empty responses (like DELETE operations)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Return empty object for non-JSON responses
        return {};
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAllCustomers() {
    return this.request('/customers');
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: customerData
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: customerData
    });
  }

  async deleteCustomer(id) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE'
    });
  }

  // Authentication methods - use account service
  async login(email, password) {
    const response = await this.request('/token', {
      method: 'POST',
      body: { username: email, password }
    }, true); // Use account service
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(name, email, password) {
    console.log('Registration data:', { name, email, password: password ? '[HIDDEN]' : 'empty' });
    const response = await this.request('/register', {
      method: 'POST',
      body: { name, email, password }
    }, true); // Use account service
    
    // Registration now returns a JWT token, so set it automatically
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    this.setToken(null);
    return Promise.resolve({ success: true });
  }

  async checkSession() {
    if (!this.token) {
      return Promise.resolve({ isLoggedIn: false });
    }
    
    try {
      // Try to make a request to verify token is still valid
      await this.getAllCustomers();
      return { isLoggedIn: true };
    } catch (error) {
      this.setToken(null);
      return { isLoggedIn: false };
    }
  }

  // Filter methods - implement client-side filtering since backend doesn't have these endpoints
  async filterCustomersByName(name) {
    const customers = await this.getAllCustomers();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  async filterCustomersByCompany(companyName) {
    const customers = await this.getAllCustomers();
    return customers.filter(customer => 
      customer.companyName && customer.companyName.toLowerCase().includes(companyName.toLowerCase())
    );
  }

  async filterCustomersByLocation(location) {
    const customers = await this.getAllCustomers();
    return customers.filter(customer => 
      customer.location && customer.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  async filterCustomersByAttributes(attributes) {
    const customers = await this.getAllCustomers();
    return customers.filter(customer => {
      return Object.entries(attributes).every(([key, value]) => {
        if (typeof value === 'number') {
          return customer[key] === value;
        }
        return customer[key] && customer[key].toString().toLowerCase().includes(value.toString().toLowerCase());
      });
    });
  }

  // Event management methods
  async getAllEvents() {
    return this.request('/events');
  }

  async getEvent(id) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: eventData
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: { ...eventData, id }
    });
  }

  async deleteEvent(id) {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    });
  }

  // Event registration methods
  async getAllRegistrations() {
    return this.request('/registrations');
  }

  async getRegistration(id) {
    return this.request(`/registrations/${id}`);
  }

  async getRegistrationsByCustomerId(customerId) {
    return this.request(`/registrations/customer/${customerId}`);
  }

  async getRegistrationsByEventId(eventId) {
    return this.request(`/registrations/event/${eventId}`);
  }

  async createRegistration(registrationData) {
    return this.request('/registrations', {
      method: 'POST',
      body: registrationData
    });
  }

  async updateRegistration(id, registrationData) {
    return this.request(`/registrations/${id}`, {
      method: 'PUT',
      body: { ...registrationData, id }
    });
  }

  async deleteRegistration(id) {
    return this.request(`/registrations/${id}`, {
      method: 'DELETE'
    });
  }

  // Convenience methods for event registration
  async registerForEvent(customerId, eventId, eventName) {
    return this.createRegistration({
      customerId,
      eventId,
      eventName,
      status: 'registered'
    });
  }

  async unregisterFromEvent(customerId, eventId) {
    // Find the registration and delete it
    const registrations = await this.getRegistrationsByCustomerId(customerId);
    const registration = registrations.find(reg => reg.eventId === eventId);
    if (registration) {
      return this.deleteRegistration(registration.id);
    }
    throw new Error('Registration not found');
  }

  async getMyRegistrations(customerId) {
    return this.getRegistrationsByCustomerId(customerId);
  }

  // Get current user info from JWT token
  async getCurrentUser() {
    return this.request('/me', {}, true); // Use account service
  }
}

export default new ApiService();
