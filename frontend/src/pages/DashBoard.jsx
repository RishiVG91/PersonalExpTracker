import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Filter, 
  X, 
  AlertCircle, 
  Info,
  Calendar,
  Layers,
  Tag
} from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, categorySummary: {} });
  
  // Filtering states
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    category: '',
    amount: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filterType) params.append('type', filterType);
      if (filterCategory) params.append('category', filterCategory);
      if (filterStartDate) params.append('startDate', filterStartDate);
      if (filterEndDate) params.append('endDate', filterEndDate);

      const [txData, summaryData] = await Promise.all([
        api.get(`/transactions?${params.toString()}`),
        api.get('/transactions/summary')
      ]);

      setTransactions(txData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || 'Failed to load transaction data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType, filterCategory, filterStartDate, filterEndDate]);

  // Handle open modal for create
  const handleOpenAddModal = () => {
    setEditingTx(null);
    setFormData({
      type: 'EXPENSE',
      category: '',
      amount: '',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEditModal = (tx) => {
    setEditingTx(tx);
    setFormData({
      type: tx.type,
      category: tx.category,
      amount: tx.amount.toString(),
      description: tx.description || '',
      transactionDate: tx.transactionDate
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle submit modal form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    // Simple client side validation
    const errors = {};
    if (!formData.category.trim()) errors.category = 'Category is required.';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = 'Amount must be greater than 0.';
    if (!formData.transactionDate) errors.transactionDate = 'Date is required.';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingTx) {
        await api.put(`/transactions/${editingTx.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      try {
        const validationErrors = JSON.parse(err.message);
        setFormErrors(validationErrors);
      } catch (e) {
        setFormErrors({ global: err.message || 'Operation failed. Please try again.' });
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete
  const handleDeleteTx = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete transaction.');
    }
  };

  const handleClearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  // Helper formatting values
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  // Unique categories list for filters dropdown
  const allCategories = Object.keys(summary.categorySummary || {});

  return (
    <div className="app-container">
      {/* Header */}
      <header className="glass-panel" style={{ padding: '1rem 1.5rem', borderRadius: 'var(--radius-sm)' }}>
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '-4px' }}>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span>Personal</span> Expense Tracker
        </div>
        <div className="user-nav">
          <div className="user-info">
            <span className="username">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={logout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card income glass-panel">
          <div className="metric-header">
            <span>Total Income</span>
            <div className="metric-icon">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(summary.totalIncome)}</div>
        </div>

        <div className="metric-card expense glass-panel">
          <div className="metric-header">
            <span>Total Expenses</span>
            <div className="metric-icon">
              <TrendingDown size={20} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(summary.totalExpense)}</div>
        </div>

        <div className="metric-card balance glass-panel">
          <div className="metric-header">
            <span>Net Balance</span>
            <div className="metric-icon">
              <Wallet size={20} />
            </div>
          </div>
          <div className="metric-value" style={{ color: summary.balance >= 0 ? 'var(--color-primary)' : 'var(--color-expense)' }}>
            {formatCurrency(summary.balance)}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Transactions list */}
        <div className="transactions-panel glass-panel">
          <div className="panel-header">
            <h2>Transactions</h2>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              <Plus size={18} />
              Add Record
            </button>
          </div>

          {/* Filters Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <span className="filter-label">Type</span>
              <select 
                className="form-control" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Category</span>
              <select 
                className="form-control" 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">From Date</span>
              <input 
                type="date" 
                className="form-control" 
                value={filterStartDate} 
                onChange={(e) => setFilterStartDate(e.target.value)} 
              />
            </div>

            <div className="filter-group">
              <span className="filter-label">To Date</span>
              <input 
                type="date" 
                className="form-control" 
                value={filterEndDate} 
                onChange={(e) => setFilterEndDate(e.target.value)} 
              />
            </div>

            {(filterType || filterCategory || filterStartDate || filterEndDate) && (
              <button 
                className="btn btn-secondary" 
                style={{ alignSelf: 'flex-end', padding: '0.5rem 0.75rem' }}
                onClick={handleClearFilters}
              >
                Clear
              </button>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Transactions Table */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Fetching records...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <Info size={40} className="empty-icon" />
              <h3>No Transactions Found</h3>
              <p>Try clearing filters or add a new financial record to get started.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {new Date(tx.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge badge-${tx.type.toLowerCase()}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.category}</td>
                      <td style={{ color: tx.description ? 'var(--color-text-main)' : 'var(--color-text-dim)' }}>
                        {tx.description || '—'}
                      </td>
                      <td className={`tx-amount ${tx.type.toLowerCase()}`} style={{ textAlign: 'right' }}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleOpenEditModal(tx)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDeleteTx(tx.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Category Summary progress bar charts */}
        <div className="summary-panel glass-panel">
          <h2>Spending by Category</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Breakdown of your monthly expense distribution.
          </p>

          {allCategories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-dim)' }}>
              No expense records recorded yet.
            </div>
          ) : (
            <div className="category-list">
              {Object.entries(summary.categorySummary).map(([cat, amt]) => {
                const pct = summary.totalExpense > 0 ? (amt / summary.totalExpense) * 100 : 0;
                return (
                  <div className="category-item" key={cat}>
                    <div className="category-info">
                      <span className="category-name">{cat}</span>
                      <span className="category-value">
                        {formatCurrency(amt)} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: 'var(--color-expense)'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className="modal-title">{editingTx ? 'Edit Transaction' : 'Add Transaction'}</h2>
            
            {formErrors.global && (
              <div className="error-banner">
                <AlertCircle size={18} />
                <span>{formErrors.global}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Transaction Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn ${formData.type === 'EXPENSE' ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    style={{ height: '40px' }}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`btn ${formData.type === 'INCOME' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    style={{ height: '40px', color: formData.type === 'INCOME' ? '#0b0f19' : 'var(--color-text-main)' }}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                  <input
                    type="text"
                    id="category"
                    list="category-presets"
                    className="form-control"
                    style={{ paddingLeft: '38px', width: '100%' }}
                    placeholder="e.g. Food, Salary, Rent, Travel"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                  <datalist id="category-presets">
                    <option value="Salary" />
                    <option value="Freelance" />
                    <option value="Food & Dining" />
                    <option value="Shopping" />
                    <option value="Rent" />
                    <option value="Utilities" />
                    <option value="Transportation" />
                    <option value="Entertainment" />
                    <option value="Healthcare" />
                  </datalist>
                </div>
                {formErrors.category && <span className="error-text">{formErrors.category}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount (INR)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', fontWeight: 600, fontSize: '0.9rem' }}>₹</span>
                    <input
                      type="number"
                      step="any"
                      id="amount"
                      className="form-control"
                      style={{ paddingLeft: '28px', width: '100%' }}
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  {formErrors.amount && <span className="error-text">{formErrors.amount}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="transactionDate">Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)' }} />
                    <input
                      type="date"
                      id="transactionDate"
                      className="form-control"
                      style={{ paddingLeft: '38px', width: '100%' }}
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    />
                  </div>
                  {formErrors.transactionDate && <span className="error-text">{formErrors.transactionDate}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <input
                  type="text"
                  id="description"
                  className="form-control"
                  placeholder="e.g. Grocery shopping at store"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : editingTx ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
