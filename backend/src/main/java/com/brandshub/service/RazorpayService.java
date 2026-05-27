package com.brandshub.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public Map<String, String> createOrder(BigDecimal amount, String currency, String receipt) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject options = new JSONObject();
        // Razorpay expects amount in paise (1 INR = 100 paise)
        options.put("amount", amount.multiply(BigDecimal.valueOf(100)).intValue());
        options.put("currency", currency != null ? currency : "INR");
        options.put("receipt", receipt);

        com.razorpay.Order razorpayOrder = client.orders.create(options);

        Map<String, String> result = new HashMap<>();
        result.put("razorpayOrderId", razorpayOrder.get("id").toString());
        result.put("amount", razorpayOrder.get("amount").toString());
        result.put("currency", razorpayOrder.get("currency").toString());
        result.put("keyId", keyId);
        return result;
    }

    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String signature) {
        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(keySecret.getBytes(), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) hexString.append(String.format("%02x", b));
            return hexString.toString().trim().equals(signature.trim());
        } catch (Exception e) {
            return false;
        }
    }
}
