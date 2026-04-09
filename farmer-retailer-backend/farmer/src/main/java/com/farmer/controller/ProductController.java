package com.farmer.controller;

import com.farmer.entity.Product;
import com.farmer.entity.User;
import com.farmer.entity.VerificationStatus;
import com.farmer.repository.ProductRepository;
import com.farmer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Get all products (Retailer browsing)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 🔹 Get products added by logged-in farmer
    @GetMapping("/my")
    public List<Product> getMyProducts() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return productRepository.findByFarmerId(farmer.getId());
    }

    // 🔹 Add new product
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product product) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        // 🚫 BLOCK if not verified
        if (farmer.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return ResponseEntity.status(403)
                    .body("You must be verified before adding products");
        }

        product.setFarmer(farmer);

        // AUTO IMAGE
        if (product.getImageUrl() == null || product.getImageUrl().isEmpty()) {

            String productName = product.getName() == null
                    ? ""
                    : product.getName().trim().toLowerCase().replace(" ", "");

            String category = product.getCategory() == null
                    ? ""
                    : product.getCategory().trim().toLowerCase();

            if (!productName.isEmpty()) {
                product.setImageUrl("/products/" + productName + ".png");
            } else {
                switch (category) {
                    case "vegetables":
                        product.setImageUrl("/placeholders/vegetables.png");
                        break;
                    case "fruits":
                        product.setImageUrl("/placeholders/fruits.png");
                        break;
                    case "pulses":
                        product.setImageUrl("/placeholders/pulses.png");
                        break;
                    case "leafy":
                        product.setImageUrl("/placeholders/leafy.png");
                        break;
                    default:
                        product.setImageUrl("/placeholders/default.png");
                }
            }
        }

        return ResponseEntity.ok(productRepository.save(product));
    }

    // 🔹 Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email).orElseThrow();

        if (farmer.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return ResponseEntity.status(403).body("Verification required");
        }

        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // 🔹 Update product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct
    ) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User farmer = userRepository.findByEmail(email).orElseThrow();

        if (farmer.getVerificationStatus() != VerificationStatus.VERIFIED) {
            return ResponseEntity.status(403).body("Verification required");
        }

        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedProduct.getName());
                    existing.setCategory(updatedProduct.getCategory());
                    existing.setPricePerKg(updatedProduct.getPricePerKg());
                    existing.setQuantityKg(updatedProduct.getQuantityKg());
                    existing.setDescription(updatedProduct.getDescription());
                    existing.setImageUrl(updatedProduct.getImageUrl());

                    return ResponseEntity.ok(productRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "newest") String sort
    ) {
        return productRepository.searchProducts(
                name,
                category,
                minPrice,
                maxPrice,
                inStock,
                sort
        );
    }
}
