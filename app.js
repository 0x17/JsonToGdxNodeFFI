const jsontogdx = require('./jsontogdx.js');
jsontogdx.setGAMSDirectories('/home/andre/Downloads/gams24.9_linux_x64_64_sfx/', '/home/andre/Desktop/');

const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');

app.listen(8001);

function handler (req, res) {
    fs.readFile(__dirname + '/example_client/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function (socket) {
    socket.emit('news', { data: jsontogdx.readJsonFromGdxFile('example.gdx') });
    socket.on('my other event', function (data) {
        console.log(data);
    });

    fs.readFile(__dirname + '/example_client/knapsack.gms', 'utf8', function (err, knapsackCode) {
        if(err) return;
        socket.emit('sendcode', { code: knapsackCode });
    });

    socket.on('solve', function(data) {
        const res = jsontogdx.solveModelWithDataJson(data.code, data.data);
        socket.emit('solveresult', res);
    });
});



