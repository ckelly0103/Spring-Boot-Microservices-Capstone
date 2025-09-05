const ACCOUNT_SERVICE_URL = 'http://localhost:8081/account';
const RESOURCE_SERVICE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
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
        
        const error = await response.json().catch(() => ({ error: 'API request failed' }));
        throw new Error(error.error || error.message || 'API request failed');
      }

      return await response.json();
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
    return this.request('/register', {
      method: 'POST',
      body: { name, email, password }
    }, true); // Use account service
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
}

export default new ApiService();
