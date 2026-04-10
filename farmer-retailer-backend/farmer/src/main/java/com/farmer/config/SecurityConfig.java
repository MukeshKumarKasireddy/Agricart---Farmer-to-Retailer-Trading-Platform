package com.farmer.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.farmer.security.JwtAuthenticationFilter;
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173", "https://your-frontend.vercel.app"));
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "X-Requested-With"
        ));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/").permitAll()
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/upload/**",
                                "/uploads/**"
                        ).permitAll()

                        .requestMatchers("/api/users/me").authenticated()
                        .requestMatchers("/api/notifications/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/products/my").hasRole("FARMER")
                        .requestMatchers(HttpMethod.POST, "/api/products").hasRole("FARMER")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("FARMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("FARMER")
                        .requestMatchers(HttpMethod.GET, "/api/products").hasRole("RETAILER")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/products/**").hasRole("RETAILER")
                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN", "FARMER", "RETAILER")
                        .requestMatchers("/api/farmer/**").hasRole("FARMER")
                        .requestMatchers("/api/retailer/**").hasRole("RETAILER")
                        .requestMatchers("/api/orders/farmer/**").hasRole("FARMER")
                        .requestMatchers("/api/orders/retailer/**").hasRole("RETAILER")
                        .requestMatchers("/api/orders/retailer/place").hasRole("RETAILER")
                        .requestMatchers("/api/payments/**").hasRole("RETAILER")
                        .requestMatchers("/api/transactions/**").hasRole("RETAILER")
                        .requestMatchers("/api/analytics/farmer").hasRole("FARMER")
                        .requestMatchers("/api/analytics/retailer").hasRole("RETAILER")
                        .requestMatchers(HttpMethod.POST, "/api/payments/verify").hasRole("RETAILER")
                        .requestMatchers(HttpMethod.POST, "/api/support")
                        .hasAnyRole("FARMER","RETAILER")

                        .requestMatchers(HttpMethod.GET, "/api/support/my")
                        .hasAnyRole("FARMER","RETAILER")

                        .requestMatchers("/api/support/admin/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/api/support/unread-count")
                        .hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT, "/api/support/*/resolve")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }
}
