package com.bruno.backend.config;

import com.bruno.backend.entity.SiteConfig;
import com.bruno.backend.repository.SiteConfigRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeederConfig {

    @Bean
    public CommandLineRunner seedSiteConfig(SiteConfigRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                SiteConfig config = new SiteConfig();
                config.setId(1L);
                config.setHeroTitle("Bem-vindo à Technoo");
                config.setHeroSubtitle("A melhor loja de tecnologia do Brasil");
                repository.save(config);
                System.out.println("SiteConfig seeded successfully.");
            }
        };
    }
}
