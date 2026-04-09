package com.farmer.service;

import com.farmer.entity.SupportMessage;
import com.farmer.entity.User;
import com.farmer.repository.SupportMessageRepository;
import com.farmer.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupportMessageService {

    private final SupportMessageRepository supportRepo;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public SupportMessageService(
            SupportMessageRepository supportRepo,
            UserRepository userRepository,
            NotificationService notificationService,
            EmailService emailService
    ) {
        this.supportRepo = supportRepo;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    /* =====================================================
       USER SEND MESSAGE
       ===================================================== */
    public SupportMessage sendMessage(String subject, String message) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        SupportMessage msg = new SupportMessage();
        msg.setUser(user);
        msg.setSubject(subject);
        msg.setMessage(message);
        msg.setStatus("OPEN");
        msg.setAdminRead(false);
        msg.setCreatedAt(LocalDateTime.now());

        SupportMessage saved = supportRepo.save(msg);

        // notify admins
        List<User> admins = userRepository.findAll()
                .stream()
                .filter(u -> "ADMIN".equals(u.getRole()))
                .toList();

        for (User admin : admins) {

            notificationService.notify(
                    admin,
                    "📩 New support message from " + user.getName()
            );

            emailService.send(
                    admin.getEmail(),
                    "New Support Request - Agricart",
                    "User: " + user.getName() +
                            "\nEmail: " + user.getEmail() +
                            "\n\nSubject: " + subject +
                            "\n\nMessage:\n" + message
            );
        }

        return saved;
    }

    /* =====================================================
       USER VIEW THEIR TICKETS
       ===================================================== */
    public List<SupportMessage> myMessages() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        return supportRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /* =====================================================
       ADMIN VIEW ALL
       ===================================================== */
    public List<SupportMessage> allMessages() {
        return supportRepo.findAllByOrderByCreatedAtDesc();
    }

    /* =====================================================
       ADMIN REPLY
       ===================================================== */
    public SupportMessage reply(Long id, String replyText) {

        SupportMessage msg = supportRepo.findById(id).orElseThrow();

        msg.setAdminReply(replyText);
        msg.setRepliedAt(LocalDateTime.now());
        msg.setStatus("RESOLVED");
        msg.setAdminRead(true);

        SupportMessage saved = supportRepo.save(msg);

        User user = msg.getUser();

        // in-app
        notificationService.notify(
                user,
                "Admin replied to your support request: " + msg.getSubject()
        );

        // email
        emailService.send(
                user.getEmail(),
                "Agricart Support Reply",
                "Your ticket: " + msg.getSubject() +
                        "\n\nAdmin Reply:\n" + replyText
        );

        return saved;
    }

    /* =====================================================
       ADMIN MARK READ
       ===================================================== */
    public void markRead(Long id) {
        SupportMessage msg = supportRepo.findById(id).orElseThrow();
        msg.setAdminRead(true);
        supportRepo.save(msg);
    }

    /* =====================================================
       BADGE COUNT
       ===================================================== */
    public long unreadCount() {
        return supportRepo.countByAdminReadFalse();
    }

    /* =====================================================
       OPEN COUNT
       ===================================================== */
    public long countOpenMessages() {
        return supportRepo.countByStatus("OPEN");
    }

    /* =====================================================
       ADMIN MARK RESOLVED ONLY
       ===================================================== */
    public void markResolved(Long id) {
        SupportMessage msg = supportRepo.findById(id).orElseThrow();
        msg.setStatus("RESOLVED");
        msg.setAdminRead(true);
        supportRepo.save(msg);
    }
}
