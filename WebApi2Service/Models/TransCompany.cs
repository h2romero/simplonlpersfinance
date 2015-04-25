using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebApi2Service.Models
{
    public class TransCompany
    {
        [Key] public int CompanyID { get; set; }
        public string CompanyName { get; set; }
        public string UserName { get; set; }
    }
}