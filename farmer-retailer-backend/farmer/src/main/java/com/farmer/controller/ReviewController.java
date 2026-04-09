package com.farmer.controller;

import com.farmer.entity.Review;
import com.farmer.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /* ================= ADD REVIEW ================= */
    @PostMapping("/{orderId}")
    public Review addReview(
            @PathVariable Long orderId,
            @RequestBody Map<String, Object> body
    ) {
        int rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");

        return reviewService.addReview(orderId, rating, comment);
    }

    /* ================= CAN REVIEW ================= */
    @GetMapping("/can-review/{orderId}")
    public boolean canReview(@PathVariable Long orderId) {
        return reviewService.canReview(orderId);
    }

    /* ================= FARMER REVIEWS ================= */
    @GetMapping("/farmer")
    public Map<String, Object> farmerReviews() {
        return reviewService.getFarmerReviews();
    }

    /* ================= RETAILER REVIEWS ================= */
    @GetMapping("/retailer")
    public List<Review> retailerReviews() {
        return reviewService.getRetailerReviews();
    }
}
