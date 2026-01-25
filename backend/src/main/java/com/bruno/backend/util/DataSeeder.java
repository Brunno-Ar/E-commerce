package com.bruno.backend.util;

import com.bruno.backend.entity.Category;
import com.bruno.backend.entity.Product;
import com.bruno.backend.entity.User;
import com.bruno.backend.entity.UserRole;
import com.bruno.backend.repository.CategoryRepository;
import com.bruno.backend.repository.ProductRepository;
import com.bruno.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final CategoryRepository categoryRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                if (categoryRepository.count() == 0) {
                        Category electronics = new Category();
                        electronics.setName("Eletrônicos");

                        Category books = new Category();
                        books.setName("Livros");

                        Category furniture = new Category();
                        furniture.setName("Móveis");

                        categoryRepository.saveAll(List.of(electronics, books, furniture));

                        // Produtos Nativos (Venda Própria)
                        Product p1 = new Product(null, "Sony WH-1000XM5",
                                        "Fone de ouvido com cancelamento de ruído líder da indústria.",
                                        new BigDecimal("2200.00"),
                                        "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=800&q=80",
                                        null, false, electronics);

                        Product p2 = new Product(null, "Nintendo Switch OLED",
                                        "Console híbrido com tela OLED vibrante de 7 polegadas.",
                                        new BigDecimal("2600.00"),
                                        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80",
                                        null, false, electronics);

                        // Produtos Afiliados
                        Product p3 = new Product(null, "Kindle Paperwhite 11ª Ger",
                                        "Leitor de livros digitais à prova d'água.",
                                        new BigDecimal("799.00"),
                                        "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
                                        "https://www.amazon.com.br/kindle-paperwhite", true, electronics);

                        Product p4 = new Product(null, "Livro Clean Architecture",
                                        "O guia definitivo para arquitetura de software.",
                                        new BigDecimal("90.00"),
                                        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
                                        "https://www.amazon.com.br/clean-architecture", true, books);

                        productRepository.saveAll(List.of(p1, p2, p3, p4));

                        System.out.println("--- Data Seeder: Banco populado com sucesso! ---");
                }

                // Criação/Recriação do ADMIN (força recriação para garantir senha correta)
                recreateUserIfNeeded("admin@loja.com", "Admin Master", "admin123", UserRole.ADMIN);

                // Criação/Recriação do CLIENTE
                recreateUserIfNeeded("cliente@loja.com", "Cliente Padrão", "123456", UserRole.USER);
        }

        /**
         * Recria o usuário de teste se ele existir com senha potencialmente incorreta.
         * Isso garante que as senhas de teste sempre funcionem após reiniciar o
         * servidor.
         */
        private void recreateUserIfNeeded(String email, String name, String rawPassword, UserRole role) {
                var existingUser = userRepository.findByEmail(email);

                if (existingUser != null) {
                        // Verifica se a senha atual funciona
                        if (!passwordEncoder.matches(rawPassword, existingUser.getPassword())) {
                                // Senha incorreta - deleta e recria
                                userRepository.delete((User) existingUser);
                                System.out.println("--- Data Seeder: Usuário " + email
                                                + " com senha incorreta, recriando... ---");
                                existingUser = null;
                        } else {
                                System.out.println("--- Data Seeder: Usuário " + email
                                                + " já existe com senha correta ✓ ---");
                        }
                }

                if (existingUser == null) {
                        String encryptedPassword = passwordEncoder.encode(rawPassword);
                        User user = new User(name, email, encryptedPassword, role);
                        userRepository.save(user);
                        System.out.println("--- Data Seeder: Usuário criado (" + email + " / " + rawPassword + ") ---");
                }
        }
}
