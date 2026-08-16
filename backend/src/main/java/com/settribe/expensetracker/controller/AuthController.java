package com.settribe.expensetracker.controller;

import com.settribe.expensetracker.dto.AuthResponse;
import com.settribe.expensetracker.dto.LoginRequest;
import com.settribe.expensetracker.dto.RegisterRequest;
import com.settribe.expensetracker.model.User;
import com.settribe.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = authService.registerUser(registerRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
}
