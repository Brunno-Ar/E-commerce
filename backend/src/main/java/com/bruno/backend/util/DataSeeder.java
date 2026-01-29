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
        private final com.bruno.backend.repository.SiteConfigRepository siteConfigRepository;

        @Override
        public void run(String... args) throws Exception {
                // Configuração do Site (Hero Section)
                if (siteConfigRepository.count() == 0) {
                        com.bruno.backend.entity.SiteConfig config = new com.bruno.backend.entity.SiteConfig();
                        config.setHeroTitle("Tecnologia que Transforma");
                        config.setHeroSubtitle("Eleve sua produtividade com os melhores equipamentos do mercado.");
                        config.setHeroImageUrl(
                                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80");
                        siteConfigRepository.save(config);
                        System.out.println("--- Data Seeder: Configurações do site inicializadas! ---");
                }

                if (categoryRepository.count() == 0) {
                        Category electronics = new Category();
                        electronics.setName("Eletrônicos");

                        Category books = new Category();
                        books.setName("Livros");

                        Category furniture = new Category();
                        furniture.setName("Móveis");

                        categoryRepository.saveAll(List.of(electronics, books, furniture));

                        // Produtos Nativos (Venda Própria)
                        Product p1 = new Product();
                        p1.setName("Sony WH-1000XM5");
                        p1.setDescription("Fone de ouvido com cancelamento de ruído líder da indústria.");
                        p1.setPrice(new BigDecimal("2200.00"));
                        p1.setImageUrl("https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=800&q=80");
                        p1.setAffiliate(false);
                        p1.setCategory(electronics);
                        p1.setStockQuantity(10);

                        Product p2 = new Product();
                        p2.setName("Nintendo Switch OLED");
                        p2.setDescription("Console híbrido com tela OLED vibrante de 7 polegadas.");
                        p2.setPrice(new BigDecimal("2600.00"));
                        p2.setImageUrl("https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80");
                        p2.setAffiliate(false);
                        p2.setCategory(electronics);
                        p2.setStockQuantity(10);

                        // Produtos Afiliados
                        // Produto AFILIADO com estoque 0 (para teste de "Esgotado")
                        Product p3 = new Product();
                        p3.setName("Kindle Paperwhite 11ª Ger");
                        p3.setDescription("Leitor de livros digitais à prova d'água.");
                        p3.setPrice(new BigDecimal("799.00"));
                        p3.setImageUrl("https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80");
                        p3.setAffiliateUrl("https://www.amazon.com.br/kindle-paperwhite");
                        p3.setAffiliate(true);
                        p3.setCategory(electronics);
                        p3.setStockQuantity(0);

                        Product p4 = new Product();
                        p4.setName("Livro Clean Architecture");
                        p4.setDescription("O guia definitivo para arquitetura de software.");
                        p4.setPrice(new BigDecimal("90.00"));
                        p4.setImageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80");
                        p4.setAffiliateUrl("https://www.amazon.com.br/clean-architecture");
                        p4.setAffiliate(true);
                        p4.setCategory(books);
                        p4.setStockQuantity(5);

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
                var existingUserOpt = userRepository.findByEmail(email);

                if (existingUserOpt.isPresent()) {
                        User existingUser = existingUserOpt.get();
                        // Verifica se a senha atual funciona
                        if (!passwordEncoder.matches(rawPassword, existingUser.getPassword())) {
                                // Senha incorreta - deleta e recria
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
