import express from 'express';
import { protect } from '../middleware/auth.js';
import Budget from '../models/Budget.js';

const router = express.Router();

// Get all budgets
router.get('/', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add budget
router.post('/', protect, async (req, res) => {
  try {
    const { category, amount, period } = req.body;
    
    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category
    });
    
    if (existingBudget) {
      return res.status(400).json({ message: 'Budget for this category already exists' });
    }
    
    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      period
    });
    
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update budget
router.put('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { amount, period } = req.body;
    
    budget.amount = amount;
    budget.period = period;
    
    const updatedBudget = await budget.save();
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', protect, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    
    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await budget.deleteOne();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;