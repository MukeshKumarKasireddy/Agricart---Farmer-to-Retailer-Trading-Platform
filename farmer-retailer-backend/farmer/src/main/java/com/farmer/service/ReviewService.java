package com.farmer.service;

import com.farmer.entity.*;
import com.farmer.repository.*;
import com.farmer.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ReviewService(
            ReviewRepository reviewRepository,
            OrderRepository orderRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    /* ================= ADD REVIEW ================= */
    public Review addReview(Long orderId, int rating, String comment) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"DELIVERED".equals(order.getStatus()) ||
                !"PAID".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Order not eligible for review");
        }

        if (reviewRepository.existsByOrderId(orderId)) {
            throw new RuntimeException("Already reviewed");
        }

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        Review review = new Review();
        review.setOrderId(orderId);
        review.setRetailer(retailer);
        review.setFarmer(order.getFarmer());
        review.setProduct(order.getProduct());
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepository.save(review);

        notificationService.notify(
                order.getFarmer(),
                "New review received for " + order.getProduct().getName()
        );

        return saved;
    }

    /* ================= CAN REVIEW ================= */
    public boolean canReview(Long orderId) {

        if (reviewRepository.existsByOrderId(orderId)) return false;

        Order order = orderRepository.findById(orderId).orElseThrow();

        return "DELIVERED".equals(order.getStatus()) &&
                "PAID".equals(order.getPaymentStatus());
    }

    /* ================= FARMER REVIEWS ================= */
    public Map<String, Object> getFarmerReviews() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email).orElseThrow();

        List<Review> reviews = reviewRepository.findByFarmerId(farmer.getId());

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);

        return Map.of(
                "average", avg,
                "total", reviews.size(),
                "reviews", reviews
        );
    }

    /* ================= RETAILER REVIEWS ================= */
    public List<Review> getRetailerReviews() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User retailer = userRepository.findByEmail(email).orElseThrow();

        return reviewRepository.findByRetailerId(retailer.getId());
    }
}
