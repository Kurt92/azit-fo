const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// HTTPS 인증서 파일 경로 (mkcert로 생성한 파일)
const httpsOptions = {
    key: fs.readFileSync('./localhost-key.pem'), // 인증서 키
    cert: fs.readFileSync('./localhost.pem'),   // 인증서
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on https://localhost:3000');
    });
});
