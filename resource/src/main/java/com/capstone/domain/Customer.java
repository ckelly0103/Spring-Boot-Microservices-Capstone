package com.capstone.domain;

//import jakarta.persistence.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String companyName;
    private String location;
    private int employeeCount;
    private String phoneNumber;
    private String jobTitle;
    private boolean isAdmin = false;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCompanyName() { return companyName; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public int getEmployeeCount() { return employeeCount; }

    public void setEmployeeCount(int employeeCount) { this.employeeCount = employeeCount; }

    public String getPhoneNumber() { return phoneNumber; }

    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getJobTitle() { return jobTitle; }

    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public boolean getIsAdmin() { return isAdmin; }

    public void setIsAdmin(boolean admin) { this.isAdmin = admin; }

}
