package com.brandshub.service;

import com.brandshub.dto.request.CheckoutRequest;
import com.brandshub.model.*;
import com.brandshub.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartService cartService;

    public Order createOrder(User user, CheckoutRequest req) {
        Cart cart = cartService.getCart(user);
        if (cart.getItems().isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setOrderNumber("BH" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmm"))
                + String.format("%03d", (int)(Math.random() * 999)));
        order.setUser(user);
        order.setShippingName(req.getFullName());
        order.setShippingPhone(req.getPhone());
        order.setShippingAddress(req.getAddress());
        order.setShippingCity(req.getCity());
        order.setShippingPincode(req.getPincode());
        order.setPaymentMethod(req.getPaymentMethod());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order); oi.setProduct(ci.getProduct());
            oi.setProductName(ci.getProduct().getName());
            oi.setProductImage(ci.getProduct().getImageUrl());
            oi.setSelectedSize(ci.getSelectedSize());
            oi.setSelectedColor(ci.getSelectedColor());
            oi.setQuantity(ci.getQuantity());
            oi.setUnitPrice(ci.getProduct().getPrice());
            order.getItems().add(oi);
            total = total.add(ci.getSubtotal());
        }
        order.setTotalAmount(total);
        order.setShippingCharge(total.compareTo(new BigDecimal("999")) >= 0 ? BigDecimal.ZERO : new BigDecimal("79"));
        if ("COD".equalsIgnoreCase(req.getPaymentMethod())) {

            order.setStatus(Order.OrderStatus.CONFIRMED);
            order.setPaymentStatus(Order.PaymentStatus.PENDING);

            cartService.clearCart(user);

        } else {

            order.setStatus(Order.OrderStatus.PENDING);
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
        }
        return orderRepository.save(order);
    }

    public Order confirmPayment(String razorpayOrderId, String paymentId) {
        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setRazorpayPaymentId(paymentId);
        order.setRazorpayPaymentId(paymentId);

        order.setPaymentStatus(Order.PaymentStatus.PAID);

        order.setStatus(Order.OrderStatus.CONFIRMED);

        cartService.clearCart(order.getUser());

        System.out.println("PAYMENT VERIFIED SUCCESSFULLY");

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<Order> findById(Long id) { return orderRepository.findById(id); }

    public Page<Order> getAllOrders(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    public Order updateStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        order.setStatus(status);
        if (status == Order.OrderStatus.DELIVERED) order.setPaymentStatus(Order.PaymentStatus.PAID);
        return orderRepository.save(order);
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal r = orderRepository.getTotalRevenue();
        return r != null ? r : BigDecimal.ZERO;
    }

    public long countAllOrders() { return orderRepository.count(); }
    public long countPending() {
        return orderRepository.countByStatus(Order.OrderStatus.PENDING)
             + orderRepository.countByStatus(Order.OrderStatus.CONFIRMED);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }
}
