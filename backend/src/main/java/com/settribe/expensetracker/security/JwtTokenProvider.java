package com.settribe.expensetracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long jwtExpirationInMs;

    public JwtTokenProvider(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationInMs) {

        /*
         * The secret is Base64 encoded.
         * It must contain at least 256 bits (32 bytes)
         * for HS256.
         */
        byte[] keyBytes = Decoders.BASE64.decode(secret);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 256 bits (32 bytes)"
            );
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.jwtExpirationInMs = jwtExpirationInMs;
    }

    /**
     * Generate JWT token using user's email.
     */
    public String generateToken(String email) {

        Date now = new Date();
        Date expiryDate = new Date(
                now.getTime() + jwtExpirationInMs
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    /**
     * Get email from JWT token.
     */
    public String getEmailFromJwt(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    /**
     * Validate JWT token.
     */
    public boolean validateToken(String token) {

        try {

            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (JwtException | IllegalArgumentException ex) {

            return false;
        }
    }
}