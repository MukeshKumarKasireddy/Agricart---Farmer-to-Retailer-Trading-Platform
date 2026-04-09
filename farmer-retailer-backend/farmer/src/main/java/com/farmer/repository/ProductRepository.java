package com.farmer.repository;

import com.farmer.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFarmerId(Long farmerId);

    @Query("""
SELECT p FROM Product p
WHERE
  (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
AND
  (:category IS NULL OR LOWER(p.category) = LOWER(:category))
AND
  (:minPrice IS NULL OR p.pricePerKg >= :minPrice)
AND
  (:maxPrice IS NULL OR p.pricePerKg <= :maxPrice)
AND
  (:inStock IS NULL OR (p.quantityKg > 0))
ORDER BY
  CASE WHEN :sort = 'price_asc' THEN p.pricePerKg END ASC,
  CASE WHEN :sort = 'price_desc' THEN p.pricePerKg END DESC,
  CASE WHEN :sort = 'newest' THEN p.id END DESC
""")
    List<Product> searchProducts(
            @Param("name") String name,
            @Param("category") String category,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("inStock") Boolean inStock,
            @Param("sort") String sort
    );

}
