package com.settribe.expensetracker.dto;

import java.util.Map;

public class SummaryResponse {
    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Map<String, Double> categorySummary;

    public SummaryResponse() {}

    public SummaryResponse(Double totalIncome, Double totalExpense, Double balance, Map<String, Double> categorySummary) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.categorySummary = categorySummary;
    }

    // Getters and Setters
    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(Double totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Map<String, Double> getCategorySummary() {
        return categorySummary;
    }

    public void setCategorySummary(Map<String, Double> categorySummary) {
        this.categorySummary = categorySummary;
    }
}
