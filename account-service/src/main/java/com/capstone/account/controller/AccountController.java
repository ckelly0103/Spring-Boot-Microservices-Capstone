package com.capstone.account.controller;

import com.capstone.account.dto.CustomerRegistrationRequest;
import com.capstone.account.dto.JwtResponse;
import com.capstone.account.dto.LoginRequest;
import com.capstone.account.model.Customer;
import com.capstone.account.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    /**
     * Root endpoint - confirms service is running
     * GET /account/
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> serviceStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Account Service is up and running");
        response.put("service", "Account Service");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Token endpoint - authenticate customer and return JWT
     * POST /account/token
     */
    @PostMapping("/token")
    public ResponseEntity<?> authenticateCustomer(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = accountService.authenticateCustomer(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    /**
     * Register endpoint - register new customer
     * POST /account/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest registrationRequest) {
        try {
            Customer customer = accountService.registerCustomer(registrationRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Customer registered successfully");
            response.put("customerId", customer.getId());
            response.put("email", customer.getEmail());
            response.put("name", customer.getName());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Exception handler for validation errors
     */
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((org.springframework.validation.FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
