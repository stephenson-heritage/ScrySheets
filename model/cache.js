const db = require('../config/db');
const axios = require("axios");
let age = function () {
    return Math.random() * (30 - 15) + 15;
}
module.exports = class {

    static async doFetch(url) {
        console.log(`cache miss: ${url}`)
        let response;
        try {
            response = await axios.get(url, {
                responseType: 'json'
            });
        }
        catch (err) {
            return null;
        }
        const content = await response.data;
        return content;
    }

    static async fetchUrl(url, maxAge) {
        if (maxAge === undefined) {
            maxAge = 1000 * 60 * 60 * 24 * age(); // random
        }
        let connection = await db.getConnection();
        let rows = await connection.query(
            'SELECT cacheid, content, fetchDate FROM cache WHERE `url` = ? LIMIT 1',
            [url]
        );
        connection.end();
        if (rows.length > 0) {
            // prior fetch
            // check if retrieved since maxAge
            const dateDiff = new Date() - new Date(rows[0].fetchDate);
            if (dateDiff < maxAge) {
                return { content: JSON.parse(rows[0].content) };
            } else {
                // older than maxAge
                const content = await module.exports.doFetch(url);

                let connection = await db.getConnection();
                await connection.query(
                    'UPDATE `cache` SET `content`= ? WHERE  `cacheId`=?;',
                    [content, rows[0].cacheid]
                );
                connection.end();
                return { content: content };
            }
        } else {
            // no prior fetch
            // new url           
            const content = await module.exports.doFetch(url);

            let connection = await db.getConnection();
            const rows = await connection.query(
                'INSERT INTO `cache` (`url`, `content`) VALUES (?, ?);',
                [url, content]
            );
            connection.end();
            return { content: content };
        }
    }
};
