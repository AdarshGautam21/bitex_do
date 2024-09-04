const express = require('express');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Transaction = require('./models/wallet/WalletTransactions');

const app = express();

const PORT = process.env.PORT || 5000;
// const uri = 'mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex';
const uri = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";


// MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(uri)
.then(() => {
    console.log("Connected to mongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB", error);
})


// API endpoint to fetch transactions by userId
app.get('/api/transactions/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const transactions = await Transaction.find({ userId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to fetch transactions by date range
app.get('/api/transactions/date/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to generate Excel file for transactions by date range
app.get('/api/transactions/export/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const transactions = await Transaction.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    const data = transactions.map(transaction => ({
        orderType: transaction.orderType,
        date: transaction.date,
        account: transaction.account,
        value: transaction.value,
        rate: transaction.rate,
        status: transaction.status,
    }));
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Transactions');
    const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
