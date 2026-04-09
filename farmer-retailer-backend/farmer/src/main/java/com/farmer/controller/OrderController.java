package com.farmer.controller;

import com.farmer.entity.*;
import com.farmer.repository.*;
import com.farmer.service.NotificationService;
import com.farmer.service.OrderStateValidator;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final OrderStateValidator orderStateValidator;

    public OrderController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            NotificationService notificationService,
            OrderStateValidator orderStateValidator
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.orderStateValidator = orderStateValidator;
    }

    /* ---------------------------------------------------------
       PLACE ORDER (RETAILER)
    --------------------------------------------------------- */

    @Transactional
    @PostMapping("/retailer/place")
    public Order placeOrder(
            @RequestParam Long productId,
            @RequestParam Long retailerId,
            @RequestParam double quantity
    ) {
        if (quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero"
            );
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Product not found"
                        )
                );

        if (product.getQuantityKg() < quantity) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Insufficient stock available"
            );
        }

        User retailer = userRepository.findById(retailerId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Retailer not found"
                        )
                );

        // Reduce stock
        product.setQuantityKg(product.getQuantityKg() - quantity);
        productRepository.save(product);

        Order order = new Order();
        order.setProduct(product);
        order.setFarmer(product.getFarmer());
        order.setRetailer(retailer);
        order.setQuantity(quantity);
        order.setTotalPrice(quantity * product.getPricePerKg());

        Order savedOrder = orderRepository.save(order);

        notificationService.notify(
                product.getFarmer(),
                "New order received for " + product.getName()
        );
        notificationService.notify(
                retailer,
                "Order placed successfully. Order ID: " + savedOrder.getId()
        );

        return savedOrder;
    }

    /* ---------------------------------------------------------
       FETCH ORDERS
    --------------------------------------------------------- */

    @GetMapping("/farmer")
    public List<Order> getFarmerOrders() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return orderRepository.findByFarmerId(farmer.getId());
    }

    @GetMapping("/retailer")
    public List<Order> getRetailerOrders() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        return orderRepository.findByRetailerId(retailer.getId());
    }

    /* ---------------------------------------------------------
       MARK DELIVERED (FARMER)
    --------------------------------------------------------- */

    @PutMapping("/deliver/{orderId}")
    public Order markDelivered(@PathVariable Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // ✅ CENTRALIZED VALIDATION
        orderStateValidator.validateDeliverable(order);

        order.setStatus("DELIVERED");
        Order saved = orderRepository.save(order);

        notificationService.notify(
                order.getRetailer(),
                "Order #" + order.getId() + " has been delivered"
        );

        return saved;
    }

    /* ---------------------------------------------------------
       CANCEL ORDER (RETAILER)
    --------------------------------------------------------- */

    @Transactional
    @PutMapping("/retailer/{orderId}/cancel")
    public Order cancelOrderByRetailer(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        String email = authentication.getName();

        User retailer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getRetailer().getId().equals(retailer.getId())) {
            throw new RuntimeException("Unauthorized to cancel this order");
        }

        // ✅ CENTRALIZED VALIDATION
        orderStateValidator.validateCancelable(order);

        // Restore stock
        Product product = order.getProduct();
        product.setQuantityKg(
                product.getQuantityKg() + order.getQuantity()
        );
        productRepository.save(product);

        order.setStatus("CANCELLED");
        Order saved = orderRepository.save(order);

        notificationService.notify(
                order.getFarmer(),
                "Order #" + order.getId() + " was cancelled by retailer"
        );

        notificationService.notify(
                retailer,
                "You cancelled order #" + retailer.getId()
        );

        return saved;
    }
}
