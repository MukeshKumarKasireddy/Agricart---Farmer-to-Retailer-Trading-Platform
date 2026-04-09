package com.farmer.service;

import com.farmer.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderStateValidator {

    public void validateCancelable(Order order) {
        if (!"PENDING".equals(order.getStatus())
                || !"PENDING".equals(order.getPaymentStatus())) {
            throw new IllegalStateException(
                    "Order cannot be cancelled at this stage"
            );
        }
    }

    public void validateRejectable(Order order) {
        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException(
                    "Order cannot be rejected at this stage"
            );
        }
    }

    public void validatePayable(Order order) {
        if (!"PENDING".equals(order.getStatus())
                || !"PENDING".equals(order.getPaymentStatus())) {
            throw new IllegalStateException(
                    "Order cannot be paid"
            );
        }
    }

    public void validateDeliverable(Order order) {
        if (!"CONFIRMED".equals(order.getStatus())) {
            throw new IllegalStateException(
                    "Order cannot be delivered"
            );
        }
    }
}
