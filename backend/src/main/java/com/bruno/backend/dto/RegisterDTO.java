package com.bruno.backend.dto;

import com.bruno.backend.entity.UserRole;

public record RegisterDTO(String name, String email, String password, UserRole role) {
}
