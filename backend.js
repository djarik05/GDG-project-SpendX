
        // ==================== DATA MANAGEMENT SYSTEM ====================
        
        // Centralized Data Store
        const appData = {
            income: {
                monthly: 30000,
                sources: [
                    { id: 1, name: 'Full-time Salary', amount: 25000, type: 'active', description: 'Fulltime monthly' },
                    { id: 2, name: 'Interest Income', amount: 3000, type: 'active', description: 'Most recent from niap FD Apr 15.1.5 Lakhs' },
                    { id: 3, name: 'Freelance or Side Income', amount: 2000, type: 'passive', description: 'Graphic designing gig payment April' },
                    { id: 4, name: 'Shopping', amount: 1600, type: 'passive', description: 'Interment April' }
                ],
                history: [
                    { month: 'Sep', amount: 26000 },
                    { month: 'Oct', amount: 28000 },
                    { month: 'Nov', amount: 27000 },
                    { month: 'Dec', amount: 29000 },
                    { month: 'Jan', amount: 28000 },
                    { month: 'Apr', amount: 30000 }
                ]
            },
            expenses: {
                monthly: 19000,
                categories: [
                    { name: 'Dining Out', amount: 7000, color: '#f97316' },
                    { name: 'Groceries', amount: 4100, color: '#22c55e' },
                    { name: 'Entertainment', amount: 3000, color: '#8b5cf6' },
                    { name: 'Transportation', amount: 2200, color: '#3b82f6' },
                    { name: 'Bills & Utilities', amount: 1900, color: '#eab308' },
                    { name: 'Shopping', amount: 1600, color: '#14b8a6' }
                ],
                transactions: []
            },
            investments: {
                total: 275000,
                breakdown: [
                    { name: 'SIP Investments', amount: 140000 },
                    { name: 'Stocks', amount: 75000 },
                    { name: 'FDs', amount: 50000 },
                    { name: 'Mutual Funds', amount: 10000 }
                ]
            },
            goals: [
                { id: 1, name: 'Monthly SIP', target: 5000, current: 5000, completed: true },
                { id: 2, name: 'Trip Fund', target: 22000, current: 10000, completed: false },
                { id: 3, name: 'Emergency Fund', target: 10000, current: 12000, completed: true }
            ],
            emi: {
                monthly: 5000,
                emiDue: 3500,
                billsDue: 1500
            }
        };

        // Calculate derived values
        function calculateDerivedValues() {
            appData.income.monthly = appData.income.sources.reduce((sum, source) => sum + source.amount, 0);
            appData.expenses.monthly = appData.expenses.categories.reduce((sum, cat) => sum + cat.amount, 0);
            appData.investments.total = appData.investments.breakdown.reduce((sum, inv) => sum + inv.amount, 0);
            
            // Data consistency validation
            validateDataConsistency();
        }

        // Validate data consistency across all pages
        function validateDataConsistency() {
            // Check if expenses exceed income (warning only)
            if (appData.expenses.monthly > appData.income.monthly) {
                console.warn('Warning: Expenses exceed income. Consider reviewing your spending.');
            }
            
            // Ensure all amounts are valid numbers
            if (isNaN(appData.income.monthly) || appData.income.monthly < 0) {
                appData.income.monthly = 0;
            }
            if (isNaN(appData.expenses.monthly) || appData.expenses.monthly < 0) {
                appData.expenses.monthly = 0;
            }
            if (isNaN(appData.investments.total) || appData.investments.total < 0) {
                appData.investments.total = 0;
            }
            
            // Validate income sources
            appData.income.sources = appData.income.sources.filter(source => {
                return source.amount >= 0 && !isNaN(source.amount) && source.name && source.name.trim().length > 0;
            });
            
            // Validate expense categories
            appData.expenses.categories = appData.expenses.categories.filter(cat => {
                return cat.amount >= 0 && !isNaN(cat.amount) && cat.name && cat.name.trim().length > 0;
            });
        }

        // Update all pages when data changes
        function updateAllPages() {
            calculateDerivedValues();
            updateDashboard();
            updateIncomePage();
            updateExpensesPage();
            updateInsightsPage();
            updateProfileStats();
            updateCharts();
            updateWelcomeMessage();
        }

        // Data Validation Functions
        function validateIncome(amount) {
            if (isNaN(amount) || amount < 0) {
                throw new Error('Income amount must be a positive number');
            }
            if (amount > 100000000) {
                throw new Error('Income amount is too large');
            }
            return true;
        }

        function validateExpense(amount) {
            if (isNaN(amount) || amount < 0) {
                throw new Error('Expense amount must be a positive number');
            }
            if (amount > 10000000) {
                throw new Error('Expense amount is too large');
            }
            return true;
        }

        function validateCategoryName(name) {
            if (!name || name.trim().length === 0) {
                throw new Error('Category name cannot be empty');
            }
            if (name.length > 50) {
                throw new Error('Category name is too long');
            }
            return true;
        }

        // Add Income Source
        function addIncomeSource(name, amount, type, description) {
            try {
                const amountNum = parseFloat(amount);
                validateIncome(amountNum);
                
                if (!name || name.trim().length === 0) {
                    throw new Error('Income source name is required');
                }
                
                const newId = Math.max(...appData.income.sources.map(s => s.id), 0) + 1;
                appData.income.sources.push({
                    id: newId,
                    name: name.trim(),
                    amount: amountNum,
                    type: type,
                    description: (description || '').trim()
                });
                updateAllPages();
                return true;
            } catch (error) {
                showNotification(error.message, 'error');
                return false;
            }
        }

        // Add Expense
        function addExpense(categoryName, amount) {
            try {
                const amountNum = parseFloat(amount);
                validateExpense(amountNum);
                validateCategoryName(categoryName);
                
                const category = appData.expenses.categories.find(cat => cat.name === categoryName);
                if (category) {
                    category.amount += amountNum;
                } else {
                    // Default colors for new categories
                    const colors = ['#f97316', '#22c55e', '#8b5cf6', '#3b82f6', '#eab308', '#14b8a6', '#ef4444', '#8b5cf6'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    appData.expenses.categories.push({
                        name: categoryName.trim(),
                        amount: amountNum,
                        color: randomColor
                    });
                }
                updateAllPages();
                return true;
            } catch (error) {
                showNotification(error.message, 'error');
                return false;
            }
        }

        // Update Dashboard
        function updateDashboard() {
            const savings = appData.income.monthly - appData.expenses.monthly;
            const savingsPercent = appData.income.monthly > 0 ? ((savings / appData.income.monthly) * 100).toFixed(0) : 0;

            // Update summary boxes
            const incomeEl = document.querySelector('.dash-summary-strip .summary-box:first-child .amount');
            const expensesEl = document.querySelector('.dash-summary-strip .summary-box:nth-child(2) .amount');
            const savingsEl = document.querySelector('.dash-summary-strip .savings-box h4');
            const savingsPercentEl = document.querySelector('.dash-summary-strip .savings-box .progress-labels span:last-child');
            const progressBar = document.querySelector('.dash-summary-strip .progress-bar-fill');
            const investmentEl = document.querySelector('.dash-summary-strip .summary-box:nth-child(4) .amount');

            if (incomeEl) incomeEl.textContent = `₹ ${appData.income.monthly.toLocaleString('en-IN')}`;
            if (expensesEl) expensesEl.textContent = `₹ ${appData.expenses.monthly.toLocaleString('en-IN')}`;
            if (savingsEl) savingsEl.textContent = `₹ ${savings.toLocaleString('en-IN')}`;
            if (savingsPercentEl) savingsPercentEl.textContent = `${savingsPercent}% saved`;
            if (progressBar) progressBar.style.width = `${savingsPercent}%`;
            if (investmentEl) investmentEl.textContent = `₹ ${appData.investments.total.toLocaleString('en-IN')}`;
        }

        // Update Income Page
        function updateIncomePage() {
            const monthlyIncomeEl = document.querySelector('.income-monthly-card h3');
            if (monthlyIncomeEl) monthlyIncomeEl.textContent = `₹${appData.income.monthly.toLocaleString('en-IN')}`;

            // Update income sources list
            const sourcesContainer = document.querySelector('.income-sources-card');
            if (sourcesContainer) {
                const activeContainer = sourcesContainer.querySelector('.income-category:first-child');
                const passiveContainer = sourcesContainer.querySelector('.income-category:last-child');
                
                if (activeContainer && passiveContainer) {
                    // Clear existing items (keep labels)
                    const activeItems = activeContainer.querySelectorAll('.income-source-item');
                    const passiveItems = passiveContainer.querySelectorAll('.income-source-item');
                    activeItems.forEach(item => item.remove());
                    passiveItems.forEach(item => item.remove());

                    // Add updated sources
                    appData.income.sources.forEach(source => {
                        const item = createIncomeSourceItem(source);
                        if (source.type === 'active') {
                            activeContainer.appendChild(item);
                        } else {
                            passiveContainer.appendChild(item);
                        }
                    });
                }
            }
        }

        // Create Income Source Item HTML
        function createIncomeSourceItem(source) {
            const div = document.createElement('div');
            div.className = 'income-source-item';
            const iconClass = source.type === 'active' ? 'bg-blue' : 'bg-purple';
            const icon = source.name.includes('Interest') ? 'ri-circle-fill' : 
                        source.name.includes('Freelance') ? 'ri-user-line' : 
                        source.name.includes('Shopping') ? 'ri-shopping-bag-line' : 'ri-building-line';
            
            div.innerHTML = `
                <div class="source-icon ${iconClass}">
                    <i class="${icon}"></i>
                </div>
                <div class="source-details">
                    <h4>${source.name}</h4>
                    <p>${source.description}</p>
                </div>
                <div class="source-amount">₹${source.amount.toLocaleString('en-IN')}</div>
            `;
            return div;
        }

        // Update Expenses Page
        function updateExpensesPage() {
            const totalExpensesEl = document.querySelector('.spending-summary-card .chart-center-label');
            if (totalExpensesEl) {
                totalExpensesEl.innerHTML = `₹${appData.expenses.monthly.toLocaleString('en-IN')}<br><span>Total Expenses</span>`;
            }

            // Update category list
            const categoriesList = document.querySelector('.spending-categories-list');
            if (categoriesList) {
                const categoryItems = categoriesList.querySelectorAll('.category-item');
                categoryItems.forEach(item => item.remove());
                
                // Remove savings message temporarily
                const savingsMsg = categoriesList.querySelector('.savings-message');
                
                appData.expenses.categories.forEach(category => {
                    const percentage = ((category.amount / appData.expenses.monthly) * 100).toFixed(0);
                    const item = document.createElement('div');
                    item.className = 'category-item';
                    item.innerHTML = `
                        <div class="category-info">
                            <div class="category-header">
                                <span class="dot" style="background: ${category.color};"></span>
                                <span class="category-name">${category.name}</span>
                            </div>
                            <div class="category-amounts">
                                <span class="amount">₹${category.amount.toLocaleString('en-IN')}</span>
                                <span class="percentage">${percentage}%</span>
                            </div>
                        </div>
                        <div class="category-progress-bar">
                            <div class="category-progress-fill" style="width: ${percentage}%; background: ${category.color};"></div>
                        </div>
                    `;
                    categoriesList.insertBefore(item, savingsMsg.nextSibling);
                });
            }

            // Update savings message
            const savingsPercent = ((appData.income.monthly - appData.expenses.monthly) / appData.income.monthly * 100).toFixed(0);
            const savingsMsgEl = document.querySelector('.savings-message span:last-child');
            if (savingsMsgEl) {
                savingsMsgEl.textContent = `You saved ${savingsPercent}% of your income this month!`;
            }
        }

        // Update Insights Page
        function updateInsightsPage() {
            const savings = appData.income.monthly - appData.expenses.monthly;
            const savingsPercent = appData.income.monthly > 0 ? ((savings / appData.income.monthly) * 100).toFixed(0) : 0;
            const expensesPercent = appData.income.monthly > 0 ? ((appData.expenses.monthly / appData.income.monthly) * 100).toFixed(2) : 0;
            const savingsPercentDisplay = appData.income.monthly > 0 ? ((savings / appData.income.monthly) * 100).toFixed(2) : 0;

            // Update savings title
            const savingsTitle = document.querySelector('.savings-title');
            if (savingsTitle) {
                savingsTitle.textContent = `You saved ${savingsPercent}% of your income this month! 👍`;
            }

            // Update Income metric box
            const incomeValue = document.querySelector('.insight-metric-box:first-child .metric-value');
            if (incomeValue) {
                incomeValue.textContent = `₹ ${appData.income.monthly.toLocaleString('en-IN')}`;
            }

            // Update Income breakdown bar
            const incomeBar = document.querySelector('.insight-metric-box:first-child .metric-breakdown-bar');
            if (incomeBar) {
                const expensesWidth = appData.income.monthly > 0 ? (appData.expenses.monthly / appData.income.monthly * 100) : 0;
                const savingsWidth = appData.income.monthly > 0 ? (savings / appData.income.monthly * 100) : 0;
                
                incomeBar.innerHTML = `
                    <div class="bar-segment expenses-segment" style="width: ${expensesWidth}%;">
                        <span class="segment-label">₹ ${appData.expenses.monthly.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="bar-segment savings-segment" style="width: ${savingsWidth}%;">
                        <span class="segment-label">₹ ${savings.toLocaleString('en-IN')}</span>
                    </div>
                `;
            }

            // Update Expenses metric box
            const expensesValue = document.querySelector('.insight-metric-box:nth-child(2) .metric-value');
            if (expensesValue) {
                expensesValue.textContent = `₹ ${appData.expenses.monthly.toLocaleString('en-IN')}`;
            }

            // Calculate Essentials vs Wants
            const essentialCategories = ['Groceries', 'Bills & Utilities', 'Transportation'];
            const essentialAmount = appData.expenses.categories
                .filter(cat => essentialCategories.includes(cat.name))
                .reduce((sum, cat) => sum + cat.amount, 0);
            const wantsAmount = appData.expenses.monthly - essentialAmount;
            const essentialPercent = appData.expenses.monthly > 0 ? ((essentialAmount / appData.expenses.monthly) * 100).toFixed(0) : 0;
            const wantsPercent = appData.expenses.monthly > 0 ? ((wantsAmount / appData.expenses.monthly) * 100).toFixed(0) : 0;
            const essentialPercentOfIncome = appData.income.monthly > 0 ? ((essentialAmount / appData.income.monthly) * 100).toFixed(0) : 0;
            const wantsPercentOfIncome = appData.income.monthly > 0 ? ((wantsAmount / appData.income.monthly) * 100).toFixed(0) : 0;

            // Update Expenses breakdown bar (showing needs vs wants)
            const expensesBar = document.querySelector('.insight-metric-box:nth-child(2) .metric-breakdown-bar');
            if (expensesBar) {
                const essentialWidth = appData.expenses.monthly > 0 ? (essentialAmount / appData.expenses.monthly * 100) : 0;
                const wantsWidth = appData.expenses.monthly > 0 ? (wantsAmount / appData.expenses.monthly * 100) : 0;
                
                expensesBar.innerHTML = `
                    <div class="bar-segment expenses-segment" style="width: ${essentialWidth}%;">
                        <span class="segment-label">₹ ${essentialAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div class="bar-segment savings-segment" style="width: ${wantsWidth}%;">
                        <span class="segment-label">₹ ${wantsAmount.toLocaleString('en-IN')}</span>
                    </div>
                `;
            }

            // Update Good Spending Habits section
            const essentialsAmountEl = document.querySelector('.habit-item:first-child .habit-header span:first-child');
            const essentialsPercentEl = document.querySelector('.habit-item:first-child .habit-percentage');
            const essentialsBar = document.querySelector('.habit-item:first-child .habit-bar-fill');
            if (essentialsAmountEl) essentialsAmountEl.textContent = `Essentials ₹ ${essentialAmount.toLocaleString('en-IN')}`;
            if (essentialsPercentEl) essentialsPercentEl.textContent = `${essentialPercentOfIncome}%`;
            if (essentialsBar) essentialsBar.style.width = `${essentialPercentOfIncome}%`;

            const wantsAmountEl = document.querySelector('.habit-item:nth-child(2) .habit-header span:first-child');
            const wantsPercentEl = document.querySelector('.habit-item:nth-child(2) .habit-percentage');
            const wantsBar = document.querySelector('.habit-item:nth-child(2) .habit-bar-fill');
            if (wantsAmountEl) wantsAmountEl.textContent = `Wants ₹ ${wantsAmount.toLocaleString('en-IN')}`;
            if (wantsPercentEl) wantsPercentEl.textContent = `${wantsPercentOfIncome}%`;
            if (wantsBar) wantsBar.style.width = `${wantsPercentOfIncome}%`;

            // Update AI reply with current data
            const aiReplyText = document.querySelector('.insights-view .reply-text');
            if (aiReplyText) {
                aiReplyText.textContent = `Sure! Based on your ₹ ${appData.income.monthly.toLocaleString('en-IN')} income and ₹ ${appData.expenses.monthly.toLocaleString('en-IN')} expenses, yes, you can afford a ₹ 5,000 SIP.`;
            }

            const aiReplyPoints = document.querySelector('.insights-view .reply-points');
            if (aiReplyPoints) {
                const leftover = appData.income.monthly - appData.expenses.monthly - 5000;
                aiReplyPoints.innerHTML = `
                    <li>After SIP, you'll have ₹ ${leftover.toLocaleString('en-IN')} leftover. Good cushion for savings!</li>
                    <li>SIP is a smart way to grow your money long term, try sticking to it.</li>
                `;
            }
        }

        // Update Profile Stats
        function updateProfileStats() {
            const incomeStat = document.querySelector('.profile-stats-card .stat-item:first-child .stat-value');
            const expensesStat = document.querySelector('.profile-stats-card .stat-item:nth-child(2) .stat-value');
            const investmentsStat = document.querySelector('.profile-stats-card .stat-item:nth-child(3) .stat-value');
            if (incomeStat) incomeStat.textContent = `₹${appData.income.monthly.toLocaleString('en-IN')}`;
            if (expensesStat) expensesStat.textContent = `₹${appData.expenses.monthly.toLocaleString('en-IN')}`;
            if (investmentsStat) investmentsStat.textContent = `₹${appData.investments.total.toLocaleString('en-IN')}`;
        }

        // Update Charts
        function updateCharts() {
            // Destroy existing charts to force re-render
            if (spendingChartInstance) {
                spendingChartInstance.destroy();
                spendingChartInstance = null;
            }
            if (spendingChartMainInstance) {
                spendingChartMainInstance.destroy();
                spendingChartMainInstance = null;
            }
            if (incomeChartInstance) {
                incomeChartInstance.destroy();
                incomeChartInstance = null;
            }
        }

        // Simple View Switcher
        function switchTab(viewId, btnElement, quickQuery = null) {
            // Update Navigation UI
            if (btnElement) {
                document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
                btnElement.classList.add('active');
            }

            // Hide all views
            document.getElementById('dashboard-view').style.display = 'none';
            document.getElementById('ask-view').style.display = 'none';
            const insightsView = document.getElementById('insights-view');
            if (insightsView) insightsView.style.display = 'none';
            const expensesView = document.getElementById('expenses-view');
            const incomeView = document.getElementById('income-view');
            const investmentsView = document.getElementById('investments-view');
            const emiView = document.getElementById('emi-view');
            const goalsView = document.getElementById('goals-view');
            const profileView = document.getElementById('profile-view');
            if (expensesView) expensesView.style.display = 'none';
            if (incomeView) incomeView.style.display = 'none';
            if (investmentsView) investmentsView.style.display = 'none';
            if (emiView) emiView.style.display = 'none';
            if (goalsView) goalsView.style.display = 'none';
            if (profileView) profileView.style.display = 'none';

            // Show selected view
            if (viewId === 'dashboard') {
                document.getElementById('dashboard-view').style.display = 'grid';
                document.getElementById('page-title').innerHTML = "Hello <span>Arjun</span>, here's your current month overview.";
            } else if (viewId === 'ask') {
                document.getElementById('ask-view').style.display = 'flex';
                document.getElementById('page-title').innerText = "Ask FinGuide";
                
                // If clicked from a quick action button
                if (quickQuery) {
                    document.getElementById('user-input').value = quickQuery;
                    sendMessage();
                }
            } else if (viewId === 'insights') {
                if (insightsView) {
                    insightsView.style.display = 'block';
                    updateInsightsPage();
                }
                document.getElementById('page-title').innerText = "Insights";
            } else if (viewId === 'expenses') {
                if (expensesView) {
                    expensesView.style.display = 'block';
                    updateExpensesPage();
                    renderSpendingChartMain();
                }
                document.getElementById('page-title').innerText = "Spending";
            } else if (viewId === 'income') {
                if (incomeView) {
                    incomeView.style.display = 'block';
                    updateIncomePage();
                    renderIncomeChart();
                }
                document.getElementById('page-title').innerHTML = "Income";
            } else if (viewId === 'investments') {
                if (investmentsView) {
                    investmentsView.style.display = 'block';
                    renderInvestmentsChart();
                }
                document.getElementById('page-title').innerText = "Investments";
            } else if (viewId === 'emi') {
                if (emiView) emiView.style.display = 'block';
                document.getElementById('page-title').innerText = "EMI / Bills";
            } else if (viewId === 'goals') {
                if (goalsView) goalsView.style.display = 'block';
                document.getElementById('page-title').innerText = "Goals";
            } else if (viewId === 'profile') {
                if (profileView) {
                    profileView.style.display = 'block';
                    updateProfileStats();
                }
                document.getElementById('page-title').innerText = "Profile";
            }
        }

        // Modal Functions
        function openAddIncomeModal() {
            document.getElementById('addIncomeModal').style.display = 'flex';
        }

        function closeAddIncomeModal() {
            document.getElementById('addIncomeModal').style.display = 'none';
            document.getElementById('addIncomeForm').reset();
        }

        function openAddExpenseModal() {
            document.getElementById('addExpenseModal').style.display = 'flex';
        }

        function closeAddExpenseModal() {
            document.getElementById('addExpenseModal').style.display = 'none';
            document.getElementById('addExpenseForm').reset();
        }

        // Handle Income Form Submission
        function handleAddIncome(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('incomeName');
            const amount = formData.get('incomeAmount');
            const type = formData.get('incomeType');
            const description = formData.get('incomeDescription') || '';

            if (name && amount && type) {
                const success = addIncomeSource(name, amount, type, description);
                if (success) {
                    closeAddIncomeModal();
                    showNotification('Income source added successfully!', 'success');
                }
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        }

        // Handle Expense Form Submission
        function handleAddExpense(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const category = formData.get('expenseCategory');
            const amount = formData.get('expenseAmount');
            const customCategory = formData.get('customCategory');

            const categoryName = category === 'custom' ? customCategory : category;

            if (categoryName && amount) {
                const success = addExpense(categoryName, amount);
                if (success) {
                    closeAddExpenseModal();
                    showNotification('Expense added successfully!', 'success');
                }
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        }

        // Notification System
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            
            if (type === 'success') {
                notification.style.background = '#22c55e';
            } else if (type === 'error') {
                notification.style.background = '#ef4444';
            } else {
                notification.style.background = '#3b82f6';
            }
            
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);

            setTimeout(() => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Calculate initial values
            calculateDerivedValues();
            
            // Update all pages with initial data
            updateAllPages();
            
            // Attach form handlers
            const incomeForm = document.getElementById('addIncomeForm');
            const expenseForm = document.getElementById('addExpenseForm');
            if (incomeForm) incomeForm.addEventListener('submit', handleAddIncome);
            if (expenseForm) expenseForm.addEventListener('submit', handleAddExpense);
            
            // Connect mini input buttons
            document.querySelectorAll('.ask-input-mini button').forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    if (input && input.value.trim()) {
                        // Set the main input value and send
                        const mainInput = document.getElementById('user-input');
                        if (mainInput) {
                            mainInput.value = input.value.trim();
                            input.value = '';
                            sendMessage();
                        }
                    }
                });
            });
            
            // Connect mini input enter key
            document.querySelectorAll('.ask-input-mini input').forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const btn = this.parentElement.querySelector('button');
                        if (btn) btn.click();
                    }
                });
            });
            
            // Update welcome message with dynamic data
            updateWelcomeMessage();
        });

        // Update welcome message with current financial data
        function updateWelcomeMessage() {
            const welcomeMsg = document.querySelector('#chat-history .message.msg-ai:first-child');
            if (welcomeMsg) {
                welcomeMsg.innerHTML = `
                    <strong>SpendX AI</strong><br>
                    Hi User-name! I'm your finance copilot. Based on your ₹${appData.income.monthly.toLocaleString('en-IN')} income, ask me anything! <br><br>
                    Try asking: <br>
                    <span style="color:var(--primary); cursor:pointer;" onclick="switchTab('ask', null, 'Can I afford a ₹5,000 SIP?')">"Can I afford a ₹5,000 SIP?"</span>
                `;
            }
        }

        // Insights Chart
        let spendingChartInstance = null;

        function renderSpendingChart() {
            const ctx = document.getElementById('spendingChart');
            if (!ctx || typeof Chart === 'undefined') return;

            if (spendingChartInstance) {
                spendingChartInstance.destroy();
            }

            const labels = appData.expenses.categories.map(cat => cat.name);
            const data = appData.expenses.categories.map(cat => cat.amount);
            const colors = appData.expenses.categories.map(cat => cat.color);

            spendingChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10
                        }
                    }
                }
            });
        }

        // Income Chart
        let incomeChartInstance = null;

        function renderIncomeChart() {
            const ctx = document.getElementById('incomeChart');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (incomeChartInstance) {
                incomeChartInstance.destroy();
            }

            incomeChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Apr'],
                    datasets: [{
                        label: 'Income',
                        data: [26000, 28000, 27000, 29000, 28000, 30000],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return '₹' + context.parsed.y.toLocaleString('en-IN');
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 20000,
                            max: 35000,
                            ticks: {
                                callback: function(value) {
                                    return '₹' + (value / 1000) + 'k';
                                },
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            },
                            grid: {
                                color: '#f1f5f9',
                                drawBorder: false
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        // Spending Chart (Main)
        let spendingChartMainInstance = null;

        function renderSpendingChartMain() {
            const ctx = document.getElementById('spendingChartMain');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (spendingChartMainInstance) {
                spendingChartMainInstance.destroy();
            }

            const labels = appData.expenses.categories.map(cat => cat.name);
            const data = appData.expenses.categories.map(cat => cat.amount);
            const colors = appData.expenses.categories.map(cat => cat.color);

            spendingChartMainInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toLocaleString('en-IN');
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(0);
                                    return label + ': ' + value + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Investments Chart
        let investmentsChartInstance = null;

        function renderInvestmentsChart() {
            const ctx = document.getElementById('investmentsChart');
            if (!ctx || typeof Chart === 'undefined') return;

            // Destroy existing chart if it exists
            if (investmentsChartInstance) {
                investmentsChartInstance.destroy();
            }

            investmentsChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['SIP Investments', 'Stocks', 'FDs', 'Mutual Funds'],
                    datasets: [{
                        data: [140000, 75000, 50000, 10000],
                        backgroundColor: [
                            '#3b82f6',
                            '#8b5cf6',
                            '#f59e0b',
                            '#22c55e'
                        ],
                        borderWidth: 0,
                        hoverOffset: 6
                    }]
                },
                options: {
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#0f172a',
                            padding: 10,
                            cornerRadius: 10,
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = '₹' + context.parsed.toLocaleString('en-IN');
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(0);
                                    return label + ': ' + value + ' (' + percentage + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Income Subnav Handler
        function switchIncomeSubnav(activeBtn) {
            document.querySelectorAll('.subnav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }

        // Initialize subnav buttons
        document.addEventListener('DOMContentLoaded', function() {
            const subnavButtons = document.querySelectorAll('.subnav-btn');
            subnavButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Check which view it belongs to
                    const isIncomeView = this.closest('.income-view');
                    const isSpendingView = this.closest('.spending-view');
                    const isInvestmentsView = this.closest('.investments-view');
                    const isGoalsView = this.closest('.goals-view');
                    const isEmiView = this.closest('.emi-view');
                    
                    if (isIncomeView || isSpendingView || isInvestmentsView || isGoalsView || isEmiView) {
                        switchIncomeSubnav(this); // Same function works for all
                    }
                });
            });
        });

        // Gemini API Configuration
        // Load API key from api.env file or use hardcoded fallback
        // Note: In production, use environment variables or secure key management
        let GEMINI_API_KEY = '';
        
        // Function to load API key from api.env file
        async function loadApiKey() {
            try {
                const response = await fetch('api.env');
                if (response.ok) {
                    const text = await response.text();
                    GEMINI_API_KEY = text.trim();
                    console.log('✅ API key loaded from api.env file');
                }
            } catch (e) {
                console.log('⚠️ Could not load api.env file, using fallback key');
            }
            
            // Fallback to hardcoded key if env file not available or invalid
            if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
                // Read from api.env content: AIzaSyBzTC57E8ZulRzBTjlgW-6pqMafTZxJsZs
                GEMINI_API_KEY = 'AIzaSyBzTC57E8ZulRzBTjlgW-6pqMafTZxJsZs';
                console.log('✅ Using fallback API key');
            }
            
            // Verify API key is configured
            if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
                console.error('⚠️ Warning: Gemini API key is not properly configured!');
            } else {
                console.log('✅ Gemini API key is configured and ready to use');
            }
        }
        
        // Using Gemini 1.5 Flash model (fast, efficient, and cost-effective)
        const GEMINI_MODEL = 'gemini-2.5-flash';
        
        // API URLs (will be set after key is loaded)
        let GEMINI_API_URL = '';
        let GEMINI_API_URL_ALT = '';
        
        function updateApiUrls() {
            // Primary endpoint - v1 API with gemini-2.5-flash
            GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
            // Alternative endpoint - v1beta API (fallback)
            GEMINI_API_URL_ALT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
        }
        
        // Initialize API key on page load
        loadApiKey().then(() => {
            updateApiUrls();
        });
        

        // Build financial context for AI
        function buildFinancialContext() {
            const savings = appData.income.monthly - appData.expenses.monthly;
            const savingsPercent = appData.income.monthly > 0 ? ((savings / appData.income.monthly) * 100).toFixed(0) : 0;
            const emiAmount = appData.emi ? appData.emi.monthly : 0;
            
            const expenseCategories = appData.expenses.categories
                .map(cat => `${cat.name}: ₹${cat.amount.toLocaleString('en-IN')}`)
                .join(', ');
            
            const incomeSources = appData.income.sources
                .map(src => `${src.name}: ₹${src.amount.toLocaleString('en-IN')}`)
                .join(', ');
            
            return `You are FinGuide AI, a Personal Finance Decision Assistant. You provide educational & decision-support guidance only. You are NOT a SEBI-registered advisor.

IMPORTANT: You MUST always respond in this EXACT format (keep it SHORT and CONCISE, no full summaries):

Decision: [YES/NO/MAYBE - brief answer]

Reason:
[2-3 lines explaining the calculation/analysis]

Risk:
[1-2 lines about potential risks]

Recommendation:
- [Action item 1]
- [Action item 2]
- [Action item 3]

User's Financial Data:
Monthly Income: ₹${appData.income.monthly.toLocaleString('en-IN')}
Income Sources: ${incomeSources}
Monthly Expenses: ₹${appData.expenses.monthly.toLocaleString('en-IN')}
Expense Categories: ${expenseCategories}
Monthly EMI: ₹${emiAmount.toLocaleString('en-IN')}
Monthly Savings: ₹${savings.toLocaleString('en-IN')} (${savingsPercent}% of income)
Total Investments: ₹${appData.investments.total.toLocaleString('en-IN')}

Key Rules:
- Monthly Savings = Income − Expenses − EMI
- SIP amount ≤ Monthly savings
- SIP should not exceed 30% of income
- Emergency fund target = 6 × monthly expenses
- EMI > 40% of income → High Risk
- Expenses > 80% of income → Lifestyle Risk
- Always use ₹ currency format
- Keep responses SHORT and ACTIONABLE
- Never provide full summaries or lengthy explanations
- Always include: "This guidance is for educational purposes only and not professional financial advice."

Now answer the user's question in the required format above.`;
        }

        // Chat Logic
        function handleEnter(e) {
            if (e.key === 'Enter') sendMessage();
        }

        async function sendMessage() {
            const input = document.getElementById('user-input');
            const message = input.value.trim();
            const chatHistory = document.getElementById('chat-history');

            if (message === "") return;

            // 1. Add User Message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'message msg-user';
            userMsgDiv.innerText = message;
            chatHistory.appendChild(userMsgDiv);

            // Clear Input
            input.value = "";

            // Disable input while processing
            input.disabled = true;
            const sendBtn = document.querySelector('.send-btn');
            if (sendBtn) sendBtn.disabled = true;

            // 2. Show loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message msg-ai';
            loadingDiv.id = 'loading-message';
            loadingDiv.innerHTML = '<strong>Gemini</strong><br>Thinking...';
            chatHistory.appendChild(loadingDiv);
            chatHistory.scrollTop = chatHistory.scrollHeight;

            try {
                // Ensure API key is loaded before making request
                if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 10) {
                    await loadApiKey();
                    updateApiUrls();
                }
                
                // Ensure API URLs are set
                if (!GEMINI_API_URL) {
                    updateApiUrls();
                }
                
                // 3. Call Gemini API
                const financialContext = buildFinancialContext();
                const fullPrompt = `${financialContext}\n\nUser Question: ${message}\n\nProvide a helpful response:`;

                const requestBody = {
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }]
                };

                // Try primary endpoint first, fallback to alternative if 404
                let response = await fetch(GEMINI_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                // If 404, try alternative endpoints
                if (response.status === 404) {
                    console.log('Primary endpoint returned 404, trying v1beta endpoint...');
                    response = await fetch(GEMINI_API_URL_ALT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody)
                    });
                    
                    // If still 404, the model might not be available
                    if (response.status === 404) {
                        console.log('v1beta endpoint also returned 404, model may not be available');
                        throw new Error('Gemini 1.5 Flash model is not available. Please check your API key and model access.');
                    }
                }

                if (!response.ok) {
                    // Get more detailed error information
                    let errorMessage = response.statusText;
                    let errorData = {};
                    try {
                        errorData = await response.clone().json();
                        if (errorData.error && errorData.error.message) {
                            errorMessage = errorData.error.message;
                        }
                        console.error('API Error Details:', {
                            status: response.status,
                            statusText: response.statusText,
                            error: errorData
                        });
                    } catch (e) {
                        console.error('Could not parse error response:', e);
                    }
                    throw new Error(`API Error ${response.status}: ${errorMessage}`);
                }

                const data = await response.json();
                
                // Remove loading message
                loadingDiv.remove();

                // 4. Display AI Response
                const aiMsgDiv = document.createElement('div');
                aiMsgDiv.className = 'message msg-ai';
                
                // Handle different response formats
                let aiText = '';
                if (data.candidates && data.candidates[0]) {
                    if (data.candidates[0].content && data.candidates[0].content.parts) {
                        aiText = data.candidates[0].content.parts[0].text;
                    } else if (data.candidates[0].text) {
                        aiText = data.candidates[0].text;
                    }
                }
                
                if (aiText) {
                    // Format the response
                    aiMsgDiv.innerHTML = `
                        <strong>Gemini</strong><br>
                        ${formatAIResponse(aiText)}
                    `;
                } else if (data.error) {
                    throw new Error(data.error.message || 'API returned an error');
                } else {
                    throw new Error('Unexpected response format from API');
                }
                
                chatHistory.appendChild(aiMsgDiv);
                chatHistory.scrollTop = chatHistory.scrollHeight;

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                
                // Remove loading message
                loadingDiv.remove();

                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'message msg-ai';
                errorDiv.innerHTML = `
                    <strong>Gemini</strong><br>
                    Sorry, I'm having trouble connecting right now. Please try again in a moment.
                    <br><small style="color: #64748b;">Error: ${error.message}</small>
                `;
                chatHistory.appendChild(errorDiv);
                chatHistory.scrollTop = chatHistory.scrollHeight;
            } finally {
                // Re-enable input
                input.disabled = false;
                if (sendBtn) sendBtn.disabled = false;
                input.focus();
            }
        }

        // Format AI response for better display with structured format
        function formatAIResponse(text) {
            // Check if response follows the structured format
            const hasDecision = /Decision:\s*[YES|NO|MAYBE]/i.test(text);
            const hasReason = /Reason:/i.test(text);
            const hasRisk = /Risk:/i.test(text);
            const hasRecommendation = /Recommendation:/i.test(text);
            
            if (hasDecision || hasReason || hasRisk || hasRecommendation) {
                // Format structured response
                let formatted = text
                    // Format Decision
                    .replace(/Decision:\s*([^\n]+)/gi, '<div class="ai-decision"><strong>Decision:</strong> $1</div>')
                    // Format Reason section
                    .replace(/Reason:\s*\n?([^\n]+(?:\n[^\n]+)*?)(?=\n(?:Risk:|Recommendation:|$))/gi, 
                        '<div class="ai-reason"><strong>Reason:</strong><br>$1</div>')
                    // Format Risk section
                    .replace(/Risk:\s*\n?([^\n]+(?:\n[^\n]+)*?)(?=\n(?:Recommendation:|$))/gi, 
                        '<div class="ai-risk"><strong>Risk:</strong><br>$1</div>')
                    // Format Recommendation section
                    .replace(/Recommendation:\s*\n?([^\n]+(?:\n[^\n]+)*?)(?=\n|$)/gi, 
                        '<div class="ai-recommendation"><strong>Recommendation:</strong><br>$1</div>')
                    // Format bullet points
                    .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
                    // Convert line breaks
                    .replace(/\n/g, '<br>');
                
                // Wrap bullet points in ul tags
                formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
                
                // Add disclaimer if not present
                if (!formatted.includes('educational purposes')) {
                    formatted += '<div class="ai-disclaimer" style="margin-top: 12px; padding: 10px; background: #f0f9ff; border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 0.85rem; color: #64748b;"><em>This guidance is for educational purposes only and not professional financial advice.</em></div>';
                }
                
                return formatted;
            } else {
                // Format regular response
                let formatted = text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                    .replace(/\n\n/g, '</p><p>') // Paragraphs
                    .replace(/\n/g, '<br>'); // Line breaks
                
                if (!formatted.startsWith('<p>')) {
                    formatted = '<p>' + formatted + '</p>';
                }
                
                // Convert bullet points
                formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
                if (formatted.includes('<li>')) {
                    formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
                }
                
                return formatted;
            }
        }
    