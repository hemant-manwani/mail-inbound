var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var formidable = require("formidable");
var httpRequest = require('request');
//var multipart = require('multipart')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/inbound', function (request, response) {
  var form = new formidable.IncomingForm();
  form.parse(request, function (err, fields, files) {
    var textMessage = fields.text;
    //var subject = fields.subject;
    //var from = fields.envelope.from;
    var helper = require('sendgrid').mail
   //console.log(fields);  
    var metaData = fields.to.replace(/(<(.*)>|\")/g, '').trim().split('||');
    var mongoId = metaData[0];
    var messageIndex = metaData[1];
    //from_email = new helper.Email(from)
    //to_email = new helper.Email("hemantmanwani.iitr@gmail.com")
    //subject = "A mail is received from the email web app: subject: "+subject
    content = new helper.Content("text/plain", ""+textMessage)
    content = content.value.split("\r\n")[0];
   
    //mail = new helper.Mail(from_email, subject, to_email, content)

    //var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    //var sgreq = sg.emptyRequest({
    //  method: 'POST',
    //  path: '/v3/mail/send',
    //  body: mail.toJSON()
    //});

    //sg.API(sgreq, function(error, sgres) {
    // response.sendStatus(200);
    //})
   // response.sendStatus(200);
    var body = {mongo_id: mongoId, message_index: messageIndex, content: content};
    httpRequest.post({
      headers: {'content-type' : 'application/json'},
      url:     'http://54.169.218.46:5000/sendgrid_callback',
      body:    JSON.stringify(body),
    }, function(error, res, bdy){
      console.log(bdy);
      response.sendStatus(200);
    });
  });
})




app.listen(3006, function () {
  console.log('Example app listening on port 3006!')
})

