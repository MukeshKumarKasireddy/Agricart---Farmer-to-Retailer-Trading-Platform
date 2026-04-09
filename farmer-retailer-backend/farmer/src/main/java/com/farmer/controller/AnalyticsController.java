package com.farmer.controller;

import com.farmer.entity.Order;
import com.farmer.entity.Product;
import com.farmer.dto.FarmerAnalyticsDTO;
import com.farmer.service.AnalyticsService;
import com.farmer.entity.User;
import com.farmer.repository.OrderRepository;
import com.farmer.repository.ProductRepository;
import com.farmer.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AnalyticsService analyticsService;

    public AnalyticsController(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            AnalyticsService analyticsService
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.analyticsService = analyticsService;
    }

    // 👨‍🌾 FARMER DASHBOARD ANALYTICS
    @GetMapping("/farmer")
    public FarmerAnalyticsDTO farmerAnalytics() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email).orElseThrow();

        return analyticsService.getFarmerAnalytics(farmer.getId());
    }

    // 🏪 RETAILER DASHBOARD ANALYTICS
    @GetMapping("/retailer")
    public Map<String, Object> retailerAnalytics() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User retailer = userRepository.findByEmail(email).orElseThrow();

        List<Order> orders = orderRepository.findByRetailerId(retailer.getId());

        double totalSpent = orders.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        Map<String, Long> orderStatusCount = orders.stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                Order::getStatus,
                                java.util.stream.Collectors.counting()
                        )
                );

        return Map.of(
                "totalOrders", orders.size(),
                "totalSpent", totalSpent,
                "orderStatusCount", orderStatusCount
        );
    }

    // 👑 ADMIN DASHBOARD ANALYTICS
    @GetMapping("/admin")
    public Map<String, Object> adminAnalytics() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User admin = userRepository.findByEmail(email)
                .orElseThrow();

        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("Unauthorized");
        }

        return analyticsService.getAdminAnalytics();
    }

}
