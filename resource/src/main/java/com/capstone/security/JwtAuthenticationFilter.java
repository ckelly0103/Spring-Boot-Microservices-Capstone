package com.capstone.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // Skip JWT validation for specific endpoints
        String requestPath = request.getServletPath();
        if ("/".equals(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Allow /customers for authentication and registration purposes (account service needs this)
        if (requestPath.equals("/customers") && 
            (request.getMethod().equals("GET") || request.getMethod().equals("POST"))) {
            filterChain.doFilter(request, response);
            return;
        }

        String authorizationHeader = request.getHeader("Authorization");
        System.out.println("DEBUG: Processing request to " + requestPath + " with auth header: " + (authorizationHeader != null ? "Present" : "Missing"));

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            System.out.println("DEBUG: Extracted JWT token: " + token.substring(0, Math.min(50, token.length())) + "...");
            
            try {
                boolean isValid = jwtTokenUtil.validateToken(token);
                System.out.println("DEBUG: JWT validation result: " + isValid);
                if (isValid) {
                    String username = jwtTokenUtil.getUsernameFromToken(token);
                    String email = jwtTokenUtil.getEmailFromToken(token);
                    
                    // Create authentication object
                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                        username, null, new ArrayList<>());
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    // Add user info to request attributes for potential use in controllers
                    request.setAttribute("username", username);
                    request.setAttribute("email", email);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\":\"Invalid or expired JWT token\"}");
                    response.setContentType("application/json");
                    return;
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"JWT token validation failed\"}");
                response.setContentType("application/json");
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Authorization header is missing or invalid\"}");
            response.setContentType("application/json");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
