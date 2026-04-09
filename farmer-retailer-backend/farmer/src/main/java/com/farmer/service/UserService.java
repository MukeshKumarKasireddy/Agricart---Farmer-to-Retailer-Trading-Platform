package com.farmer.service;

import com.farmer.entity.User;
import com.farmer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if ("MALE".equalsIgnoreCase(user.getGender()))
            user.setAvatarUrl("/avatars/male.png");
        else if ("FEMALE".equalsIgnoreCase(user.getGender()))
            user.setAvatarUrl("/avatars/female.png");
        else
            user.setAvatarUrl("/avatars/default.png");

        User savedUser = userRepository.save(user);

        // Welcome email + notification
        notificationService.notify(
                savedUser,
                "Welcome to Agricart, " + savedUser.getName() + "!"
        );

        return savedUser;
    }

    public User authenticate(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
