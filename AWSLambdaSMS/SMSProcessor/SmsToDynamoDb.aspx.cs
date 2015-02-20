using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System;
using System.Collections.Generic;

namespace SMSProcessor
{
    /// <summary>
    /// Receives an SMS message from Twilio and stores it in an AWS DynamoDb table.
    /// </summary>
    public partial class SmsToDynamoDb : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Get the SMS details from the Request and pit them into a dictionary
            // ready to insert into Dynamo DB.
            Dictionary<string, AttributeValue> messageDetails = new Dictionary<string, AttributeValue>();
            messageDetails.Add("ID", new AttributeValue(Request["MessageSid"]));
            messageDetails.Add("From", new AttributeValue(Request["From"]));
            messageDetails.Add("Body", new AttributeValue(Request["Body"]));

            // Create the client to be used to write to Dynamo DB.
            // Use the preview endpoint so that we can make use of DynamoDb Streams to trigger
            // lambda functions.
            var config = new AmazonDynamoDBConfig();
            config.ServiceURL = "https://preview-dynamodb.eu-west-1.amazonaws.com";
            IAmazonDynamoDB client = AWSClientFactory.CreateAmazonDynamoDBClient(config);

            // Add the SMS received to the Dynamo Db table,
            client.PutItem("SmsMessages", messageDetails);
        }
    }
}