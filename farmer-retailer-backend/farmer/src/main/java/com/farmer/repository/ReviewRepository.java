package com.farmer.repository;

import com.farmer.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByOrderId(Long orderId);

    List<Review> findByFarmerId(Long farmerId);

    List<Review> findByProductId(Long productId);

    List<Review> findByRetailerId(Long retailerId);
}
