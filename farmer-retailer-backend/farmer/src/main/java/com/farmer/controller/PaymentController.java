package com.farmer.controller;

import com.farmer.entity.Order;
import com.farmer.entity.Transaction;
import com.farmer.repository.OrderRepository;
import com.farmer.repository.TransactionRepository;
import com.farmer.service.NotificationService;
import com.farmer.service.OrderStateValidator;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;
    private final OrderStateValidator orderStateValidator;

    // ✅ FIXED CONSTRUCTOR
    public PaymentController(
            OrderRepository orderRepository,
            TransactionRepository transactionRepository,
            NotificationService notificationService,
            OrderStateValidator orderStateValidator
    ) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.notificationService = notificationService;
        this.orderStateValidator = orderStateValidator;
    }

    @PostMapping("/create-order")
    public String createRazorpayOrder(@RequestParam Long orderId) throws Exception {

        Order order = orderRepository.findById(orderId).orElseThrow();

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        options.put(
                "amount",
                (int) (order.getQuantity()
                        * order.getProduct().getPricePerKg()
                        * 100)
        );
        options.put("currency", "INR");
        options.put("receipt", "order_" + orderId);

        com.razorpay.Order razorOrder = client.orders.create(options);

        return razorOrder.toJson().toString();
    }

    @PostMapping("/verify")
    @Transactional
    public void verifyPayment(
            @RequestParam Long orderId,
            @RequestParam String paymentId
    ) {
        Order order = orderRepository.findById(orderId).orElseThrow();

        orderStateValidator.validatePayable(order);

        order.setPaymentStatus("PAID");
        order.setStatus("CONFIRMED");
        order.setPaymentId(paymentId);
        orderRepository.save(order);

        // ✅ Notification (Task 3)
        notificationService.notify(
                order.getFarmer(),
                "Payment received for Order #" + order.getId()
        );

        notificationService.notify(
                order.getRetailer(),
                "Payment successful for Order #" + order.getId()
        );

        Transaction tx = new Transaction();
        tx.setOrder(order);
        tx.setRetailer(order.getRetailer());
        tx.setPaymentId(paymentId);
        tx.setAmount(order.getTotalPrice());
        tx.setRazorpayOrderId("order_" + orderId);

        transactionRepository.save(tx);
    }
}
