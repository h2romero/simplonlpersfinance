using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi2Service.Models;

namespace WebApi2Service.Controllers
{
    public class MailController : ApiController
    {
        // GET api/mail
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/mail/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/mail
        public void Post(Email email)
        {
            SendMail sendmail = new SendMail();
            sendmail.Send(email.Subject, email.Message, email.EmailFrom, email.Name, "ceci.wilson.business@gmail.com");

        }

        // PUT api/mail/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/mail/5
        public void Delete(int id)
        {
        }
    }
}
