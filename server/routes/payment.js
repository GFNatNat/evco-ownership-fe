const express = require('express');
const router = express.Router();

// GET /api/payment/invoices
router.get('/invoices', (req, res) => {
    // TODO: List all invoices for CoOwner
    res.json({ message: 'List all invoices for CoOwner' });
});

// GET /api/payment/invoices/:invoiceId
router.get('/invoices/:invoiceId', (req, res) => {
    // TODO: Get invoice details
    res.json({ message: 'Get invoice details', invoiceId: req.params.invoiceId });
});

// POST /api/payment/pay
router.post('/pay', (req, res) => {
    // TODO: Pay an invoice
    res.json({ message: 'Pay an invoice' });
});

// GET /api/payment/receipt/:invoiceId
router.get('/receipt/:invoiceId', (req, res) => {
    // TODO: Get payment receipt
    res.json({ message: 'Get payment receipt', invoiceId: req.params.invoiceId });
});

// POST /api/payment/remind
router.post('/remind', (req, res) => {
    // TODO: Send payment reminder
    res.json({ message: 'Send payment reminder' });
});

// GET /api/payment/group-finance
router.get('/group-finance', (req, res) => {
    // TODO: Get group finance info
    res.json({ message: 'Get group finance info' });
});

module.exports = router;
