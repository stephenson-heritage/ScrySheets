const dotenv = require('dotenv');
dotenv.config();

let dbConn = process.env.JAWSDB_MARIA_URL ? process.env.JAWSDB_MARIA_URL : {
	host: 'localhost',
	user: 'root',
	password: '',
	connectionLimit: 5,
	database: 'scrysheets',
};

module.exports = dbConn;
