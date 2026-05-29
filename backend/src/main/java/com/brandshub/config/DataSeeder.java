package com.brandshub.config;

import java.math.BigDecimal;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.brandshub.model.Product;
import com.brandshub.model.User;
import com.brandshub.repository.ProductRepository;
import com.brandshub.repository.UserRepository;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Create Admin User
            if (!userRepository.existsByEmail("admin@brandshub.com")) {

                User admin = new User();

                admin.setFullName("Brands Hub Admin");
                admin.setEmail("admin@brandshub.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(User.Role.ADMIN);
                admin.setEnabled(true);

                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("ADMIN CREATED SUCCESSFULLY");
                System.out.println("Email: admin@brandshub.com");
                System.out.println("Password: Admin@123");
                System.out.println("=================================");
            }

            // Create Products Only Once
            if (productRepository.count() == 0) {

                // Shirts
                createProducts(
                        productRepository,
                        "Premium Shirt ",
                        "Allen Solly",
                        Product.Category.SHIRTS,
                        10,
                        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
                );

                // T-Shirts
                createProducts(
                        productRepository,
                        "Cotton T-Shirt ",
                        "Nike",
                        Product.Category.T_SHIRTS,
                        10,
                        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
                );

                // Jeans
                createProducts(
                        productRepository,
                        "Slim Fit Jeans ",
                        "Levis",
                        Product.Category.JEANS,
                        10,
                        "https://images.unsplash.com/photo-1542272604-787c3835535d"
                );

                // Jackets
                createProducts(
                        productRepository,
                        "Winter Jacket ",
                        "Puma",
                        Product.Category.JACKETS,
                        10,
                        "https://images.unsplash.com/photo-1551028719-00167b16eac5"
                );

                System.out.println("=================================");
                System.out.println("40 SAMPLE PRODUCTS CREATED");
                System.out.println("=================================");
            }
        };
    }

    private void createProducts(
            ProductRepository repo,
            String prefix,
            String brand,
            Product.Category category,
            int count,
            String imageUrl) {

        for (int i = 1; i <= count; i++) {

            Product product = new Product();

            product.setName(prefix + i);

            product.setDescription(
                    "Premium quality " + prefix + i +
                    " designed for comfort and style."
            );

            product.setBrand(brand);

            product.setPrice(
                    BigDecimal.valueOf(999 + (i * 100))
            );

            product.setOriginalPrice(
                    BigDecimal.valueOf(1499 + (i * 100))
            );

            product.setStock(100);

            product.setCategory(category);

            product.setFeatured(i <= 5);

            product.setNewArrival(i > 5);

            product.setActive(true);

            product.setSizes(
                    Arrays.asList("S", "M", "L", "XL")
            );

            product.setColors(
                    Arrays.asList("Black", "White", "Blue")
            );

            product.setRating(4.5);

            product.setReviewCount(50 + i);

            product.setImageUrl(imageUrl);

            repo.save(product);
        }
    }
}