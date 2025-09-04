package com.capstone.repository;

import com.capstone.domain.Event;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EventRepository extends MongoRepository<Event, String> {

    //List<Event> findByDate(String date);

}
