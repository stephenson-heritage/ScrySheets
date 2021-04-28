const express = require('express');
const router = express.Router();
const axios = require("axios");
const cache = require('../model/cache');




router.get('/sets', async (req, res) => {
    let url = 'https://api.scryfall.com/sets/'.toLowerCase();
    const d = await cache.fetchUrl(url);
    res.json(d);

});

router.get('/sets/allsets', async (req, res) => {
    let url = 'https://api.scryfall.com/sets/'.toLowerCase();
    const d = await cache.fetchUrl(url); // check set list every 15-30 days
    // show only expansion and core sets
    setList = d.content.data.filter(set => set.set_type == "expansion" || set.set_type == "core" || set.set_type == "commander");

    for (let set in setList) {
        let uniqueUrl = `https://api.scryfall.com/cards/search?q=set%3A${setList[set].code}+unique%3Acards&unique=cards`;
        let uniqueCards = await cache.fetchUrl(uniqueUrl);
        const uniqueCardCount = uniqueCards.content.total_cards;

        let url = `https://api.scryfall.com/cards/search?order=set&q=e%3A${setList[set].code}+not%3Areprint&unique=cards`.toLowerCase();
        let setCards = await cache.fetchUrl(url);

        setList[set].new_cards_stats = { avg_char: 0, avg_word: 0 };
        if (setCards.content === null) {
            // no new cards
            setList[set].new_cards = 0;
            setList[set].new_cards = 0;
        } else {
            setList[set].new_cards = setCards.content.total_cards;
            let page = 1;
            let more = (setCards.content.has_more);
            //console.log(setCards.content.has_more)
            while (more) {
                let pUrl = `https://api.scryfall.com/cards/search?order=set&q=e%3A${setList[set].code}+not%3Areprint&unique=cards&page=${++page}`.toLowerCase();
                let pSetCards = await cache.fetchUrl(pUrl);
                more = pSetCards.has_more;


                setCards.content.data = setCards.content.data.concat(pSetCards.content.data);
            }

            const cards = setCards.content.data;
            let char_count = 0;
            let word_count = 0;
            //console.log(cards[0].oracle_text);
            let x = 1;
            cards.forEach(card => {
                if (card.oracle_text !== undefined) {
                    //console.log(card.oracle_text.length);
                    char_count += card.oracle_text.length;
                    word_count += card.oracle_text.trim().split(/\s+/).length;
                }


            });
            let avg_char_count = Math.round((char_count / setList[set].new_cards) * 100) / 100;
            let avg_word_count = Math.round((word_count / setList[set].new_cards) * 100) / 100;
            setList[set].new_cards_stats.avg_char = avg_char_count;
            setList[set].new_cards_stats.avg_word = avg_word_count;

            //console.log(setList[set].name, avg_word_count);

        }

        setList[set].total_cards = uniqueCardCount;
        setList[set].reprint_count = uniqueCardCount - setList[set].new_cards;
    }
    res.json(setList);

});


router.get('/sets/:set', async (req, res) => {
    let set = req.params.set;
    let url = `https://api.scryfall.com/cards/search?order=set&q=e%3A${set}+not%3Areprint&unique=prints`.toLowerCase();
    const d = await cache.fetchUrl(url);
    res.json(d);

});

module.exports = router;