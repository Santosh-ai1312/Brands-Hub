package com.brandshub.service;

import com.brandshub.dto.request.LoginRequest;
import com.brandshub.dto.request.RegisterRequest;
import com.brandshub.dto.response.AuthResponse;
import com.brandshub.model.Cart;
import com.brandshub.model.User;
import com.brandshub.repository.CartRepository;
import com.brandshub.repository.UserRepository;
import com.brandshub.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private UserDetailsService userDetailsService;
    @Autowired private JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());

        // Set default role
        user.setRole(User.Role.CUSTOMER);

        user = userRepository.save(user);

        // Create cart for the user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        // Generate JWT token
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtUtils.generateToken(userDetails);

        // Return populated response
        return new AuthResponse(
        	    token,
        	    user.getEmail(),
        	    user.getFullName(),
        	    user.getRole().name()
        	);
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());

        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }
}
