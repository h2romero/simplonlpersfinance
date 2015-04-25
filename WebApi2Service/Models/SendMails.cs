using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Net;
using System.Text;

namespace WebApi2Service.Models
{
    public class SendMail
    {
        /// <summary>
        /// Send Email using SMTP.COXMAIL.COM
        /// </summary>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <param name="fromemail"></param>
        /// <param name="fromname"></param>
        /// <param name="toemails"></param>
        /// <param name="ishtml"></param>
        /// <returns></returns>
        public bool Send(string subject, string body, string fromemail, string fromname, string toemails, bool ishtml = true)
        {
            bool result;
            SmtpClient SMTP = null;
            var Msg = new MailMessage();

            if (ishtml)
                Msg.IsBodyHtml = true;
            else
                Msg.IsBodyHtml = false;

            Msg.From = new MailAddress(fromemail, fromname);

            if (toemails.IndexOf("|") != -1)
            {
                string[] emails = toemails.Split('|');
                foreach (string email in emails)
                {
                    Msg.To.Add(new MailAddress(email));
                }

            }
            else
            {
                Msg.To.Add(new MailAddress(toemails));
            }

            Msg.Subject = subject;
            Msg.Body = body;
            Msg.BodyEncoding = UTF8Encoding.UTF8;
            Msg.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

            try
            {
                SMTP = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    Timeout = 20000,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("ceci.wilson.business", "Ceda9815")  // gmailid is someguy@gmail.com
                };
                SMTP.Send(Msg);
                result = true;
            }
            catch
            {
                result = false;
            }

            return result;
        }
    }
}