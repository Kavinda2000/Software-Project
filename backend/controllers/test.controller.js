import mongoose from "mongoose";
import Test from "../models/test.js"

// Get all Tests
export const getTests = async (req, res) => {
    try {
        const tests = await Test.find({});
        res.status(200).json({ success: true, data: tests });
    } catch (error) {
        console.error("Error fetching Tests:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Create a new Test
export const createTest = async (req, res) => {
    const { name, testType, address, price, owner, timeSlots } = req.body;

    if (!name || !testType || !address || !owner) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        const existingTest = await Test.findOne({ name, owner });
        if (existingTest) {
            return res.status(409).json({ success: false, message: "Test already exists" });
        }

        const newTest = new Test({
            name,
            testType,
            address,
            price,
            owner,
            timeSlots
        });

        await newTest.save();
        res.status(201).json({ success: true, data: newTest });
    } catch (error) {
        console.error("Error creating Test:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update a Test
export const updateTest = async (req, res) => {
    const { id } = req.params;
    const testData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Test Id" });
    }

    try {
        const updatedTest = await Test.findByIdAndUpdate(id, testData, { new: true });
        res.status(200).json({ success: true, data: updatedTest });
    } catch (error) {
        console.error("Error updating Test:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Delete a Test
export const deleteTest = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Test Id" });
    }

    try {
        await Test.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Test deleted" });
    } catch (error) {
        console.error("Error deleting Test:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Test by ID
export const getTestById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Test ID" });
    }

    try {
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ success: false, message: "Test not found" });
        }
        res.status(200).json({ success: true, data: test });
    } catch (error) {
        console.error("Error fetching Test:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
