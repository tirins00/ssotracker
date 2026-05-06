package com.ssotracker.controller;

import com.ssotracker.dto.UserProfileRequest;
import com.ssotracker.dto.UserProfileResponse;
import com.ssotracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(@RequestParam String email) {
        return userService.getProfile(email);
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(@RequestParam String email, @Valid @RequestBody UserProfileRequest request) {
        return userService.updateProfile(email, request);
    }
}