package com.capstone.service;

import com.capstone.domain.Event;
import com.capstone.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    public List<Event> getAllEvents() {
        return repository.findAll();
    }

    public Event getEventById(String id) {
        return repository.findById(id).orElse(null);
    }

//    public List<Event> getEventByDate(String date) {
//        return repository.findByDate(date);
//    }

    public Event createEvent(Event event) {
        return repository.save(event);
    }

    public Event updateEvent(Event event) {
        return repository.save(event);
    }

    public void deleteEvent(String id) {
        repository.deleteById(id);
    }


}
