package com.farmer.controller;

import com.farmer.entity.Notification;
import com.farmer.entity.User;
import com.farmer.repository.UserRepository;
import com.farmer.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(
            NotificationService notificationService,
            UserRepository userRepository
    ) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email).orElseThrow();
    }

    // 📥 All notifications
    @GetMapping
    public List<Notification> getMyNotifications() {
        User user = currentUser();
        return notificationService.getUserNotifications(user.getId());
    }

    // 🔔 Unread count
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        User user = currentUser();
        return Map.of(
                "count",
                notificationService.getUnreadCount(user.getId())
        );
    }

    // ✅ Mark as read
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        User user = currentUser();
        notificationService.markAsRead(id, user.getId());
    }
}
