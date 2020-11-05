const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const client_ID = 'b2762a0e0b814a60aef467d5812baa7f';
const redirect = 'localhost:3000';

const whiteList = ['http://localhost:3000'];

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (whiteList.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow specificed origin';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// GET
app.get('/login', (req, res) => {
    console.log("about to redirect");
    const scopes = 'user-read-private user-read-email';
    res.header({
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
    });
    res.redirect(301, 'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + client_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(redirect))
});