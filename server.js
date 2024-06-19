const http = require('http');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { URL } = require('url');

(async () => {
    const open = await import('open');

    const hostname = '127.0.0.1';
    const port = 4000;

    const server = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url, `http://${hostname}:${port}`);
        const pathname = parsedUrl.pathname;

        if (pathname === '/') {
            fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(data);
                }
            });
        } else if (pathname === '/result') {
            const username = parsedUrl.searchParams.get('username');
            const addon = require('./addon/src/build/Release/addon');
            console.log(`Checking privileges for user: ${username}`);
            const privilege = addon.getUserPrivilege(username);
            console.log(`User: ${username}, Privilege: ${privilege}`);

            let responseHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Результат проверки привилегий</title>
        </head>
        <body>
      `;

            if (privilege) {
                responseHtml += `<p>Пользователь ${username} имеет привилегию ${privilege}</p>`;
            } else {
                responseHtml += `<p>Пользователя ${username} нет</p>`;
            }

            responseHtml += '<button id="back-button">Назад</button>';
            responseHtml += `
          <script src="./public/script.js"></script>
        </body>
        </html>
      `;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(responseHtml);
        } else if (pathname === '/public/script.js') {
            fs.readFile(path.join(__dirname, 'public', 'script.js'), (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/javascript');
                    res.end(data);
                }
            });
        } else {
            res.statusCode = 404;
            res.end('Not Found');
        }
    });

    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
        open.default(`http://${hostname}:${port}/`);
    });
})();
