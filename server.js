const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

const port = process.env.PORT || 5100;

app.listen(port, () => {
	console.log(`server listening on port: ${port}`);
});
