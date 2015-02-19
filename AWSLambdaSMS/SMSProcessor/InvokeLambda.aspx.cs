using System;

namespace SMSProcessor
{
    public partial class InvokeLambda : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Write("Hello World");
        }
    }
}