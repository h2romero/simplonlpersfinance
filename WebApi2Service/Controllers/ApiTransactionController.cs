using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApi2Service.Models;
using System.Web.Http.Cors;

namespace WebApi2Service.Controllers
{
    //[EnableCors(origins: "http://localhost:50194", headers: "*", methods: "*")]
    //[AllowAnonymous]
    //[Route("Register")]
    //[EnableCors(origins: "http://localhost:50194", headers: "accept, content-type, origin", methods: "POST, OPTIONS")]

    [Authorize]
    public class ApiTransactionController : ApiController
    {
        FinanceRepository dataRepository = new FinanceRepository();
        FinanceDataContext dataContext = new FinanceDataContext();
        Dates dates = new Dates();

        // GET api/ApiTransaction
        public IEnumerable<spTransactionsResult> GetTransactions(DateTime start, DateTime end, string q)
        {
            //SetDates(false, DateTime.Today.AddYears(-1).AddMonths(-2));
            dates.startDate = start;
            dates.endDate = end;
            var transactionItems = dataRepository.GetAllTransactions(dates.startDate, dates.endDate, User.Identity.Name, q ?? "").ToList();
            return transactionItems;
            //var transactions = db.Transactions.Include(a => a.Company).Include(a => a.Currency).Include(a => a.TransactionType).Include(a => a.Owner);
            //return transactions.AsEnumerable();
        }

        private void SetDates(bool isMidMonth, DateTime _startdate)
        {
            //DateTime _dayone = DateTime.Parse(_startdate.Month.ToString() + "/" + 1 + "/" + _startdate.AddYears(-1).AddMonths(-1).Year.ToString());
            DateTime _dayone = DateTime.Parse(_startdate.Month.ToString() + "/" + 1 + "/" + _startdate.Year.ToString());
            if (isMidMonth)
            {
                //rbMidMonth.Checked = true;
                dates.startDate = _startdate.Day > 14 ? _dayone.AddDays(14) : _dayone.AddMonths(-1).AddDays(14);
                dates.endDate = _startdate.Day > 14 ? _dayone.AddMonths(1).AddDays(13) : _dayone.AddDays(13);
            }
            else
            {
                dates.startDate = _dayone;
                dates.endDate = _dayone.AddMonths(1).AddDays(-1);
            }
        }

        // GET api/ApiTransaction/5
        public spTransactionsResult GetTransaction(int id)
        {
            spTransactionsResult transaction = dataRepository.GetTransaction(id, User.Identity.Name).SingleOrDefault();
            //Transaction transaction = db.Transactions.Find(id);
            if (transaction == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return transaction;
        }

        // PUT api/ApiTransaction/5
        public HttpResponseMessage PutTransaction(int id, spTransactionsResult transaction)
        {
            try
            {
                dataRepository.UpdateTransaction(transaction, transaction.accountname, User.Identity.Name);
            }
            catch (DbUpdateConcurrencyException ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/ApiTransaction
        public HttpResponseMessage PostTransaction(spTransactionsResult transaction)
        {
            try
            {
                dataRepository.AddTransaction(transaction, transaction.accountname, User.Identity.Name);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, transaction);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = transaction.transactionid }));
                return response;
            }
            catch (Exception ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            //return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        }

        // DELETE api/ApiTransaction/5
        public HttpResponseMessage DeleteTransaction(int id)
        {
            try
            {
                dataContext.DeleteTransaction(id);
                dataContext.SubmitChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, id);
        }
    }
}