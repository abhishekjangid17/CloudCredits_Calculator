const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log(err));

const calcSchema = new mongoose.Schema({ expression: String, result: String });
const Calculation = mongoose.model("Calculation", calcSchema);

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

app.listen(5000, () => console.log("Server running on port 5000"));
