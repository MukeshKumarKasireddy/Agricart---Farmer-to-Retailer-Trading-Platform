package com.farmer.dto;

import java.util.Map;

public class FarmerAnalyticsDTO {

    // ✅ OLD keys (frontend already uses these)
    private long totalOrders;
    private double totalRevenue;

    // ✅ NEW accurate metrics
    private long totalPaidOrders;
    private double totalRevenueReceived;
    private long deliveredOrders;
    private long pendingDeliveryOrders;

    private Map<String, Double> quantitySoldPerProduct;
    private Map<String, Double> revenuePerProduct;

    // getters & setters

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalPaidOrders() {
        return totalPaidOrders;
    }

    public void setTotalPaidOrders(long totalPaidOrders) {
        this.totalPaidOrders = totalPaidOrders;
    }

    public double getTotalRevenueReceived() {
        return totalRevenueReceived;
    }

    public void setTotalRevenueReceived(double totalRevenueReceived) {
        this.totalRevenueReceived = totalRevenueReceived;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getPendingDeliveryOrders() {
        return pendingDeliveryOrders;
    }

    public void setPendingDeliveryOrders(long pendingDeliveryOrders) {
        this.pendingDeliveryOrders = pendingDeliveryOrders;
    }

    public Map<String, Double> getQuantitySoldPerProduct() {
        return quantitySoldPerProduct;
    }

    public void setQuantitySoldPerProduct(Map<String, Double> quantitySoldPerProduct) {
        this.quantitySoldPerProduct = quantitySoldPerProduct;
    }

    public Map<String, Double> getRevenuePerProduct() {
        return revenuePerProduct;
    }

    public void setRevenuePerProduct(Map<String, Double> revenuePerProduct) {
        this.revenuePerProduct = revenuePerProduct;
    }
}
