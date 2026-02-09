package com.bruno.backend.repository;

import com.bruno.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    boolean existsByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Product> search(@Param("categoryId") Long categoryId, @Param("name") String name, Pageable pageable);

    /**
     * Conta a quantidade de produtos afiliados.
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isAffiliate = true")
    Long countAffiliateProducts();

    /**
     * Conta a quantidade de produtos nativos (venda própria).
     */
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isAffiliate = false")
    Long countNativeProducts();
}
