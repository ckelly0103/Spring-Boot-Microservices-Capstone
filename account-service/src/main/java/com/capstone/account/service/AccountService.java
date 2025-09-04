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
     * Register a new customer
     */
    public Customer registerCustomer(CustomerRegistrationRequest request) {
        // Check if customer already exists
        if (dataServiceClient.customerExistsByEmail(request.getEmail())) {
            throw new RuntimeException("Customer with email " + request.getEmail() + " already exists");
        }
        
        // Create new customer with encoded password
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Save customer via Data Service
        return dataServiceClient.createCustomer(customer);
    }
    
    /**
     * Authenticate customer and generate JWT token
     */
    public JwtResponse authenticateCustomer(LoginRequest loginRequest) {
        // Find customer by username (email)
        Customer customer = dataServiceClient.findCustomerByEmail(loginRequest.getUsername());
        
        if (customer == null) {
            throw new RuntimeException("Customer not found with email: " + loginRequest.getUsername());
        }
        
        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        // Generate JWT token
        String token = jwtTokenService.generateToken(customer.getEmail(), customer.getEmail());
        
        return new JwtResponse(token, customer.getEmail(), customer.getEmail());
    }
}
