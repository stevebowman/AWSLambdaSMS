using Amazon;
using Amazon.Lambda;
using Amazon.Lambda.Model;
using System;

namespace SMSProcessor
{
    /// <summary>
    /// Invokation of a simple lambda funcion.
    /// </summary>
    public partial class InvokeLambda : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Create the client to be used to invoke the lambda function.
            // This will use the default credentials from the profile store.
            var config = new AmazonLambdaConfig { RegionEndpoint = RegionEndpoint.EUWest1 };
            IAmazonLambda client = AWSClientFactory.CreateAmazonLambdaClient(config);

            // Arguments for the lambda function
            const string arguments = @"{""key1"": ""argument 1"", 
                                        ""key2"": ""argument 2"",
                                        ""key3"": ""argument 3""
                                       }";

            // Invoke the lambda function
            InvokeAsyncResponse response = client.InvokeAsync("HelloWorld", arguments);

            Response.Write("Completed with response code: " + response.HttpStatusCode);
        }
    }
}