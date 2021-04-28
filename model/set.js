const db = require('../config/db');


module.exports = class {


    static async addSet(set, data) {

        let connection = await db.getConnection();
        let rows = await connection.query(
            'SELECT cacheid, content, fetchDate FROM cache WHERE `url` = ? LIMIT 1',
            [url]
        );
        connection.end();
    }


};
