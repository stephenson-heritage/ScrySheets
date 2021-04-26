const dotenv = require('dotenv');
dotenv.config();


let dbConn = process.env.MARIA_URL !== undefined ? process.env.MARIA_URL : {
	host: 'localhost',
	user: 'root',
	password: '',
	connectionLimit: 5,
	database: 'scrysheets',
};

module.exports = dbConn;
