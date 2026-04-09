package com.farmer.controller;

import com.farmer.entity.Order;
import com.farmer.entity.Product;
import com.farmer.entity.User;
import com.farmer.service.NotificationService;
import com.farmer.service.OrderStateValidator;
import com.farmer.repository.OrderRepository;
import com.farmer.repository.ProductRepository;
import com.farmer.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer")
@CrossOrigin(origins = "http://localhost:5173")
public class FarmerController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    private final OrderStateValidator orderStateValidator;

    public FarmerController(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            NotificationService notificationService,
            OrderStateValidator orderStateValidator
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
        this.orderStateValidator = orderStateValidator;
    }

    /* =====================================================
       FARMER TRANSACTIONS (PAID ORDERS)
       ===================================================== */

    @GetMapping("/transactions")
    public List<Order> getFarmerTransactions(Authentication authentication) {

        String email = authentication.getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return orderRepository.findByFarmerIdAndPaymentStatus(
                farmer.getId(),
                "PAID"
        );
    }

    /* =====================================================
       MARK ORDER AS DELIVERED
       ===================================================== */

    @PutMapping("/orders/{orderId}/ship")
    public Order markAsShipped(
            @PathVariable Long orderId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("Unauthorized to ship this order");
        }

        orderStateValidator.validateDeliverable(order);

        order.setStatus("SHIPPED");
        orderRepository.save(order);

        notificationService.notify(
                order.getRetailer(),
                "Order #" + order.getId() + " has been shipped"
        );

        return order;
    }

    /* =====================================================
       REJECT ORDER (TASK 2)
       ===================================================== */

    @PutMapping("/orders/{orderId}/reject")
    @Transactional
    public Order rejectOrder(
            @PathVariable Long orderId,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("Unauthorized to reject this order");
        }

        orderStateValidator.validateRejectable(order);

        // Restore stock safely
        Product product = order.getProduct();
        product.setQuantityKg(
                product.getQuantityKg() + order.getQuantity()
        );
        productRepository.save(product);

        order.setStatus("REJECTED");
        Order saved = orderRepository.save(order);

        notificationService.notify(
                order.getRetailer(),
                "Order #" + order.getId() + " was rejected by farmer"
        );

        return saved;
    }
}
