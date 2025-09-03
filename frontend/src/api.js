const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
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

  async filterCustomersByName(name) {
    return this.request('/customers/filter/name/', {
      method: 'POST',
      body: { name }
    });
  }

  async filterCustomersByCompany(companyName) {
    return this.request('/customers/filter/company/', {
      method: 'POST',
      body: { companyName }
    });
  }

  async filterCustomersByLocation(location) {
    return this.request('/customers/filter/location/', {
      method: 'POST',
      body: { location }
    });
  }

  async filterCustomersByAttributes(attributes) {
    return this.request('/customers/attributes', {
      method: 'POST',
      body: attributes
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async createUser(name, email, password) {
    return this.request('/users', {
      method: 'POST',
      body: { name, email, password }
    });
  }

  async checkSession() {
    return this.request('/auth/check');
  }
}

export default new ApiService();
