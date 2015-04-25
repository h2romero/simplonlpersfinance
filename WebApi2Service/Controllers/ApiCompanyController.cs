using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApi2Service.Models;
//using WebApi2Service.CompanyContext__Mvc4HomeFinance;

namespace WebApi2Service.Controllers
{
    [Authorize]
    public class ApiCompanyController : ApiController
    {
        //private Models_ db = new Models_();
        FinanceDataContext dataContext = new FinanceDataContext();

        //private TransCompanyContext companyContext = new TransCompanyContext();

        // GET api/ApiCompany
        public IEnumerable<TransCompany> GetCompanies()
        {
            var data = (from c in dataContext.Companies
                        where c.UserName == User.Identity.Name //User.Identity.Name
                        //orderby c.CompanyName
                        select new TransCompany
                        {
                            CompanyID = c.CompanyID,
                            CompanyName = c.CompanyName,
                            UserName = c.UserName
                        }

                             ).ToList();
            return data;

            //return db.Companies.AsEnumerable();
        }

        // GET api/ApiCompany/5
        public TransCompany GetCompany(int id)
        {
            TransCompany company = (from c in dataContext.Companies
                                    where c.CompanyID == id
                                    //&& c.UserName == username //User.Identity.NameUser.Identity.Name
                                    //select c
                                    select new TransCompany
                             {
                                 CompanyID = c.CompanyID,
                                 CompanyName = c.CompanyName,
                                 UserName = c.UserName
                             }

                               ).First();

            return company;

            //Company company = db.Companies.Find(id);
            //if (company == null)
            //{
            //    throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            //}

            //return company;
        }

        // PUT api/ApiCompany/5
        [HttpPut]
        public HttpResponseMessage PutCompany(int id, TransCompany company)
        {
            try
            {

                Company _company = (Company)dataContext.Companies.Single(p => p.CompanyID == id);
                if (company != null)
                {
                    _company.CompanyName = company.CompanyName;
                    _company.UserName = company.UserName;
                    dataContext.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
                //Session["errortag"] = ex.Message;
            }
            return Request.CreateResponse(HttpStatusCode.OK, company);

            //IEnumerable data = (from c in dataContext.Companies
            //                    where c.UserName == User.Identity.Name
            //                    orderby c.CompanyName
            //                    select c).ToList();
            //return data.GridActions<Company>();

            //if (ModelState.IsValid && id == company.CompanyID)
            //{
            //    db.Entry(company).State = EntityState.Modified;

            //    try
            //    {
            //        db.SaveChanges();
            //    }
            //    catch (DbUpdateConcurrencyException)
            //    {
            //        return Request.CreateResponse(HttpStatusCode.NotFound);
            //    }

            //    return Request.CreateResponse(HttpStatusCode.OK, company);
            //}
            //else
            //{
            //    return Request.CreateResponse(HttpStatusCode.BadRequest);
            //}
        }

        // POST api/ApiCompany
        public HttpResponseMessage PostCompany(Company company)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    dataContext.Companies.InsertOnSubmit(company);
                    dataContext.SubmitChanges();

                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, company);
                    response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = company.CompanyID }));
                    return response;
                }
                catch (Exception ex)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                    //Session["errortag"] = ex.Message;
                }
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            //if (ModelState.IsValid)
            //{
            //    db.Companies.Add(company);
            //    db.SaveChanges();
                

            //    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, company);
            //    response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = company.CompanyID }));
            //    return response;
            //}
            //else
            //{
            //    return Request.CreateResponse(HttpStatusCode.BadRequest);
            //}
        }

        // DELETE api/ApiCompany/5
        public HttpResponseMessage DeleteCompany(int id)
        {
            
            Company company = (Company)dataContext.Companies.Single(p => p.CompanyID == id);
            try
            {
                dataContext.Companies.DeleteOnSubmit(company);
                dataContext.SubmitChanges();
            }
            catch (Exception ex)
            {

                //Session["errortag"] = ex.Message;
                //throw new Exception("my error: " + ex.Message);
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, company);

            //Company company = db.Companies.Find(id);
            //if (company == null)
            //{
            //    return Request.CreateResponse(HttpStatusCode.NotFound);
            //}

            //db.Companies.Remove(company);

            //try
            //{
            //    db.SaveChanges();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    return Request.CreateResponse(HttpStatusCode.NotFound);
            //}

            //return Request.CreateResponse(HttpStatusCode.OK, company);
        }
    }
}