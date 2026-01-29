package com.bruno.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {
    @NotBlank(message = "Nome é obrigatório")
    private String firstName;

    @NotBlank(message = "Sobrenome é obrigatório")
    private String lastName;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    private String password;

    private String phone;

    private LocalDate birthDate;

    private String gender;

    private String taxId; // CPF

    private List<AddressDTO> addresses;

    // Marketing preferences
    private boolean newsletterOptIn = false;
    private boolean smsOptIn = false;

    // User preferences
    private String language = "pt-BR";
    private String currency = "BRL";
    private String timezone = "America/Sao_Paulo";
    private boolean emailNotifications = true;
    private boolean smsNotifications = false;
    private boolean pushNotifications = true;
    private boolean orderUpdates = true;
    private boolean promotionalEmails = false;
    private boolean newsletter = false;
}