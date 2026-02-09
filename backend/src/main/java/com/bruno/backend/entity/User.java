package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity(name = "users")
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    // Basic info
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // Additional personal info
    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private String gender;

    @Column(name = "tax_id")
    private String taxId; // CPF

    // Role and permissions
    @Enumerated(EnumType.STRING)
    private UserRole role;

    // User preferences
    @Embedded
    private UserPreferences preferences = new UserPreferences();

    // Marketing preferences
    @Column(name = "newsletter_opt_in")
    private boolean newsletterOptIn = false;

    @Column(name = "sms_opt_in")
    private boolean smsOptIn = false;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PaymentMethod> paymentMethods = new ArrayList<>();

    // Timestamps
    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    // Constructors
    public User(String name, String email, String password, UserRole role) {
        // Split name into first and last name for compatibility
        String[] nameParts = name.split(" ", 2);
        this.firstName = nameParts[0];
        this.lastName = nameParts.length > 1 ? nameParts[1] : "";
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = LocalDate.now();
    }

    // Computed properties
    public String getFullName() {
        return firstName + (lastName != null && !lastName.trim().isEmpty() ? " " + lastName : "");
    }

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDate.now();
        }
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = LocalDate.now();
    }

    // Spring Security methods
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRole.ADMIN)
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Helper methods
    public Address getDefaultAddress() {
        return addresses.stream()
                .filter(Address::isDefault)
                .findFirst()
                .orElse(null);
    }

    public PaymentMethod getDefaultPaymentMethod() {
        return paymentMethods.stream()
                .filter(PaymentMethod::isDefault)
                .findFirst()
                .orElse(null);
    }
}
