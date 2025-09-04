package com.capstone.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    /**
     * Root endpoint - confirms service is running
     * GET /api/
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> serviceStatus() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "Data Service is up and running");
        response.put("service", "Data Service");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
