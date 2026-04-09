package com.farmer.controller;

import com.farmer.entity.User;
import com.farmer.repository.UserRepository;
import com.farmer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    // ADMIN / INTERNAL USE
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.register(user);
    }

    // ADMIN
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public User getMyProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAvatarUrl() == null) {
            user.setAvatarUrl("/avatars/default.png");
        }

        return user;
    }

    // UPDATE LOGGED-IN USER PROFILE
    @PutMapping("/me")
    public User updateMyProfile(@RequestBody User updatedUser) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Updatable fields only
        user.setPhone(updatedUser.getPhone());
        user.setGender(updatedUser.getGender());
        user.setVillage(updatedUser.getVillage());
        user.setCity(updatedUser.getCity());
        user.setPincode(updatedUser.getPincode());

        // Avatar auto-update based on gender
        if ("MALE".equalsIgnoreCase(updatedUser.getGender())) {
            user.setAvatarUrl("/avatars/male.png");
        } else if ("FEMALE".equalsIgnoreCase(updatedUser.getGender())) {
            user.setAvatarUrl("/avatars/female.png");
        } else {
            user.setAvatarUrl("/avatars/neutral.png");
        }

        return userRepository.save(user);
    }
}
