import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    TransactionID: {
        type: String,
        required: true,
    },
    CustomerName: {
        type: String,
    },
    TransactionDate: {
        type: Date,
    },
    Amount: {
        type: Number,
    },
    Status: {
        type: String,
        enum: ["Completed", "Pending", "Failed"],
    },
    InvoiceURL: {
        type: String,
    },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;