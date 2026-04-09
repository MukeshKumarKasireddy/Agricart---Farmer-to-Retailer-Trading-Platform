package com.farmer.repository;

import com.farmer.entity.SupportReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupportReplyRepository extends JpaRepository<SupportReply, Long> {

    List<SupportReply> findBySupportMessageIdOrderByCreatedAtAsc(Long id);
}
