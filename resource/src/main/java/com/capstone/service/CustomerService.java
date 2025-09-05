package com.capstone.service;

import com.capstone.domain.Customer;
import com.capstone.repository.CustomersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomersRepository repository;

    public CustomerService(CustomersRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(String id) {
        return repository.findById(id).orElse(null);
    }

    public Customer createCustomer(Customer customer){
        return repository.save(customer);
    }

    public void  deleteCustomer(String id){
        repository.deleteById(id);
    }

    public Customer updateCustomer(Customer customer, String id){
        if (customer == null || repository.findById(id).isEmpty()) {
            return null;
        }else{
            return repository.save(customer);
        }
    }
}
