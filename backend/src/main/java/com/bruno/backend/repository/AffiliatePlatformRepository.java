package com.bruno.backend.repository;

import com.bruno.backend.entity.AffiliatePlatform;
import com.bruno.backend.entity.AffiliateProduct;
import com.bruno.backend.entity.PlatformName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffiliatePlatformRepository extends JpaRepository<AffiliatePlatform, Long> {
    
    List<AffiliatePlatform> findByAffiliateProduct(AffiliateProduct affiliateProduct);
    
    List<AffiliatePlatform> findByAffiliateProductId(Long affiliateProductId);
    
    List<AffiliatePlatform> findByPlatformName(PlatformName platformName);
    
    List<AffiliatePlatform> findByAffiliateProductAndIsActiveTrue(AffiliateProduct affiliateProduct);
    
    List<AffiliatePlatform> findByAffiliateProductIdAndIsActiveTrue(Long affiliateProductId);
    
    Optional<AffiliatePlatform> findByAffiliateProductAndPlatformName(
        AffiliateProduct affiliateProduct, 
        PlatformName platformName
    );
}