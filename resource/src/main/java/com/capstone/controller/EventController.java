package com.capstone.controller;


import com.capstone.domain.Customer;
import com.capstone.domain.Event;
import com.capstone.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable String id) {
        Event event = eventService.getEventById(id);
        if (event == null){
            return ResponseEntity.badRequest().build();
        } else{
            return ResponseEntity.ok().body(event);
        }
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event newEvent){
        if (newEvent.getEventName() == null || newEvent.getEventDescription() == null || newEvent.getEventStartDate() == null){
            return ResponseEntity.badRequest().build();
        } else {
            newEvent = eventService.createEvent(newEvent);

            URI location =
                    ServletUriComponentsBuilder.fromCurrentRequest()
                            .path("/{id}")
                            .buildAndExpand(newEvent.getId())
                            .toUri();

            return ResponseEntity.created(location).body(newEvent);  // Return the created customer in the body
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@RequestBody Event event, @PathVariable String id){
        if (!Objects.equals(event.getId(), id) || event.getEventName() == null || event.getEventDescription() == null || event.getEventStartDate() == null){
            return ResponseEntity.badRequest().build();
        } else{
            eventService.updateEvent(event, id);
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable String id){
        Event event = eventService.getEventById(id);
        if (event == null){
            return ResponseEntity.badRequest().build();
        } else{
            eventService.deleteEvent(id);
            return ResponseEntity.ok().build();
        }
    }
}
