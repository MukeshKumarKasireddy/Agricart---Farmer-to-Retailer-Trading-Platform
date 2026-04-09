package com.farmer.repository;

import com.farmer.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    /* =====================================================
       BASIC (Already used across app – DO NOT REMOVE)
       ===================================================== */

    List<Order> findByFarmerId(Long farmerId);

    List<Order> findByRetailerId(Long retailerId);

    List<Order> findByFarmerIdAndPaymentStatus(
            Long farmerId,
            String paymentStatus
    );

    /* =====================================================
       ANALYTICS – FINANCIAL (PAID ORDERS)
       ===================================================== */

    // Total number of PAID orders (money received)
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.farmer.id = :farmerId
          AND o.paymentStatus = 'PAID'
    """)
    long countPaidOrders(@Param("farmerId") Long farmerId);

    // Total revenue received by farmer
    @Query("""
        SELECT COALESCE(SUM(o.totalPrice), 0)
        FROM Order o
        WHERE o.farmer.id = :farmerId
          AND o.paymentStatus = 'PAID'
    """)
    double sumPaidRevenue(@Param("farmerId") Long farmerId);

    /* =====================================================
       ANALYTICS – FULFILLMENT (DELIVERY STATUS)
       ===================================================== */

    // Orders that are fully delivered
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.farmer.id = :farmerId
          AND o.status = 'DELIVERED'
    """)
    long countDeliveredOrders(@Param("farmerId") Long farmerId);

    // Paid but not yet delivered
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.farmer.id = :farmerId
          AND o.paymentStatus = 'PAID'
          AND o.status <> 'DELIVERED'
    """)
    long countPendingDeliveryOrders(@Param("farmerId") Long farmerId);

    /* =====================================================
       ANALYTICS – PRODUCT WISE (JPQL AGGREGATION)
       ===================================================== */

    // Quantity sold & revenue per product (PAID orders only)
    @Query("""
        SELECT 
            o.product.name,
            SUM(o.quantity),
            SUM(o.totalPrice)
        FROM Order o
        WHERE o.farmer.id = :farmerId
          AND o.paymentStatus = 'PAID'
        GROUP BY o.product.name
        ORDER BY o.product.name
    """)
    List<Object[]> getPaidSalesByProduct(
            @Param("farmerId") Long farmerId
    );
}
