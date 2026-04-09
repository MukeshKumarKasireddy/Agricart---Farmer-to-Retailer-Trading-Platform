package com.farmer.repository;

import com.farmer.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
        SELECT n FROM Notification n
        WHERE n.user.id = :userId
        ORDER BY n.createdAt DESC
    """)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("""
        SELECT COUNT(n) FROM Notification n
        WHERE n.user.id = :userId AND n.read = false
    """)
    long countUnread(Long userId);
}
