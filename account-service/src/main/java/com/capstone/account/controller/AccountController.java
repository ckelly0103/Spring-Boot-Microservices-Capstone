package com.capstone.account.controller;

import com.capstone.account.dto.CustomerRegistrationRequest;
import com.capstone.account.dto.JwtResponse;
import com.capstone.account.dto.LoginRequest;
import com.capstone.account.model.Customer;
import com.capstone.account.service.AccountService;
import com.capstone.account.service.JwtTokenService;
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
    
    @Autowired
    private JwtTokenService jwtTokenService;
    

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> serviceStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Account Service is up and running");
        response.put("service", "Account Service");
        return ResponseEntity.ok(response);
    }
    

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
    

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest registrationRequest) {
        try {
            JwtResponse jwtResponse = accountService.registerCustomer(registrationRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(jwtResponse);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    

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
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No valid authorization header"));
            }
            
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            
            if (!jwtTokenService.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
            }
            
            String email = jwtTokenService.getEmailFromToken(token);
            
            // Get customer info by email since registration tokens don't have customer ID
            Customer customer = accountService.findCustomerByEmail(email);
            
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("email", email);
            userInfo.put("customerId", customer.getId());
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Failed to get user info"));
        }
    }
}
