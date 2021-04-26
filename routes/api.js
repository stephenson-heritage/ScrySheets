const express = require('express');
const router = express.Router();
const axios = require("axios");
const cache = require('../model/cache');


router.get('/sets', async (req, res) => {
    let url = 'https://api.scryfall.com/sets/'.toLowerCase();
    const d = await cache.fetchUrl(url);
    res.json(d);

});

router.get('/sets/:set', async (req, res) => {
    let set = req.params.set;
    let url = `https://api.scryfall.com/cards/search?order=set&q=e%3A${set}+not%3Areprint&unique=prints`.toLowerCase();
    const d = await cache.fetchUrl(url);
    res.json(d);

});

module.exports = router;