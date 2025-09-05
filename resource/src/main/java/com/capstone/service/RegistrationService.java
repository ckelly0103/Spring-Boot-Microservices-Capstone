package com.capstone.service;

import com.capstone.domain.Registration;
import com.capstone.repository.RegistrationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository repository;

    public RegistrationService(RegistrationRepository repository) {
        this.repository = repository;
    }

    public List<Registration> getAllRegistrations() {
        return repository.findAll();
    }

    public Registration getRegistrationById(String id) {
        return repository.findById(id).orElse(null);
    }

    public List<Registration> getRegistrationsByCustomerId(String customerId){
        return repository.findByCustomerId(customerId);
    }

    public List<Registration> getRegistrationsByEventId(String eventId){
        return repository.findByEventId(eventId);
    }

    public void deleteRegistration(String id){
        repository.deleteById(id);
    }

    public Registration updateRegistration(Registration registration, String id) {
        if(registration == null || repository.findById(id).isEmpty()) {
            return null;
        } else{
            return repository.save(registration);
        }

    }




}
