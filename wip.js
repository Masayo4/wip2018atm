var http = require('http');
var fs = require('fs');
var request = require('request');
var urlempath = 'https://api.webempath.net/v2/analyzeWav';

var formData = {
  apikey: "APIKEY",
  wav: fs.createReadStream("wavdata/laugh1.wav")
};

var server = http.createServer();
server.on('request', emotion);
server.listen(3000);
console.log('Server running!');

var smile =true;
var distance =true;
var voice =true;

function emotion(){
  request({
    method: 'POST',
    url: 'https://api.projectoxford.ai/emotion/v1.0/recognize',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': 'APIKEY'
    },
    body: JSON.stringify({
      url: 'http://web.sfc.keio.ac.jp/~t16588mt/facepic/frametest.png'
    })
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var object = JSON.parse(body);
      console.dir(object, {depth: null, colors: true})
      //smile
      for(i=0;i<object.length;i++){
        var happyval =Math.floor((object[i].scores.happiness)*100);
        if (happyval<95) {
          smile =false;
        }
      }
      //distance
      var leftval =0;
      for(i=0;i<object.length;i++){
        if (leftval ==0) {
          leftval =object[i].faceRectangle.left;
        }
        else {
          distanceval = leftval - (object[i].faceRectangle.left)-(object[i].faceRectangle.width);
          if (distanceval<30) {
            distance =false;
          }
        }
      }
    }
  }
)

empath();
console.log(smile);
console.log(distance);
console.log(voice);

if (smile ==true && distance ==true && voice ==true) {
  console.log("happisco:")
}

}

var content =0;
function empath(req, res) {
  fs.readFile('./wip.html', 'UTF-8',
  function(err, data) {
    request.post({ url: urlempath, formData: formData }, function(err, response) {
      if (err) {
        console.trace(err);
        return;
      } else if (!response.body) {
        console.trace("no response body");
        return;
      }

      var result = JSON.parse(response.body);
      console.log("voice: " + JSON.stringify(result));
      content = result.joy;
      if (content<15) {
        voice =false;
      }
    });
  });

}
