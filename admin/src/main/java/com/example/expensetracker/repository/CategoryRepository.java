package com.example.expensetracker.repository;

import com.example.expensetracker.enums.CategoryType;
import com.example.expensetracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find categories by type (EXPENSE or INCOME)
     */
    List<Category> findByType(CategoryType type);

    /**
     * Find subcategories by parent category ID
     */
    List<Category> findByParentCategoryId(Long parentCategoryId);

    /**
     * Find top-level categories (no parent)
     */
    List<Category> findByParentCategoryIdIsNull();

    /**
     * Find category by name
     */
    Optional<Category> findByName(String name);

    /**
     * Check if category name exists
     */
    boolean existsByName(String name);
}