package com.capstone.repository;

import com.capstone.domain.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {
    List<Registration> findByCustomerId(String customerId);
    List<Registration> findByEventId(String eventId);
}
