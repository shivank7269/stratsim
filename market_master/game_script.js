let gameState = {
    company_name: "",
    balance: 10000,
    employees: 0,
    reputation: 50,
    level: 1,
    company_value: 10000,
    market_share: 5,
    employee_satisfaction: 75,
    achievements: {
        "first-hire": false,
        "first-investment": false,
        "level-up": false,
        "market-leader": false
    }
};

// Stock market simulation
let stockData = {
    TECH: { price: 150.25, history: [] },
    REAL: { price: 85.60, history: [] },
    RETAIL: { price: 92.30, history: [] }
};
let portfolio = {
    cash: 10000,
    stocks: { TECH: {trades:[]}, REAL: {trades:[]}, RETAIL: {trades:[]} }
};
let selectedStock = '';
let tradeType = 'buy';

// Initialize stock chart
const ctx = document.getElementById('stockChart').getContext('2d');
const stockChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [{
            label: 'Stock Price',
            data: Array(20).fill(0),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: false }
        },
        plugins: {
            legend: { display: false }
        }
    }
});

$(document).ready(function() {
    // Show lightbox on page load
    setTimeout(function() {
        $('.lightbox-overlay, .lightbox-content').addClass('active');
    }, 500);

    // Handle next button clicks
    $('.btn-next').click(function() {
        const nextSlide = $(this).data('next');
        if (nextSlide) {
            $('.rule-slide').removeClass('active');
            $(`.rule-slide[data-slide="${nextSlide}"]`).addClass('active');
        } else {
            // Close lightbox when starting game
            $('.lightbox-overlay, .lightbox-content').removeClass('active');
            setTimeout(() => {
                $('.lightbox-overlay, .lightbox-content').hide();
            }, 300);
        }
    });

    // Initialize game
    $('#startGame').on('click', function() {
        const companyName = $('#companyName').val().trim();
        if (!companyName) {
            showError('Please enter a company name');
            return;
        }
        
        gameState.company_name = companyName;
        updateUI();
        
        // Show game panel with animation
        $('.setup-panel').removeClass('active').addClass('animate-fade-out');
        setTimeout(() => {
            $('.setup-panel').hide();
            $('.game-panel').addClass('active');
        }, 300);
        
        showSuccess(`Welcome to ${companyName}! Your business journey begins now.`);
    });

    // Game actions
    $('.btn-hire').on('click', function() {
        if (gameState.balance < 1000) {
            showError('Not enough funds to hire an employee');
            return;
        }
        
        gameState.balance -= 1000;
        gameState.employees += 1;
        gameState.company_value += 500;
        gameState.employee_satisfaction = Math.min(100, gameState.employee_satisfaction - 2);
        
        // Check for achievements
        if (gameState.employees === 1 && !gameState.achievements["first-hire"]) {
            gameState.achievements["first-hire"] = true;
            showAchievement("First Hire", "You hired your first employee!");
        }
        
        updateUI();
        showSuccess('Hired 1 new employee!');
    });

    $('.btn-expand').on('click', function() {
        if (gameState.balance < 5000) {
            showError('Not enough funds to expand business');
            return;
        }
        
        gameState.balance -= 5000;
        gameState.company_value += 3000;
        gameState.market_share = Math.min(100, gameState.market_share + 5);
        gameState.reputation = Math.min(100, gameState.reputation + 5);
        
        updateUI();
        showSuccess('Business expanded! Market share increased.');
    });

    $('.btn-research').on('click', function() {
        if (gameState.balance < 2500) {
            showError('Not enough funds for market research');
            return;
        }
        
        gameState.balance -= 2500;
        gameState.company_value += 1500;
        gameState.reputation = Math.min(100, gameState.reputation + 3);
        
        updateUI();
        showSuccess('Market research completed! New opportunities discovered.');
    });

    $('.btn-marketing').on('click', function() {
        if (gameState.balance < 3000) {
            showError('Not enough funds for marketing campaign');
            return;
        }
        
        gameState.balance -= 3000;
        gameState.company_value += 2000;
        gameState.market_share = Math.min(100, gameState.market_share + 8);
        gameState.reputation = Math.min(100, gameState.reputation + 7);
        
        updateUI();
        showSuccess('Marketing campaign successful! Brand awareness increased.');
    });

    // Update stock prices every 3 seconds
    setInterval(updateStockPrices, 3000);
    updateStockPrices();

    //Stock Market Modal Actions
    $('.stock-item').on('click', function() {
        const stock = $(this).data('stock');
        showTradeModal(stock);
    });

});

function updateUI() {
    
    // Update top stats
    $('#money').text('$' + gameState.balance.toLocaleString());
    $('#employees').text(gameState.employees + ' Employee' + (gameState.employees !== 1 ? 's' : ''));
    $('#level').text('Level ' + gameState.level);
    $('#reputation').text(gameState.reputation + ' Reputation');
    $('.company-name').text(gameState.company_name);
    
    // Update business stats
    $('#companyValue').text('$' + gameState.company_value.toLocaleString());
    $('#marketShare').text(gameState.market_share + '%');
    $('#employeeSatisfaction').text(gameState.employee_satisfaction + '%');
    
    // Update resource bars with animation
    $('.resource-bar').each(function() {
        const targetWidth = $(this).parent().next().find('span').text().replace(/[^0-9]/g, '');
        $(this).css('width', targetWidth + '%');
    });
    
    // Update achievements
    $('.achievement').each(function() {
        const achievementId = $(this).data('achievement');
        if (gameState.achievements[achievementId]) {
            $(this).find('.h-1').css('width', '100%');
            $(this).removeClass('bg-gray-100').addClass('bg-yellow-100 border border-yellow-300');
        }
    });
    
    // Check for level up
    if (gameState.company_value >= 20000 && gameState.level === 1) {
        gameState.level = 2;
        if (!gameState.achievements["level-up"]) {
            gameState.achievements["level-up"] = true;
            showAchievement("Level Up", "Congratulations! You reached Level 2!");
        }
        updateUI();
    }
    //update share holding
    updateShareHoldings();
}

function showError(message) {
    const errorDiv = $('<div>')
        .addClass('bg-red-500 text-white p-4 rounded-lg fixed bottom-4 right-4 z-50 animate-fade-in')
        .html('<span class="mr-2">❌</span>' + message);
    $('body').append(errorDiv);
    setTimeout(() => {
        errorDiv.addClass('animate-fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

function showSuccess(message) {
    const successDiv = $('<div>')
        .addClass('bg-green-500 text-white p-4 rounded-lg fixed bottom-4 right-4 z-50 animate-fade-in')
        .html('<span class="mr-2">✅</span>' + message);
    $('body').append(successDiv);
    setTimeout(() => {
        successDiv.addClass('animate-fade-out');
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showAchievement(title, message) {
    const achievementDiv = $('<div>')
        .addClass('bg-yellow-500 text-white p-4 rounded-lg fixed bottom-4 right-4 z-50 animate-fade-in max-w-xs')
        .html(`<div class="flex items-center">
            <span class="text-2xl mr-2">🏆</span>
            <div>
                <div class="font-bold">${title}</div>
                <div class="text-sm">${message}</div>
            </div>
        </div>`);
    $('body').append(achievementDiv);
    setTimeout(() => {
        achievementDiv.addClass('animate-fade-out');
        setTimeout(() => achievementDiv.remove(), 300);
    }, 5000);
}

function updateStockPrices() {
    Object.keys(stockData).forEach(stock => {
        const change = (Math.random() - 0.5) * 10;
        stockData[stock].price = Math.max(1, stockData[stock].price + change);
        stockData[stock].history.push(stockData[stock].price);
        if (stockData[stock].history.length > 20) stockData[stock].history.shift();
        
        const priceElement = document.getElementById(stock.toLowerCase() + 'Price');
        priceElement.textContent = `$${stockData[stock].price.toFixed(2)} ${change >= 0 ? '↗' : '↘'}`;
        priceElement.className = change >= 0 ? 'text-green-600' : 'text-red-600';
    });
    
    if (selectedStock) {
        updateChart();
    }
    updateShareHoldings();
}

function updateChart() {
    if (selectedStock) {
        stockChart.data.datasets[0].data = stockData[selectedStock].history;
        stockChart.data.datasets[0].borderColor = stockData[selectedStock].history.slice(-1)[0] >= stockData[selectedStock].history.slice(-2)[0] 
            ? 'rgb(34, 197, 94)' 
            : 'rgb(239, 68, 68)';
        stockChart.update();
    }
}

function showTradeModal(stock) {
    selectedStock = stock;
    $('#tradeModal').removeClass('hidden').addClass('flex');
    $('#selectedStock').text(`${stock} Stock`);
     //Get Current Stock Price when user clicks on Share to Buy
    const currentPrice = stockData[stock].price;
    $('#stockPrice').text(`$${currentPrice.toFixed(2)}`);
    $('#stockPrice').removeClass('text-red-600 text-green-600')
        .addClass(stockData[stock].history.length > 1 && 
            stockData[stock].history.slice(-1)[0] >= stockData[stock].history.slice(-2)[0] 
            ? 'text-green-600' : 'text-red-600');
    updateChart();
    
    // Update trade amount in real-time
    $('#tradeAmount').off('input').on('input', function() { // Prevent multiple bindings
        const amount = parseInt($(this).val()) || 0;
        if (amount > 0) {
            // Use currentPrice for calculations
            const total = amount * currentPrice;
            $('#tradeCost').text(`Total cost: $${total.toFixed(2)}`);
            if (tradeType === 'buy' && total > gameState.balance) {
                $('#tradeError').text('Not enough funds').removeClass('hidden');
            } else if (tradeType === 'sell') {
                let totalShares = 0;
                if (portfolio.stocks[stock] && portfolio.stocks[stock].trades) {
                    totalShares = portfolio.stocks[stock].trades.reduce((sum, trade) => sum + trade.shares, 0);
                }
                if (amount > totalShares) {
                    $('#tradeError').text('Not enough shares').removeClass('hidden');
                }
            } else {
                $('#tradeError').addClass('hidden');
            }
        } else {
            $('#tradeCost').text('');
            $('#tradeError').addClass('hidden');
        }
    });
}

function closeTradeModal() {
    $('#tradeModal').addClass('hidden').removeClass('flex');
    $('#tradeAmount').off('input').val('');
    $('#tradeCost').text('');
    $('#tradeError').addClass('hidden');
}

function setTradeType(type) {
    tradeType = type;
    // Re-trigger amount validation
    $('#tradeAmount').trigger('input');
}

function executeTrade() {
    const amount = parseInt($('#tradeAmount').val()) || 0;
    if (amount <= 0) {
        $('#tradeError').text('Please enter a valid amount').removeClass('hidden');
        return;
    }

    const tradePrice = parseFloat($('#stockPrice').text().replace('$', ''));

    if (isNaN(tradePrice)) {
        $('#tradeError').text('Invalid price. Please try again.').removeClass('hidden');
        return;
    }

    const totalCost = amount * tradePrice;

    if (tradeType === 'buy') {
        if (totalCost > gameState.balance) {
            $('#tradeError').text('Not enough funds').removeClass('hidden');
            return;
        }

        gameState.balance -= totalCost;
        // Add new trade to the trades array
        if (!portfolio.stocks[selectedStock].trades) {
            portfolio.stocks[selectedStock].trades = [];  // Initialize if needed
        }
        portfolio.stocks[selectedStock].trades.push({ shares: amount, price: tradePrice });

        // Check for first investment achievement
        if (!gameState.achievements["first-investment"]) {
            gameState.achievements["first-investment"] = true;
            showAchievement("First Investment", "You made your first stock purchase!");
        }

        showSuccess(`Purchased ${amount} shares of ${selectedStock} for $${totalCost.toFixed(2)}`);
    } else {  // Sell Logic
        let sharesToSell = amount;
        let totalRevenue = 0;

        if (!portfolio.stocks[selectedStock].trades) {
            $('#tradeError').text('You have no shares to sell').removeClass('hidden');
            return;
        }

        let tradeIndex = 0;
        while (sharesToSell > 0 && tradeIndex < portfolio.stocks[selectedStock].trades.length) {
            const trade = portfolio.stocks[selectedStock].trades[tradeIndex];

            if (trade.shares <= sharesToSell) {
                // Sell all shares from this trade
                totalRevenue += trade.shares * tradePrice;
                sharesToSell -= trade.shares;
                // Remove the trade
                portfolio.stocks[selectedStock].trades.splice(tradeIndex, 1); // Remove the trade from the array
            } else {
                // Sell a portion of the shares from this trade
                totalRevenue += sharesToSell * tradePrice;
                trade.shares -= sharesToSell;
                sharesToSell = 0;
                tradeIndex++;
            }
        }

        if (sharesToSell > 0) {
            $('#tradeError').text('Not enough shares to sell').removeClass('hidden');
            return;
        }

        gameState.balance += totalRevenue;
        showSuccess(`Sold ${amount} shares of ${selectedStock} for $${totalRevenue.toFixed(2)}`);
    }

    updateUI();
    updateShareHoldings();
    closeTradeModal();
}
function calculateTotalShares(stock) {
    if (!portfolio.stocks[stock] || !portfolio.stocks[stock].trades) {
        return 0;
    }
    return portfolio.stocks[stock].trades.reduce((sum, trade) => sum + trade.shares, 0);
}
function updateShareHoldings() {
    const shareHoldingsDiv = $('#share-holdings');
    shareHoldingsDiv.empty(); // Clear existing content

    let hasShares = false;  // Track if any shares are held
    for (const stock in portfolio.stocks) {
        if (portfolio.stocks[stock].trades && portfolio.stocks[stock].trades.length > 0) {
            hasShares = true;

            let totalShares = 0;
            let totalCost = 0;

            portfolio.stocks[stock].trades.forEach(trade => {
                totalShares += trade.shares;
                totalCost += trade.shares * trade.price;
            });

            const currentPrice = stockData[stock].price;
            const currentValue = totalShares * currentPrice;
            const profitLoss = currentValue - totalCost;
            const profitLossColorClass = profitLoss >= 0 ? 'text-green-600' : 'text-red-600'; // Conditional CSS class
            const profitLossText = profitLoss >= 0 ? 'Profit' : 'Loss';
            const avgPurchasePrice = totalCost / totalShares || 0;

            const holdingDiv = $(`<div style="display: flex; align-items: center;">
    <p class="text-gray-700" style="margin-right: 20px;">${stock}: ${totalShares} shares</p>
    <p class="text-gray-700" style="margin-right: 20px;">Avg. Purchase Price: $${avgPurchasePrice.toFixed(2)}</p>
    <p class="text-sm ${profitLossColorClass}">${profitLossText}: $${profitLoss.toFixed(2)}</p>
</div>`);
            shareHoldingsDiv.append(holdingDiv);
        }
    }

    if (!hasShares) {
        shareHoldingsDiv.append('<p class="text-gray-700">No shares purchased yet.</p>');
    }
}


// Initialize resource bars animation
setTimeout(() => {
    $('.resource-bar').each(function() {
        const targetWidth = $(this).parent().next().find('span').text().replace(/[^0-9]/g, '');
        $(this).css('width', targetWidth + '%');
    });
}, 500);