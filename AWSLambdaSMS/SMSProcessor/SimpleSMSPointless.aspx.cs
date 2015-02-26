using System;
using Amazon;
using Amazon.Lambda;

namespace SMSProcessor
{
    /// <summary>
    /// Processes an incoming SMS from Twilio and invokes a lambda function
    /// to send a reply to the number the message came from.
    /// </summary>
    public partial class SimpleSmsPointless : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Get the number the SMS came from,
            string fromNumber = Request["From"];
            string message = Request["Body"];

            // Create the client to be used to invoke the lambda function.
            // This will use the default credentials from the profile store.
            var config = new AmazonLambdaConfig { RegionEndpoint = RegionEndpoint.EUWest1 };
            IAmazonLambda client = AWSClientFactory.CreateAmazonLambdaClient(config);

            // Arguments for the lambda function - the number the SMS came from.
            string arguments = @"{""from"": """ + fromNumber + @""",
                                 ""body"": """ + message + @"""}";

            // Invoke the lambda function which will send a reply to the SMS message.
            client.InvokeAsync("SimpleSMSPointless", arguments);
        }
    }
}