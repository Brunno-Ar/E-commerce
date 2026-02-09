package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AddressType type;

    @Column(nullable = false)
    private String recipient;

    @Column(nullable = false)
    private String street;

    @Column(name = "street_number", nullable = false)
    private String number;

    private String complement;

    @Column(nullable = false)
    private String neighborhood;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private String country = "Brasil";

    private String referencePoint;

    @Column(name = "is_default")
    private boolean isDefault = false;

    @PreRemove
    private void ensureDefaultAddress() {
        if (isDefault && user != null) {
            user.getAddresses().stream()
                    .filter(addr -> !addr.getId().equals(this.getId()))
                    .findFirst()
                    .ifPresent(addr -> addr.setDefault(true));
        }
    }
}
