package com.brandshub.service;

import com.brandshub.model.*;
import com.brandshub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private ProductRepository productRepository;

    public Cart getCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    public Cart addItem(User user, Long productId, int qty, String size, String color) {
        Cart cart = getCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId)
                        && eq(i.getSelectedSize(), size) && eq(i.getSelectedColor(), color))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + qty);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart); item.setProduct(product);
            item.setQuantity(qty); item.setSelectedSize(size); item.setSelectedColor(color);
            cart.getItems().add(item);
        }
        return cartRepository.save(cart);
    }

    public Cart updateItem(User user, Long itemId, int qty) {
        Cart cart = getCart(user);
        cart.getItems().stream().filter(i -> i.getId().equals(itemId)).findFirst().ifPresent(i -> {
            if (qty <= 0) cart.getItems().remove(i);
            else i.setQuantity(qty);
        });
        return cartRepository.save(cart);
    }

    public Cart removeItem(User user, Long itemId) {
        Cart cart = getCart(user);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    public void clearCart(User user) {
        Cart cart = getCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private boolean eq(String a, String b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }
}
