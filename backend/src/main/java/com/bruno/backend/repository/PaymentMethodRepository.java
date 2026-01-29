package com.bruno.backend.repository;

import com.bruno.backend.entity.PaymentMethod;
import com.bruno.backend.entity.PaymentType;
import com.bruno.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    
    List<PaymentMethod> findByUserId(String userId);
    
    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(String userId);
    
    List<PaymentMethod> findByUserAndType(User user, PaymentType type);
    
    void deleteByUserIdAndId(String userId, Long id);
}