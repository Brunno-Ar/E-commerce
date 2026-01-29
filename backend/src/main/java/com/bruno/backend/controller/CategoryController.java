package com.bruno.backend.controller;

import com.bruno.backend.entity.Category;
import com.bruno.backend.repository.CategoryRepository;
import com.bruno.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    /**
     * Lista todas as categorias (público).
     */
    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    /**
     * Busca uma categoria por ID (público).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova categoria (apenas ADMIN).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> create(@RequestBody Category category) {
        if (category.getName() == null || category.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Atualiza uma categoria existente (apenas ADMIN).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryRepository.findById(id)
                .map(category -> {
                    if (categoryDetails.getName() != null && !categoryDetails.getName().isBlank()) {
                        category.setName(categoryDetails.getName());
                    }
                    Category updated = categoryRepository.save(category);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deleta uma categoria (apenas ADMIN).
     * Não permite deletar se houver produtos vinculados.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    // Verifica se existem produtos vinculados
                    var productsInCategory = productRepository.findByCategoryId(id);
                    if (!productsInCategory.isEmpty()) {
                        return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(Map.of(
                                        "error", "Não é possível deletar esta categoria",
                                        "reason", "Existem " + productsInCategory.size() + " produto(s) vinculado(s)",
                                        "hint", "Remova ou reatribua os produtos antes de deletar a categoria"));
                    }
                    categoryRepository.delete(category);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
