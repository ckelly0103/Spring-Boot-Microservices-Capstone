package com.capstone.controller;

import com.capstone.domain.Registration;
import com.capstone.service.RegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRegistrationById(@PathVariable String id) {
        Registration registration = registrationService.getRegistrationById(id);
        if (registration == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok().body(registration);
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getRegistrationsByCustomerId(@PathVariable String customerId) {
        try {
            List<Registration> registrations = registrationService.getRegistrationsByCustomerId(customerId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            System.err.println("ERROR: Failed to get registrations for customer " + customerId + ": " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch registrations: " + e.getMessage()));
        }
    }

    @GetMapping("/event/{eventId}")
    public List<Registration> getRegistrationsByEventId(@PathVariable String eventId) {
        return registrationService.getRegistrationsByEventId(eventId);
    }

    @PostMapping
    public ResponseEntity<?> createRegistration(@RequestBody Registration newRegistration) {
        if (newRegistration.getCustomerId() == null || newRegistration.getEventId() == null) {
            return ResponseEntity.badRequest().build();
        } else {
            newRegistration = registrationService.createRegistration(newRegistration);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(newRegistration.getId())
                    .toUri();

            return ResponseEntity.created(location).body(newRegistration);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegistration(@RequestBody Registration registration, @PathVariable String id) {
        if (!Objects.equals(registration.getId(), id) || registration.getCustomerId() == null || registration.getEventId() == null) {
            return ResponseEntity.badRequest().build();
        } else {
            registrationService.updateRegistration(registration, id);
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable String id) {
        Registration registration = registrationService.getRegistrationById(id);
        if (registration == null) {
            return ResponseEntity.notFound().build();
        } else {
            registrationService.deleteRegistration(id);
            return ResponseEntity.ok().build();
        }
    }
}
