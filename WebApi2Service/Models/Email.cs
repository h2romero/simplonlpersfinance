using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi2Service.Models
{
    public partial class Email
    {
        public string Name { get; set; }
        public string EmailFrom { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}