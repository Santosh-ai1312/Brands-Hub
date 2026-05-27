package com.brandshub.service;

import com.brandshub.model.Product;
import com.brandshub.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

@Service
@Transactional
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Value("${app.upload.dir}") private String uploadDir;

    public List<Product> getFeatured() { return productRepository.findByFeaturedTrueAndActiveTrue(); }
    public List<Product> getNewArrivals() { return productRepository.findByNewArrivalTrueAndActiveTrue(); }

    public Page<Product> getProducts(Product.Category category, BigDecimal minPrice,
                                      BigDecimal maxPrice, String keyword, int page, int size, String sort) {
        Sort s = switch (sort != null ? sort : "newest") {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            default -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, s);
        if (keyword != null && !keyword.isBlank())
            return productRepository.searchProducts(keyword, pageable);
        return productRepository.filterProducts(category, minPrice, maxPrice, pageable);
    }

    public Optional<Product> findById(Long id) { return productRepository.findById(id); }

    public Product save(Product product, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Files.copy(image.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            product.setImageUrl("/uploads/" + filename);
        }
        return productRepository.save(product);
    }

    public void delete(Long id) { productRepository.deleteById(id); }
    public long count() { return productRepository.countByActiveTrue(); }

    public Page<Product> getAll(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
    public List<Product> searchProducts(String keyword) {

        Pageable pageable = PageRequest.of(
                0,
                20,
                Sort.by("createdAt").descending()
        );

        return productRepository
                .searchProducts(keyword, pageable)
                .getContent();
    }

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));
    }
}
