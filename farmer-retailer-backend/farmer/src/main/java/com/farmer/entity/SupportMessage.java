package com.farmer.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_messages")
public class SupportMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* USER WHO SENT MESSAGE */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    /* ADMIN REPLY */
    @Column(columnDefinition = "TEXT")
    private String adminReply;

    private LocalDateTime repliedAt;

    /* STATUS */
    private String status; // OPEN / RESOLVED

    /* ADMIN UNREAD FLAG */
    private boolean adminRead = false;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        status = "OPEN";
        adminRead = false;
    }

    /* ================= GETTERS ================= */

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getSubject() {
        return subject;
    }

    public String getMessage() {
        return message;
    }

    public String getAdminReply() {
        return adminReply;
    }

    public LocalDateTime getRepliedAt() {
        return repliedAt;
    }

    public String getStatus() {
        return status;
    }

    public boolean isAdminRead() {
        return adminRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    /* ================= SETTERS ================= */

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setAdminReply(String adminReply) {
        this.adminReply = adminReply;
    }

    public void setRepliedAt(LocalDateTime repliedAt) {
        this.repliedAt = repliedAt;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAdminRead(boolean adminRead) {
        this.adminRead = adminRead;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
