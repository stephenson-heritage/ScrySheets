const express = require('express');
const path = require('path');
const dbLayer = require('./config/db');
const cookieParser = require('cookie-parser');
const apiRoute = require('./routes/api');


const dotenv = require('dotenv');
dotenv.config();


const port = process.env.PORT;
const app = express();


app.use('/', express.static(path.join(__dirname, 'public')));




app.use(cookieParser());
app.use(express.json());

app.use('/api', apiRoute);

app.get('/', function (req, res) {
	//res.send("gfvhnhjghj");


	res.render('home');
});


app.listen(port, () => {
	dbLayer.init();
	console.log(`listening on port: ${port}`);
});
