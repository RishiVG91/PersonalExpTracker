-- SQL Assessment Queries for Personal Expense Tracker
-- SETTribe LLP Intern Assessment

-- 1. Display all transactions.
SELECT * FROM transactions ORDER BY transaction_date DESC;

-- 2. Find expenses above a specific amount (e.g., 500).
SELECT * FROM transactions 
WHERE type = 'EXPENSE' AND amount > 500 
ORDER BY amount DESC;

-- 3. Calculate total income.
SELECT COALESCE(SUM(amount), 0) AS total_income 
FROM transactions 
WHERE type = 'INCOME';

-- 4. Calculate total expense.
SELECT COALESCE(SUM(amount), 0) AS total_expense 
FROM transactions 
WHERE type = 'EXPENSE';

-- 5. Calculate net balance.
SELECT 
    (COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) - 
     COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0)) AS net_balance
FROM transactions;

-- 6. Group expenses by category.
SELECT category, SUM(amount) AS total_category_expense 
FROM transactions 
WHERE type = 'EXPENSE' 
GROUP BY category 
ORDER BY total_category_expense DESC;

-- 7. Find monthly transactions for a specific month (e.g., August 2026).
SELECT * FROM transactions 
WHERE transaction_date >= '2026-08-01' AND transaction_date <= '2026-08-31'
ORDER BY transaction_date ASC;

-- 8. Join users with transactions.
SELECT 
    u.id AS user_id, 
    u.name AS user_name, 
    u.email AS user_email, 
    t.id AS transaction_id, 
    t.type AS transaction_type, 
    t.category, 
    t.amount, 
    t.description, 
    t.transaction_date 
FROM users u 
INNER JOIN transactions t ON u.id = t.user_id 
ORDER BY t.transaction_date DESC;
