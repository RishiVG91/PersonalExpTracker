package com.settribe.expensetracker.controller;

import com.settribe.expensetracker.dto.SummaryResponse;
import com.settribe.expensetracker.dto.TransactionRequest;
import com.settribe.expensetracker.model.Transaction;
import com.settribe.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Transaction> transactions = transactionService.getTransactions(type, category, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createTransaction(request);
        return new ResponseEntity<>(transaction, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.updateTransaction(id, request);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Transaction deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary() {
        SummaryResponse summary = transactionService.getSummary();
        return ResponseEntity.ok(summary);
    }
}
