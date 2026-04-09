package com.farmer.repository;

import com.farmer.entity.SupportMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {

    List<SupportMessage> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<SupportMessage> findAllByOrderByCreatedAtDesc();

    long countByAdminReadFalse();

    long countByStatus(String status);
}
