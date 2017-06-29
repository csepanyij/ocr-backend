var express = require("express"),
    app = express();
var vision = require('@google-cloud/vision');
var fs = require('fs');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

var visionClient = vision({
    projectId: 'mobile-ocr-172113',
    keyFilename: './mobile-ocr-3010298d4092.json'
});

// function decodeBase64Image(dataString) {
//   var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//     response = {};

//   if (matches.length !== 3) {
//     return new Error('Invalid input string');
//   }

//   response.type = matches[1];
//   response.data = new Buffer(matches[2], 'base64');

//   return response;
// }

app.post('/recognizeImage', function (request, response) {
  var responseString = '';
  request.on('data', data => {
    responseString = responseString + data.toString();
  });

  request.on('end', function() {
    var imageBuffer = responseString.replace(/^data:image\/png;base64,\/9j\//, "").replace(/(\r\n|\n|\r)/gm,"");
    console.log(imageBuffer);
    fs.writeFile("out.png", imageBuffer, {encoding: 'base64'}, function(err) {
      console.log(err);
    });
    visionClient.detectText('./out.png', 'binary', function (err, text) {
      err ? console.log(err) : console.log(text);
      response.end(JSON.stringify(text[0]));
    });
  });


});

app.get("/sayHello", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();
