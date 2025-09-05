package com.capstone.account.service;

import com.capstone.account.dto.CustomerRegistrationRequest;
import com.capstone.account.dto.JwtResponse;
import com.capstone.account.dto.LoginRequest;
import com.capstone.account.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
    
    @Autowired
    private DataServiceClient dataServiceClient;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Register a new customer and return JWT token
     */
    public JwtResponse registerCustomer(CustomerRegistrationRequest request) {
        // Create new customer with encoded password (skip duplicate check for now)
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Save customer via Data Service
        Customer savedCustomer = dataServiceClient.createCustomer(customer);
        
        // Generate JWT token for the newly registered customer
        String token = jwtTokenService.generateToken(savedCustomer.getEmail(), savedCustomer.getEmail());
        
        return new JwtResponse(token, savedCustomer.getEmail(), savedCustomer.getEmail());
    }
    
    /**
     * Authenticate customer and generate JWT token
     */
    public JwtResponse authenticateCustomer(LoginRequest loginRequest) {
        System.out.println("DEBUG: Attempting to authenticate user with email: " + loginRequest.getUsername());
        
        // Find customer by username (email) - this will still use the flawed method for now
        Customer customer = dataServiceClient.findCustomerByEmail(loginRequest.getUsername());
        
        if (customer == null) {
            System.out.println("DEBUG: Customer not found with email: " + loginRequest.getUsername());
            throw new RuntimeException("Customer not found with email: " + loginRequest.getUsername());
        }
        
        System.out.println("DEBUG: Customer found - ID: " + customer.getId() + ", Email: " + customer.getEmail());
        System.out.println("DEBUG: Stored password hash: " + (customer.getPassword() != null ? "Present" : "Null"));
        System.out.println("DEBUG: Login password provided: " + (loginRequest.getPassword() != null ? "Present" : "Null"));
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            System.out.println("DEBUG: Password verification failed");
            throw new RuntimeException("Invalid password");
        }
        
        System.out.println("DEBUG: Password verification successful");
        
        // Generate JWT token
        String token = jwtTokenService.generateToken(customer.getEmail(), customer.getEmail(), customer.getId());
        
        return new JwtResponse(token, customer.getEmail(), customer.getEmail());
    }
    
    /**
     * Find customer by email (for /me endpoint)
     */
    public Customer findCustomerByEmail(String email) {
        return dataServiceClient.findCustomerByEmail(email);
    }
}
