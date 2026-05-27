package com.brandshub.controller;

import com.brandshub.dto.request.CheckoutRequest;
import com.brandshub.dto.request.PaymentVerifyRequest;
import com.brandshub.dto.response.ApiResponse;
import com.brandshub.model.Order;
import com.brandshub.model.User;
import com.brandshub.repository.UserRepository;
import com.brandshub.service.OrderService;
import com.brandshub.service.RazorpayService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private RazorpayService razorpayService;

    @Autowired
    private UserRepository userRepository;

    // ================= GET LOGGED IN USER =================

    private User getUser(UserDetails ud) {

        if (ud == null) {
            throw new RuntimeException("User not authenticated");
        }

        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================= CHECKOUT =================

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody CheckoutRequest req) {

        try {

            if (ud == null) {

                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Unauthorized"));
            }

            User user = getUser(ud);

            // Create Order
            Order order = orderService.createOrder(user, req);

            // ================= RAZORPAY =================

            if ("RAZORPAY".equalsIgnoreCase(req.getPaymentMethod())) {

                Map<String, String> rzpOrder =
                        razorpayService.createOrder(
                                order.getGrandTotal(),
                                "INR",
                                order.getOrderNumber()
                        );

                order.setRazorpayOrderId(rzpOrder.get("razorpayOrderId"));
                order = orderService.save(order);
                Map<String, Object> response = Map.of(
                        "order", order,
                        "razorpayOrderId", rzpOrder.get("razorpayOrderId"),
                        "amount", rzpOrder.get("amount"),
                        "currency", rzpOrder.get("currency"),
                        "keyId", rzpOrder.get("keyId")
                );

                return ResponseEntity.ok(
                        ApiResponse.success("Order created", response)
                );
            }

            // ================= COD =================

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Order placed successfully",
                            order
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }

    // ================= VERIFY PAYMENT =================

    @PostMapping("/payment/verify")
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody PaymentVerifyRequest req) {

        try {

            if (ud == null) {

                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Unauthorized"));
            }

            boolean valid =
                    razorpayService.verifyPaymentSignature(
                            req.getRazorpayOrderId(),
                            req.getRazorpayPaymentId(),
                            req.getRazorpaySignature()
                    );

            if (!valid) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Payment verification failed")
                );
            }

            Order order =
                    orderService.confirmPayment(
                            req.getRazorpayOrderId(),
                            req.getRazorpayPaymentId()
                    );

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Payment verified successfully",
                            order
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }

    // ================= MY ORDERS =================

    @GetMapping("/my")
    public ResponseEntity<?> myOrders(
            @AuthenticationPrincipal UserDetails ud) {

        try {

            User user = getUser(ud);

            List<Order> orders =
                    orderService.getUserOrders(user);

            return ResponseEntity.ok(
                    ApiResponse.success(orders)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }

    // ================= GET SINGLE ORDER =================

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long id) {

        try {

            User user = getUser(ud);

            Order order = orderService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            return ResponseEntity.ok(
                    ApiResponse.success(order)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(e.getMessage())
            );
        }
    }
}