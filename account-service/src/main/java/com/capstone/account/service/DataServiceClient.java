package com.capstone.account.service;

import com.capstone.account.model.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

@Service
public class DataServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${data.service.url}")
    private String dataServiceUrl;
    
    @Value("${data.service.customer.endpoint}")
    private String customerEndpoint;
    
    public DataServiceClient() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Create a new customer in the Data Service
     */
    public Customer createCustomer(Customer customer) {
        try {
            String url = dataServiceUrl + customerEndpoint;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Customer> request = new HttpEntity<>(customer, headers);
            
            ResponseEntity<Customer> response = restTemplate.postForEntity(url, request, Customer.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to create customer in Data Service: " + e.getMessage(), e);
        }
    }
    
    /**
     * Get all customers from the Data Service
     */
    @SuppressWarnings("unchecked")
    public List<Customer> getAllCustomers() {
        try {
            String url = dataServiceUrl + customerEndpoint;
            
            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to retrieve customers from Data Service: " + e.getMessage(), e);
        }
    }
    
    /**
     * Find customer by email
     */
    public Customer findCustomerByEmail(String email) {
        try {
            List<Customer> customers = getAllCustomers();
            return customers.stream()
                    .filter(customer -> email.equals(customer.getEmail()))
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to find customer by email: " + e.getMessage(), e);
        }
    }
    
    /**
     * Check if a customer exists by email
     */
    public boolean customerExistsByEmail(String email) {
        return findCustomerByEmail(email) != null;
    }
}
