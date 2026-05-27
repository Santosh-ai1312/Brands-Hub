package com.brandshub.controller;

import com.brandshub.dto.response.ApiResponse;
import com.brandshub.model.Cart;
import com.brandshub.model.User;
import com.brandshub.repository.UserRepository;
import com.brandshub.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    private User getUser(UserDetails ud) {

        if (ud == null) {
            throw new RuntimeException("User not authenticated");
        }

        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================= GET CART =================

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(
            @AuthenticationPrincipal UserDetails ud) {

        Cart cart = cartService.getCart(getUser(ud));

        return ResponseEntity.ok(
                ApiResponse.success(cart)
        );
    }

    // ================= ADD ITEM =================

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Cart>> addItem(
            @AuthenticationPrincipal UserDetails ud,
            @RequestBody Map<String, Object> body) {

        try {

            // Validate productId
            if (body == null || body.get("productId") == null) {

                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("productId is required"));
            }

            Long productId =
                    Long.valueOf(body.get("productId").toString());

            // Quantity
            int qty = body.get("quantity") != null
                    ? Integer.parseInt(body.get("quantity").toString())
                    : 1;

            // Size
            String size = body.get("size") != null
                    ? body.get("size").toString()
                    : null;

            // Color
            String color = body.get("color") != null
                    ? body.get("color").toString()
                    : null;

            Cart cart = cartService.addItem(
                    getUser(ud),
                    productId,
                    qty,
                    size,
                    color
            );

            return ResponseEntity.ok(
                    ApiResponse.success("Item added to cart", cart)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ================= UPDATE ITEM =================

    @PutMapping("/update/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> updateItem(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {

        try {

            if (body == null || body.get("quantity") == null) {

                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Quantity is required"));
            }

            Cart cart = cartService.updateItem(
                    getUser(ud),
                    itemId,
                    body.get("quantity")
            );

            return ResponseEntity.ok(
                    ApiResponse.success("Cart updated", cart)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ================= REMOVE ITEM =================

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Long itemId) {

        try {

            Cart cart = cartService.removeItem(
                    getUser(ud),
                    itemId
            );

            return ResponseEntity.ok(
                    ApiResponse.success("Item removed", cart)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    // ================= CLEAR CART =================

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails ud) {

        try {

            cartService.clearCart(getUser(ud));

            return ResponseEntity.ok(
                    ApiResponse.success("Cart cleared", null)
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}