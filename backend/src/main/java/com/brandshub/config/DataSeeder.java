package com.brandshub.config;

import java.math.BigDecimal;
import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.brandshub.model.Product;
import com.brandshub.model.User;
import com.brandshub.repository.ProductRepository;
import com.brandshub.repository.UserRepository;

public class DataSeeder {
    
    @Bean
CommandLineRunner seedData(
        UserRepository userRepository,
        ProductRepository productRepository,
        PasswordEncoder passwordEncoder) {

    return args -> {

        // Create Admin
        if (!userRepository.existsByEmail("admin@brandshub.com")) {

            User admin = new User();
            admin.setFullName("Brands Hub Admin");
            admin.setEmail("admin@brandshub.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);
        }

        // Create Products
        if (productRepository.count() == 0) {

            createProducts(productRepository, "Premium Shirt ", "Allen Solly",
                    Product.Category.SHIRTS, 10);

            createProducts(productRepository, "Cotton T-Shirt ", "Nike",
                    Product.Category.T_SHIRTS, 10);

            createProducts(productRepository, "Slim Fit Jeans ", "Levis",
                    Product.Category.JEANS, 10);

            createProducts(productRepository, "Winter Jacket ", "Puma",
                    Product.Category.JACKETS, 10);

            createProducts(productRepository, "Running Shoes ", "Adidas",
                    Product.Category.FOOTWEAR, 10);

            System.out.println("50 Sample Products Created");
        }
    };
}

private void createProducts(
        ProductRepository repo,
        String prefix,
        String brand,
        Product.Category category,
        int count) {

    for (int i = 1; i <= count; i++) {

        Product p = new Product();

        p.setName(prefix + i);
        p.setDescription("High quality " + prefix + i);
        p.setBrand(brand);

        p.setPrice(BigDecimal.valueOf(999 + (i * 100)));
        p.setOriginalPrice(BigDecimal.valueOf(1499 + (i * 100)));

        p.setStock(100);

        p.setCategory(category);

        p.setFeatured(i <= 5);
        p.setNewArrival(i > 5);

        p.setSizes(Arrays.asList("S", "M", "L", "XL"));
        p.setColors(Arrays.asList("Black", "White", "Blue"));

        p.setRating(4.5);
        p.setReviewCount(50 + i);

        p.setImageUrl(
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        );

        repo.save(p);
    }
}
}
