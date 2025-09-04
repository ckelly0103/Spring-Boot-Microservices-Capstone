package com.capstone.controller;

import com.capstone.domain.Customer;
import com.capstone.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers(){
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable String id){
        Customer customer = customerService.getCustomerById(id);
        if (customer == null){
            return ResponseEntity.badRequest().build();
        } else{
            return ResponseEntity.ok().body(customer);
        }
    }

    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody Customer newCustomer){
        if (newCustomer.getName() == null || newCustomer.getEmail() == null){
            return ResponseEntity.badRequest().build();
        } else {
            newCustomer = customerService.createCustomer(newCustomer);

            URI location =
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(newCustomer.getId())
                            .toUri();

            return ResponseEntity.created(location).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> putCustomer(@RequestBody Customer customer, @PathVariable String id){
        if (!Objects.equals(customer.getId(), id) || customer.getName() == null || customer.getEmail() == null){
            return ResponseEntity.badRequest().build();
        } else{
            customerService.updateCustomer(customer, id);
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable String id){
        customerService.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}
