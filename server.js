var express = require("express"),
    app = express();
var vision = require('@google-cloud/vision');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

var visionClient = vision({
    projectId: 'mobile-ocr-172113',
    keyFilename: './mobile-ocr-3010298d4092.json'
});

app.post('/recognizeImage', function (request, response) {
  request.on('data', data => {
    console.log(data.toString());
  })
  visionClient.detectText('./test-image.png', function (err, text) {
    response.end(JSON.stringify(text[0]));
  });
});

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();
