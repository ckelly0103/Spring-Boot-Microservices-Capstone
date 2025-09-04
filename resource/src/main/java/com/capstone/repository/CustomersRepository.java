package com.capstone.repository;

import com.capstone.domain.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomersRepository extends MongoRepository<Customer, String> {
}
