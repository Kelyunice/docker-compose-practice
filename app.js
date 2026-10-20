const http = require('http');
const redis = require('redis');
const appEnv = process.env.APP_ENV;

async function startApp() {
    const redisClient = redis.createClient({
        url: 'redis://redis:6379'
    });

    redisClient.on('error', (err) => {
        console.error('Redis error:', err);
    });

    await redisClient.connect();

    const app = http.createServer(async (req, res) => {
        try {
            const visits = await redisClient.incr('visits');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h1>Making Progress In DevOps Skills</h1><p>Visits: ${visits}</p><p>Environment: ${appEnv}</p>`);
        } catch (err) {
            console.error('Request error:', err);
            res.writeHead(500);
            res.end('Something went wrong');
        }
    });

    app.listen(3000, '0.0.0.0', () => {
        console.log('App running on port 3000');
    });
}

startApp().catch((err) => {
    console.error('App failed to start:', err);
    process.exit(1);
});
