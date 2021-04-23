const express = require('express');
const router = express.Router();
const axios = require("axios");
const cache = require('../model/cache');


router.get('/sets', async (req, res) => {
    let url = 'https://api.scryfall.com/sets/'.toLowerCase();
    const d = await cache.fetchUrl(url);
    res.json(d);

});

module.exports = router;