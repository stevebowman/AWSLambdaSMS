// ReSharper disable UseOfImplicitGlobalInFunctionScope

// SMS version of Poinless using Dynamo DB Streams.

console.log('Loading event');

// Twilio Credentials 
var accountSid = '';
var authToken = '';
var fromNumber = '';

var https = require('https');
var queryString = require('querystring');

// Lambda function:
exports.handler = function (event, context) {
    
    console.log('Running event');
    
    // We are only expecting a single record, otherwise we should loop over
    // the Records array (the batch size is set when assigning this function to
    // a DynamoDB stream, so for this function it should always be set to 1)
    console.log('Found ' + event.Records.length + ' records.');
    var record = event.Records[0];
    
    // We are looking for new messages, so only process inserts.
    if (record.EventName === 'INSERT') {
        // The message body contains the answer to the question. 
        // Process this answer to get our response (Body is the name of
        // the database field which contains the received message body.)
        var message = event.Records[0].Dynamodb.NewImage.Body.S;
        console.log('Processing message: ' + message);
        var response = GetResponse(message);
        console.log('Response: ' + response);
        
        // Send the response to the sender of the SMS message.
        // Then end the lambda function, logging the status message.
        var mobileNumber = event.Records[0].Dynamodb.NewImage.From.S;
        console.log('Sending SMS response to: ' + mobileNumber);
        SendSMS(mobileNumber, response, 
            function (status) { context.done(null, status); });
    }
};

// Gets a response to send based on the answer provided.
// Ideally this would be coming from a database!
function GetResponse(answer) {

    // Question:
    // ANIMATED DISNEY FILMS WITH ONE WORD TITLES
    // Any partially or fully animated film made prior to 
    // the beginning of April 2011, which is animated and produced
    // by the Walt Disney Animation Studios or Disney/Pixar and has
    // a one word title.
    
    var response = 'Your answer ' + answer + ' ';
    
    switch (answer.trim().toUpperCase()) {
        case 'BAMBI':
            response += 'scored 51';
            break;
        case 'CINDERELLA':
            response += 'scored 49';
            break;
        case 'ALADDIN':
            response += 'scored 34';
            break;
        case 'DUMBO':
            response += 'scored 33';
            break;
        case 'CARS':
            response += 'scored 32';
            break;
        case 'PINOCCHIO':
            response += 'scored 30';
            break;
        case 'POCAHONTAS':
            response += 'scored 23';
            break;
        case 'FANTASIA':
            response += 'scored 18';
            break;
        case 'UP':
            response += 'scored 17';
            break;
        case 'MULAN':
            response += 'scored 11';
            break;
        case 'TANGLED':
            response += 'scored 11';
            break;
        case 'RATATOUILLE':
            response += 'scored 4';
            break;
        case 'TARZAN':
            response += 'scored 4';
            break;
        case 'ENCHANTED':
            response += 'scored 2';
            break;
        case 'BOLT':
            response += 'scored 2';
            break;
        case 'HERCULES':
            response += 'scored 1';
            break;
        case 'DINOSAUR':
            response += 'was a pointless answer! Congratulations!';
            break;
        default:
            response += 'was not found in our list.';
    }
    
    return response;
}

// Sends an SMS message using the Twilio API
// to: Phone number to send to
// body: Message body
// completedCallback(status) : Callback with status message when the function completes.
function SendSMS(to, body, completedCallback) {
    
    // The SMS message to send
    var message = {
        To: to, 
        From: fromNumber,
        Body: body
    };
    
    var messageString = queryString.stringify(message);
    
    // Options and headers for the HTTP request   
    var options = {
        host: 'api.twilio.com',
        port: 443,
        path: '/2010-04-01/Accounts/' + accountSid + '/Messages.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(messageString),
            'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64')
        }
    };
    
    // Setup the HTTP request
    var req = https.request(options, function (res) {
        
        res.setEncoding('utf-8');
        
        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });
        
        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
            completedCallback('API request sent successfully.');
        });
    });
    
    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        completedCallback('API request completed with error(s).');
    });
    
    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + messageString);
    req.write(messageString);
    req.end();

}