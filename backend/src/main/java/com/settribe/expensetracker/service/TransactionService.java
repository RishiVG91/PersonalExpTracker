package com.settribe.expensetracker.service;

import com.settribe.expensetracker.dto.SummaryResponse;
import com.settribe.expensetracker.dto.TransactionRequest;
import com.settribe.expensetracker.exception.ResourceNotFoundException;
import com.settribe.expensetracker.model.Transaction;
import com.settribe.expensetracker.model.User;
import com.settribe.expensetracker.repository.TransactionRepository;
import com.settribe.expensetracker.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public List<Transaction> getTransactions(String type, String category, LocalDate startDate, LocalDate endDate) {
        User currentUser = getCurrentUser();
        return transactionRepository.findFilteredTransactions(
                currentUser.getId(),
                type,
                category,
                startDate,
                endDate
        );
    }

    public Transaction createTransaction(TransactionRequest request) {
        User currentUser = getCurrentUser();
        Transaction transaction = new Transaction(
                currentUser,
                request.getType(),
                request.getCategory(),
                request.getAmount(),
                request.getDescription(),
                request.getTransactionDate()
        );
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, TransactionRequest request) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to modify this transaction");
        }

        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this transaction");
        }

        transactionRepository.delete(transaction);
    }

    public SummaryResponse getSummary() {
        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findByUserId(currentUser.getId());

        double totalIncome = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = totalIncome - totalExpense;

        Map<String, Double> categorySummary = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        return new SummaryResponse(totalIncome, totalExpense, balance, categorySummary);
    }
}
