package com.bruno.backend.repository;

import com.bruno.backend.entity.Address;
import com.bruno.backend.entity.AddressType;
import com.bruno.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    List<Address> findByUserId(String userId);
    
    List<Address> findByUserAndType(User user, AddressType type);
    
    Optional<Address> findByUserIdAndIsDefaultTrue(String userId);
    
    List<Address> findByUserIdAndType(String userId, AddressType type);
    
    void deleteByUserIdAndId(String userId, Long id);
}