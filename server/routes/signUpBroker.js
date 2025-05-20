const express = require('express');
const router = express.Router();
const { SignUpBroker } = require('../models/signUpBroker');
const { body, validationResult } = require('express-validator');

// POST /api/broker/signup - Create a new broker
router.post(
    '/signup',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('position').notEmpty().withMessage('Position is required'),
        body('officialemail').isEmail().withMessage('Valid official email is required'),
        body('supportemail').isEmail().withMessage('Valid support email is required'),
        body('personalphone').notEmpty().withMessage('Personal phone is required'),
        body('customerphone').notEmpty().withMessage('Customer phone is required'),
        body('websiteUrl').isURL().withMessage('Valid website URL is required'),
        body('crmLoginUrl').isURL().withMessage('Valid CRM login URL is required'),
        body('year').notEmpty().withMessage('Year is required'),
        body('address').notEmpty().withMessage('Address is required'),
        body('availableLicenses').isArray({ min: 1 }).withMessage('At least one license is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                name,
                position,
                officialemail,
                supportemail,
                personalphone,
                customerphone,
                websiteUrl,
                crmLoginUrl,
                year,
                address,
                availableLicenses,
            } = req.body;

            // Check if broker with officialemail already exists
            const existingBroker = await SignUpBroker.findOne({ officialemail });
            if (existingBroker) {
                return res.status(400).json({ message: 'Broker with this official email already exists' });
            }

            // Create new broker
            const broker = new SignUpBroker({
                name,
                position,
                officialemail,
                supportemail,
                personalphone,
                customerphone,
                websiteUrl,
                crmLoginUrl,
                year,
                address,
                availableLicenses,
            });

            // Save broker
            await broker.save();
            res.status(201).json(broker);
        } catch (error) {
            console.error('Error creating broker:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// GET /api/broker - Read all brokers
router.get('/', async (req, res) => {
    try {
        const brokers = await SignUpBroker.find();
        res.status(200).json(brokers);
    } catch (error) {
        console.error('Error fetching brokers:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/broker/:id - Read a single broker by ID
router.get('/:id', async (req, res) => {
    try {
        const broker = await SignUpBroker.findById(req.params.id);
        if (!broker) {
            return res.status(404).json({ message: 'Broker not found' });
        }
        res.status(200).json(broker);
    } catch (error) {
        console.error('Error fetching broker:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/broker/:id - Update a broker
router.put(
    '/:id',
    [
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('position').optional().notEmpty().withMessage('Position cannot be empty'),
        body('officialemail').optional().isEmail().withMessage('Valid official email is required'),
        body('supportemail').optional().isEmail().withMessage('Valid support email is required'),
        body('personalphone').optional().notEmpty().withMessage('Personal phone cannot be empty'),
        body('customerphone').optional().notEmpty().withMessage('Customer phone cannot be empty'),
        body('websiteUrl').optional().isURL().withMessage('Valid website URL is required'),
        body('crmLoginUrl').optional().isURL().withMessage('Valid CRM login URL is required'),
        body('year').optional().notEmpty().withMessage('Year cannot be empty'),
        body('address').optional().notEmpty().withMessage('Address cannot be empty'),
        body('availableLicenses')
            .optional()
            .isArray({ min: 1 })
            .withMessage('At least one license is required'),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const updates = req.body;

            // Check if updating officialemail to an existing one
            if (updates.officialemail) {
                const existingBroker = await SignUpBroker.findOne({
                    officialemail: updates.officialemail,
                    _id: { $ne: req.params.id },
                });
                if (existingBroker) {
                    return res.status(400).json({ message: 'Broker with this official email already exists' });
                }
            }

            // Update broker
            const broker = await SignUpBroker.findByIdAndUpdate(req.params.id, updates, {
                new: true,
                runValidators: true,
            });

            if (!broker) {
                return res.status(404).json({ message: 'Broker not found' });
            }

            res.status(200).json(broker);
        } catch (error) {
            console.error('Error updating broker:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

// DELETE /api/broker/:id - Delete a broker
router.delete('/:id', async (req, res) => {
    try {
        const broker = await SignUpBroker.findByIdAndDelete(req.params.id);
        if (!broker) {
            return res.status(404).json({ message: 'Broker not found' });
        }
        res.status(200).json({ message: 'Broker deleted successfully' });
    } catch (error) {
        console.error('Error deleting broker:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;