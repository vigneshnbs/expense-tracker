package com.example.expensetracker.controller;

import com.example.expensetracker.enums.CategoryType;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Category operations
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * GET /api/categories - Get all categories
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * GET /api/categories/{id} - Get category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }

    /**
     * GET /api/categories/type/{type} - Get categories by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Category>> getCategoriesByType(@PathVariable CategoryType type) {
        List<Category> categories = categoryService.getCategoriesByType(type);
        return ResponseEntity.ok(categories);
    }

    /**
     * GET /api/categories/top-level - Get top-level categories
     */
    @GetMapping("/top-level")
    public ResponseEntity<List<Category>> getTopLevelCategories() {
        List<Category> categories = categoryService.getTopLevelCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * GET /api/categories/{id}/subcategories - Get subcategories
     */
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<Category>> getSubcategories(@PathVariable Long id) {
        List<Category> subcategories = categoryService.getSubcategories(id);
        return ResponseEntity.ok(subcategories);
    }

    /**
     * POST /api/categories - Create new category
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    /**
     * PUT /api/categories/{id} - Update category
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(
        @PathVariable Long id,
        @Valid @RequestBody Category category
    ) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * DELETE /api/categories/{id} - Delete category
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}