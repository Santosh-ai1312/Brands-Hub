package com.brandshub.controller;

import com.brandshub.dto.response.ApiResponse;
import com.brandshub.model.*;
import com.brandshub.repository.UserRepository;
import com.brandshub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private ProductService productService;
    @Autowired private OrderService orderService;
    @Autowired private UserRepository userRepository;

    // ── Dashboard ──────────────────────────────────────
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<?>> dashboard() {
        Map<String, Object> stats = Map.of(
                "totalProducts", productService.count(),
                "totalOrders", orderService.countAllOrders(),
                "pendingOrders", orderService.countPending(),
                "totalUsers", userRepository.count(),
                "totalRevenue", orderService.getTotalRevenue(),
                "recentOrders", orderService.getAllOrders(0, 5).getContent()
        );
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // ── Products ────────────────────────────────────────
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<?>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Product> products = productService.getAll(page, size);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<?>> createProduct(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal originalPrice,
            @RequestParam Integer stock,
            @RequestParam String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String sizes,
            @RequestParam(required = false) String colors,
            @RequestParam(required = false) boolean featured,
            @RequestParam(required = false) boolean newArrival,
            @RequestParam(required = false) MultipartFile image) {
        try {
            Product product = new Product();
            product.setName(name); product.setDescription(description);
            product.setPrice(price); product.setOriginalPrice(originalPrice);
            product.setStock(stock); product.setBrand(brand);
            product.setCategory(Product.Category.valueOf(category));
            product.setFeatured(featured); product.setNewArrival(newArrival);
            if (sizes != null) product.setSizes(Arrays.asList(sizes.split(",")));
            if (colors != null) product.setColors(Arrays.asList(colors.split(",")));
            Product saved = productService.save(product, image);
            return ResponseEntity.ok(ApiResponse.success("Product created", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<?>> updateProduct(@PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal originalPrice,
            @RequestParam Integer stock,
            @RequestParam String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String sizes,
            @RequestParam(required = false) String colors,
            @RequestParam(required = false) boolean featured,
            @RequestParam(required = false) boolean newArrival,
            @RequestParam(required = false) boolean active,
            @RequestParam(required = false) MultipartFile image) {
        try {
            Product product = productService.findById(id).orElseThrow();
            product.setName(name); product.setDescription(description);
            product.setPrice(price); product.setOriginalPrice(originalPrice);
            product.setStock(stock); product.setBrand(brand);
            product.setCategory(Product.Category.valueOf(category));
            product.setFeatured(featured); product.setNewArrival(newArrival); product.setActive(active);
            if (sizes != null) product.setSizes(Arrays.asList(sizes.split(",")));
            if (colors != null) product.setColors(Arrays.asList(colors.split(",")));
            Product saved = productService.save(product, image);
            return ResponseEntity.ok(ApiResponse.success("Product updated", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }

    // ── Orders ──────────────────────────────────────────
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<?>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders(page, size)));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateOrderStatus(@PathVariable Long id,
                                                             @RequestBody Map<String, String> body) {
        Order order = orderService.updateStatus(id, Order.OrderStatus.valueOf(body.get("status")));
        return ResponseEntity.ok(ApiResponse.success("Status updated", order));
    }

    // ── Users ────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }
}
