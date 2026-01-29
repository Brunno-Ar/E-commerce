package com.bruno.backend.repository;

import com.bruno.backend.entity.AffiliateProduct;
import com.bruno.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffiliateProductRepository extends JpaRepository<AffiliateProduct, Long> {
    
    Optional<AffiliateProduct> findByProduct(Product product);
    
    List<AffiliateProduct> findByProductId(Long productId);
    
    List<AffiliateProduct> findByCustomSlug(String customSlug);
    
    boolean existsByCustomSlug(String customSlug);
    
    List<AffiliateProduct> findByEnableComparisonTrue();
}