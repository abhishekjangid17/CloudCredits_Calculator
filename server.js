const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log(err));

// Define schema & model
const calcSchema = new mongoose.Schema({ expression: String, result: String });
const Calculation = mongoose.model("Calculation", calcSchema);

// API routes
app.post("/calculate", async (req, res) => {
   const { expression, result } = req.body;
   const newCalculation = new Calculation({ expression, result });
   await newCalculation.save();
   res.json({ message: "Saved" });
});

app.get("/history", async (req, res) => {
   const history = await Calculation.find().sort({ _id: -1 }).limit(10);
   res.json(history);
});

// Serve frontend (dist folder)
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
