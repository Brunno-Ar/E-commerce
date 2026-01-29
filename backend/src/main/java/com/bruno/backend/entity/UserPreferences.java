package com.bruno.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {
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