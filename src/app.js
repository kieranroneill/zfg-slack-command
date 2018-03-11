import bodyParser from 'body-parser';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

//====================================================
// Middleware.
//====================================================

app.use(bodyParser.json());

//====================================================
// Routes.
//====================================================

app.post('/zfg', (request, response, next) =>  {
    if (!request.body.token || request.body.token !== process.env.SLACK_TOKEN) {
        return next({ status: 401, message: 'Invalid token.' });
    }

    response.json({
        response_type: 'in_channel',
        text: `Mmmmm... Testy!`
    });
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
