package com.farmer.service;

import com.farmer.dto.FarmerAnalyticsDTO;
import com.farmer.entity.Order;
import com.farmer.repository.OrderRepository;
import com.farmer.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Locale;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    // 💰 5% admin commission
    private static final double COMMISSION_RATE = 0.05;

    public AnalyticsService(OrderRepository orderRepository,
                            ReviewRepository reviewRepository) {
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
    }

    /* =====================================================
       FARMER ANALYTICS
       ===================================================== */
    public FarmerAnalyticsDTO getFarmerAnalytics(Long farmerId) {

        FarmerAnalyticsDTO dto = new FarmerAnalyticsDTO();

        long paidOrders = orderRepository.countPaidOrders(farmerId);
        double paidRevenue = orderRepository.sumPaidRevenue(farmerId);

        long delivered = orderRepository.countDeliveredOrders(farmerId);
        long pendingDelivery = orderRepository.countPendingDeliveryOrders(farmerId);

        dto.setTotalOrders(paidOrders);
        dto.setTotalRevenue(paidRevenue);

        dto.setTotalPaidOrders(paidOrders);
        dto.setTotalRevenueReceived(paidRevenue);
        dto.setDeliveredOrders(delivered);
        dto.setPendingDeliveryOrders(pendingDelivery);

        Map<String, Double> quantityMap = new LinkedHashMap<>();
        Map<String, Double> revenueMap = new LinkedHashMap<>();

        List<Object[]> rows = orderRepository.getPaidSalesByProduct(farmerId);

        for (Object[] row : rows) {
            quantityMap.put((String) row[0], (Double) row[1]);
            revenueMap.put((String) row[0], (Double) row[2]);
        }

        dto.setQuantitySoldPerProduct(quantityMap);
        dto.setRevenuePerProduct(revenueMap);

        return dto;
    }

    /* =====================================================
       ADMIN ANALYTICS
       ===================================================== */
    public Map<String, Object> getAdminAnalytics() {

        List<Order> paidOrders = orderRepository.findAll()
                .stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .toList();

        double totalRevenue = paidOrders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        double totalCommission = totalRevenue * COMMISSION_RATE;

        Map<String, Double> monthlyRevenue = new LinkedHashMap<>();
        Map<String, Double> monthlyCommission = new LinkedHashMap<>();

        for (Order o : paidOrders) {
            int monthIndex = o.getCreatedAt().getMonthValue();

            String[] months = {
                    "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"
            };

            String month = months[monthIndex - 1];


            monthlyRevenue.put(month,
                    monthlyRevenue.getOrDefault(month, 0.0)
                            + o.getTotalPrice());

            monthlyCommission.put(month,
                    monthlyCommission.getOrDefault(month, 0.0)
                            + (o.getTotalPrice() * COMMISSION_RATE));
        }

        return Map.of(
                "totalRevenue", totalRevenue,
                "totalCommission", totalCommission,
                "monthlyRevenue", monthlyRevenue,
                "monthlyCommission", monthlyCommission,
                "totalOrders", paidOrders.size()
        );
    }
}
