import Transaction from "../models/Transaction.js";
import csvParser from "csv-parser";
import fs from "fs";

export const postTransactionController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileRows = [];
        fs.createReadStream(req.file.path)
            .pipe(csvParser())
            .on('data', (data) => fileRows.push(data))
            .on('end', async () => {
                fs.unlinkSync(req.file.path); // Remove the temporary file

                try {
                    const transactionData = {
                        TransactionID: row.TransactionID,
                        CustomerName: row.CustomerName,
                        TransactionDate: new Date(row.TransactionDate), // Assuming date format is valid
                        Amount: parseFloat(row.Amount), // Assuming amount is numeric
                        Status: row.Status,
                        InvoiceURL: row.InvoiceURL
                    };

                    // Check if a transaction with the same TransactionID already exists
                    const existingTransaction = await Transaction.findOne({ TransactionID: transactionData.TransactionID });
                    // If a transaction with the same ID exists, delete it
                    if (existingTransaction) {
                        await Transaction.findByIdAndDelete(existingTransaction._id);
                    }
                    // Insert the new transaction into the database
                    await Transaction.create(transactionData);

                    res.status(200).json({ message: 'File uploaded successfully and database updated' });
                } catch (error) {
                    console.error('Error uploading CSV file:', error);
                    res.status(500).json({ error: 'Error uploading CSV file' });
                }
            });
    } catch (err) {
        console.error('Error handling file upload:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getTransactionController = async (req, res) => {
    try {
        const allTransactions = await Transaction.find();
        res.status(200).json(allTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const updateTransactionController = async(req, res) => {
    try {
        // Extract the TransactionID from the request body
        const { TransactionID } = req.body;

        if (!TransactionID) {
            return res.status(400).json({ error: 'TransactionID is required in the request body' });
        }

        // Find the transaction by TransactionID
        const transaction = await Transaction.findOne({ TransactionID });

        // If transaction is not found, return an error
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const { TransactionID: updatedTransactionID, ...updatedData } = req.body;
        const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, updatedData, { new: true });

        // Send the updated transaction as response
        res.status(200).json(updatedTransaction);

    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteTransactionController = async (req, res) => {
    try {
        const TransactionID = req.body;
        const deleteTransaction = await Transaction.findByIdAndDelete(TransactionID);
        if (!deleteTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}