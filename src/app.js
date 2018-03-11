import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import serverless from 'serverless-http';

const app = express();
const giphyToken = 'KBmLdv8V8AEpVfn7WxXpUvddTGh3WRcV';
const slackToken = 'cff5TL3XLwboeZD5aPhyvEdB';

axios.defaults.validateStatus = status => status >= 200 && status < 400;

//====================================================
// Middleware.
//====================================================

app.use(bodyParser.json());

//====================================================
// Routes.
//====================================================

app.post('/zfg', (request, response, next) =>  {
    if (!request.body.token || request.body.token !== slackToken) {
        return next({ status: 403, message: 'Invalid token.' });
    }

    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${giphyToken}&q=zero+fucks+given&limit=100&offset=0&rating=R&lang=en`)
        .then(result => {
            const item = result.data.data[Math.floor(Math.random() * result.data.data.length)];

            response.json({
                response_type: 'in_channel',
                attachments: [{ title: 'Zero fucks given', image_url: item.images.fixed_width.url }]
            });
        })
        .catch(() => next({ status: 400, message: 'Giphy API made a boo, boo.' }));
});

//====================================================
// Errors...gotta catch 'em all.
//====================================================

app.use((error, request, response, next) => {
    if (error) {
        return response.status(error.status || 500).json({ message: (error.message || 'Unknown error') });
    }

    next();
});

export const handler = serverless(app);
export default app;
