package com.settribe.expensetracker.repository;

import com.settribe.expensetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:category IS NULL OR t.category = :category) " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "ORDER BY t.transactionDate DESC, t.id DESC")
    List<Transaction> findFilteredTransactions(
            @Param("userId") Long userId,
            @Param("type") String type,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Transaction> findByUserId(Long userId);
}
