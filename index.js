require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const urlDatabase = {};

app.post('/api/shorturl', function (req, res) {
    const original_url = req.body.url;
    // validation
    if (!/^https?:\/\/.+/i.test(original_url)) {
        return res.json({ error: 'invalid url' });
    }
    const short_url = Math.floor(Math.random() * 10000);
    urlDatabase[short_url] = original_url;
    res.json({ original_url, short_url });
});

app.get('/api/shorturl/:short_url', function (req, res) {

    const short_url = req.params.short_url;
    const original_url = urlDatabase[short_url];

    if (original_url) {
        res.redirect(original_url);
    } else {
        res.json({ error: 'No short URL found for the given input' });

    };
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
