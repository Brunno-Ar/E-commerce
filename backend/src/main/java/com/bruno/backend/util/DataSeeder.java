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
import java.util.stream.IntStream;

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

                        List<Product> products = IntStream.range(1, 13).mapToObj(i -> {
                                Product p = new Product();
                                p.setName("Produto Genérico " + i);
                                p.setDescription("Descrição incrível para o produto " + i);
                                p.setPrice(new BigDecimal(100.0 * i));
                                p.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
                                p.setCategory(i % 3 == 0 ? furniture : (i % 2 == 0 ? books : electronics));
                                p.setStockQuantity(10 * i);
                                return p;
                        }).toList();

                        productRepository.saveAll(products);

                        System.out.println("--- Data Seeder: Banco populado com sucesso! ---");
                }

                // Criação/Recriação do CLIENTE
                recreateUserIfNeeded("cliente@loja.com", "Cliente Padrão", "123456", UserRole.USER);
        }

        private void recreateUserIfNeeded(String email, String name, String rawPassword, UserRole role) {
                var existingUserOpt = userRepository.findByEmail(email);

                if (existingUserOpt.isPresent()) {
                        User existingUser = existingUserOpt.get();
                        if (!passwordEncoder.matches(rawPassword, existingUser.getPassword())) {
                                userRepository.delete(existingUser);
                                System.out.println("--- Data Seeder: Usuário " + email
                                                + " com senha incorreta, recriando... ---");
                                existingUserOpt = java.util.Optional.empty();
                        } else {
                                System.out.println("--- Data Seeder: Usuário " + email
                                                + " já existe com senha correta ✓ ---");
                        }
                }

                if (existingUserOpt.isEmpty()) {
                        String encryptedPassword = passwordEncoder.encode(rawPassword);
                        User user = new User(name, email, encryptedPassword, role);
                        userRepository.save(user);
                        System.out.println("--- Data Seeder: Usuário criado (" + email + " / " + rawPassword + ") ---");
                }
        }
}
