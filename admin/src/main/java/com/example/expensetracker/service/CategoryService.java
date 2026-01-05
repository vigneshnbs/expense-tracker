package com.example.expensetracker.service;

import com.example.expensetracker.enums.CategoryType;
import com.example.expensetracker.model.Category;
import com.example.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for Category operations
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Get all categories
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Get category by ID
     */
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    /**
     * Get categories by type (EXPENSE or INCOME)
     */
    public List<Category> getCategoriesByType(CategoryType type) {
        return categoryRepository.findByType(type);
    }

    /**
     * Get top-level categories (no parent)
     */
    public List<Category> getTopLevelCategories() {
        return categoryRepository.findByParentCategoryIdIsNull();
    }

    /**
     * Get subcategories of a parent category
     */
    public List<Category> getSubcategories(Long parentCategoryId) {
        return categoryRepository.findByParentCategoryId(parentCategoryId);
    }

    /**
     * Create new category
     */
    @Transactional
    public Category createCategory(Category category) {
        // Check if category name already exists
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }

        // Validate parent category if specified
        if (category.getParentCategoryId() != null) {
            if (!categoryRepository.existsById(category.getParentCategoryId())) {
                throw new RuntimeException("Parent category not found with id: " + category.getParentCategoryId());
            }
        }

        return categoryRepository.save(category);
    }

    /**
     * Update existing category
     */
    @Transactional
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);

        // Check if new name conflicts with existing category (excluding current one)
        if (!category.getName().equals(categoryDetails.getName()) &&
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Category with name '" + categoryDetails.getName() + "' already exists");
        }

        category.setName(categoryDetails.getName());
        category.setType(categoryDetails.getType());
        category.setParentCategoryId(categoryDetails.getParentCategoryId());
        category.setColorCode(categoryDetails.getColorCode());

        return categoryRepository.save(category);
    }

    /**
     * Delete category
     */
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }

        // Check if category has subcategories
        List<Category> subcategories = categoryRepository.findByParentCategoryId(id);
        if (!subcategories.isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing subcategories");
        }

        categoryRepository.deleteById(id);
    }

    /**
     * Check if category exists
     */
    public boolean categoryExists(Long id) {
        return categoryRepository.existsById(id);
    }
}