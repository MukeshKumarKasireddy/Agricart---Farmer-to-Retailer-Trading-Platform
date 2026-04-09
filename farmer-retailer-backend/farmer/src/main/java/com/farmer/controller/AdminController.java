package com.farmer.controller;

import com.farmer.entity.Order;
import com.farmer.entity.Product;
import com.farmer.entity.User;
import com.farmer.service.AnalyticsService;
import com.farmer.repository.OrderRepository;
import com.farmer.entity.VerificationStatus;
import com.farmer.repository.ProductRepository;
import com.farmer.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AnalyticsService analyticsService;

    public AdminController(
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            AnalyticsService analyticsService
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.analyticsService = analyticsService;
    }

    /* =========================================================
       FARMER SUMMARY
       ========================================================= */

    @GetMapping("/farmers/pending")
    public List<User> getPendingFarmers() {
        return userRepository.findByVerificationStatus(VerificationStatus.PENDING);
    }

    @PutMapping("/farmers/{id}/verify")
    public User verifyFarmer(@PathVariable Long id) {

        User user = userRepository.findById(id).orElseThrow();

        user.setVerificationStatus(VerificationStatus.VERIFIED);
        user.setRejectionReason(null);

        return userRepository.save(user);
    }

    @PutMapping("/farmers/{id}/reject")
    public User rejectFarmer(
            @PathVariable Long id,
            @RequestParam String reason
    ) {

        User user = userRepository.findById(id).orElseThrow();

        user.setVerificationStatus(VerificationStatus.REJECTED);
        user.setRejectionReason(reason);

        return userRepository.save(user);
    }

    @GetMapping("/farmers/{farmerId}/summary")
    public Map<String, Object> getFarmerSummary(@PathVariable Long farmerId) {

        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        List<Product> products = productRepository.findByFarmerId(farmerId);
        List<Order> orders = orderRepository.findByFarmerId(farmerId);

        double totalRevenue = orders.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        return Map.of(
                "farmer", Map.of(
                        "id", farmer.getId(),
                        "name", farmer.getName(),
                        "email", farmer.getEmail(),
                        "phone", farmer.getPhone()
                ),
                "productCount", products.size(),
                "totalOrders", orders.size(),
                "totalRevenue", totalRevenue
        );
    }

    /* =========================================================
       RETAILER SUMMARY
       ========================================================= */

    @GetMapping("/retailers/{retailerId}/summary")
    public Map<String, Object> getRetailerSummary(@PathVariable Long retailerId) {

        User retailer = userRepository.findById(retailerId)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        List<Order> orders = orderRepository.findByRetailerId(retailerId);

        long pendingOrders = orders.stream()
                .filter(o -> "PENDING".equals(o.getStatus()))
                .count();

        double totalSpent = orders.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        return Map.of(
                "retailer", Map.of(
                        "id", retailer.getId(),
                        "name", retailer.getName(),
                        "email", retailer.getEmail(),
                        "phone", retailer.getPhone()
                ),
                "totalOrders", orders.size(),
                "pendingOrders", pendingOrders,
                "totalSpent", totalSpent
        );
    }

    /* =========================================================
       RETAILER ORDERS LIST (ADMIN VIEW)
       ========================================================= */

    @GetMapping("/retailers/{retailerId}/orders")
    public List<Map<String, Object>> getRetailerOrders(
            @PathVariable Long retailerId
    ) {

        List<Order> orders = orderRepository.findByRetailerId(retailerId);

        return orders.stream()
                .map(o -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("product", o.getProduct() != null ? o.getProduct().getName() : "—");
                    map.put("quantityKg", o.getQuantity());
                    map.put("totalPrice", o.getTotalPrice());
                    map.put("farmer", o.getFarmer() != null ? o.getFarmer().getName() : "—");
                    map.put("status", o.getStatus());
                    return map;
                })
                .collect(Collectors.toList());
    }

    /* =========================================================
       FARMER PRODUCTS + DELIVERED ORDERS (ADMIN VIEW)
       ========================================================= */

    @GetMapping("/farmers/{farmerId}/products-orders")
    public Map<String, Object> getFarmerProductsAndOrders(
            @PathVariable Long farmerId
    ) {

        List<Product> products = productRepository.findByFarmerId(farmerId);
        List<Order> orders = orderRepository.findByFarmerId(farmerId);

        List<Map<String, Object>> productList = products.stream()
                .map(p -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("name", p.getName());
                    map.put("quantityKg", p.getQuantityKg());
                    map.put("pricePerKg", p.getPricePerKg());
                    map.put("status", p.getQuantityKg() > 0 ? "AVAILABLE" : "SOLD OUT");
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> deliveredOrders = orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .map(o -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("product", o.getProduct() != null ? o.getProduct().getName() : "—");
                    map.put("quantityKg", o.getQuantity());
                    map.put("totalPrice", o.getTotalPrice());
                    map.put("retailer", o.getRetailer() != null ? o.getRetailer().getName() : "—");
                    return map;
                })
                .collect(Collectors.toList());

        return Map.of(
                "products", productList,
                "deliveredOrders", deliveredOrders
        );
    }

    /* =========================================================
       ADMIN ORDER OVERVIEW
       ========================================================= */

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/orders/summary")
    public Map<String, Object> getOrderSummary() {

        List<Order> orders = orderRepository.findAll();

        double totalRevenue = orders.stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .mapToDouble(Order::getTotalPrice)
                .sum();

        return Map.of(
                "totalOrders", orders.size(),
                "totalRevenue", totalRevenue
        );
    }

    @PutMapping("/orders/{orderId}/deliver")
    public Order adminMarkDelivered(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!"SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("Order must be shipped first");
        }

        order.setStatus("DELIVERED");
        orderRepository.save(order);

        return order;
    }


    /* =========================================================
       ADMIN CANCEL ORDER
       ========================================================= */
    @PutMapping("/orders/{orderId}/cancel")
    public Order adminCancelOrder(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("DELIVERED".equals(order.getStatus())) {
            throw new RuntimeException("Delivered order cannot be cancelled");
        }

        order.setStatus("CANCELLED");

        // restore stock
        Product product = order.getProduct();
        product.setQuantityKg(product.getQuantityKg() + order.getQuantity());
        productRepository.save(product);

        return orderRepository.save(order);
    }
    @GetMapping("/admin")
    public Map<String, Object> adminAnalytics() {
        return analyticsService.getAdminAnalytics();
    }

}