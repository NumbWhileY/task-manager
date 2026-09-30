const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.status(201).json({ received: req.body });
});

module.exports = router;