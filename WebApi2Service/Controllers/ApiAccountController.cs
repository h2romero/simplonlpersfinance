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
    //[EnableCors(origins: "*", headers: "*", methods: "*", SupportsCredentials = true)]
    [Authorize]
    public class ApiAccountController : ApiController
    {        
        FinanceDataContext dataContext = new FinanceDataContext();

        // GET api/ApiAccount
        public IEnumerable<spAccountsResult> GetAccounts()
        {
            var accounts = dataContext.spAccounts(0, User.Identity.Name).ToList();
            return accounts;
        }

        // GET api/ApiAccount/5
        public spAccountsResult GetAccount(int id)
        {
            spAccountsResult account = dataContext.spAccounts(id, User.Identity.Name).SingleOrDefault();
            if (account == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return account;
        }

        // PUT api/ApiAccount/5
        public HttpResponseMessage PutAccount(int id, spAccountsResult account)
        {
            try
            {
                var company = from u in dataContext.Companies
                              where u.CompanyName == account.CompanyName
                              && u.UserName == User.Identity.Name
                              select u.CompanyID;
                if (company.Count() == 0)
                {
                    // Create Company
                    Company newcompany = new Company();
                    newcompany.CompanyName = account.CompanyName;
                    newcompany.UserName = User.Identity.Name;
                    dataContext.Companies.InsertOnSubmit(newcompany);
                    dataContext.SubmitChanges();
                }


                var accountType = from u in dataContext.AccountTypes
                                  where u.AccountTypeCode == account.AccountTypeCode
                                  && (u.UserName == null || u.UserName == User.Identity.Name)
                                  select u.AccountTypeID;
                if (accountType.Count() == 0)
                {
                    // Create AccountType
                    AccountType newaccounttype = new AccountType();
                    newaccounttype.AccountTypeCode = account.AccountTypeCode;
                    newaccounttype.AccountTypeName = account.AccountTypeCode;
                    newaccounttype.IsAsset = false;
                    newaccounttype.UserName = User.Identity.Name;
                    dataContext.AccountTypes.InsertOnSubmit(newaccounttype);
                    dataContext.SubmitChanges();
                }

                var currency = from u in dataContext.Currencies
                               where u.CurrencyCode == account.CurrencyCode
                               && (u.UserName == null || u.UserName == User.Identity.Name)
                               select u.CurrencyID;
                if (currency.Count() == 0)
                {
                    // Create Currency
                    Currency newcurrency = new Currency();
                    newcurrency.CurrencyName = account.CurrencyCode;
                    newcurrency.CurrencyCode = account.CurrencyCode;
                    newcurrency.UserName = User.Identity.Name;
                    dataContext.Currencies.InsertOnSubmit(newcurrency);
                    dataContext.SubmitChanges();
                }

                var owner = from u in dataContext.Owners
                            where u.OwnerCode == account.OwnerCode
                            && u.UserName == User.Identity.Name
                            select u.OwnerID;
                if (owner.Count() == 0)
                {
                    // Create Owner
                    Owner newowner = new Owner();
                    newowner.OwnerCode = account.OwnerCode;
                    newowner.FirstName = "UnknownFirstName";
                    newowner.LastName = "UnknownLastName";
                    newowner.UserName = User.Identity.Name;
                    dataContext.Owners.InsertOnSubmit(newowner);
                    dataContext.SubmitChanges();
                }

                //account.UserName = username;
                //UpdateModel(account);
                dataContext.UpdateAccount(
                    account.AccountID
                    , account.AccountNumber ?? "0000"
                    , account.AccountName
                    , company.Single() //account.CompanyID
                    , accountType.Single() //account.AccountTypeID
                    , currency.Single() //account.CurrencyID
                    , owner.Single() //account.OwnerID
                    , User.Identity.Name);
                dataContext.SubmitChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }
            
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/ApiAccount
        public HttpResponseMessage PostAccount(spAccountsResult account)
        {
            try
            {
                var company = from u in dataContext.Companies
                              where u.CompanyName == account.CompanyName
                              && u.UserName == User.Identity.Name
                              select u.CompanyID;
                if (company.Count() == 0)
                {
                    // Create Company
                    Company newcompany = new Company();
                    newcompany.CompanyName = account.CompanyName;
                    newcompany.UserName = User.Identity.Name;
                    dataContext.Companies.InsertOnSubmit(newcompany);
                    dataContext.SubmitChanges();
                }


                var accountType = from u in dataContext.AccountTypes
                                  where u.AccountTypeCode == account.AccountTypeCode
                                  && (u.UserName == null || u.UserName == User.Identity.Name)
                                  select u.AccountTypeID;
                if (accountType.Count() == 0)
                {
                    // Create AccountType
                    AccountType newaccounttype = new AccountType();
                    newaccounttype.AccountTypeCode = account.AccountTypeCode;
                    newaccounttype.AccountTypeName = account.AccountTypeCode;
                    newaccounttype.IsAsset = false;
                    newaccounttype.UserName = User.Identity.Name;
                    dataContext.AccountTypes.InsertOnSubmit(newaccounttype);
                    dataContext.SubmitChanges();
                }

                var currency = from u in dataContext.Currencies
                               where u.CurrencyCode == account.CurrencyCode
                               && (u.UserName == null || u.UserName == User.Identity.Name)
                               select u.CurrencyID;
                if (currency.Count() == 0)
                {
                    // Create Currency
                    Currency newcurrency = new Currency();
                    newcurrency.CurrencyName = account.CurrencyCode;
                    newcurrency.CurrencyCode = account.CurrencyCode;
                    newcurrency.UserName = User.Identity.Name;
                    dataContext.Currencies.InsertOnSubmit(newcurrency);
                    dataContext.SubmitChanges();
                }

                var owner = from u in dataContext.Owners
                            where u.OwnerCode == account.OwnerCode
                            && u.UserName == User.Identity.Name
                            select u.OwnerID;
                if (owner.Count() == 0)
                {
                    // Create Owner
                    Owner newowner = new Owner();
                    newowner.OwnerCode = account.OwnerCode;
                    newowner.FirstName = "UnknownFirstName";
                    newowner.LastName = "UnknownLastName";
                    newowner.UserName = User.Identity.Name;
                    dataContext.Owners.InsertOnSubmit(newowner);
                    dataContext.SubmitChanges();
                }

                Account _account = new Account();
                _account.AccountNumber = account.AccountNumber;
                _account.AccountName = account.AccountName;
                _account.CompanyID = company.Single();
                _account.AccountTypeID = accountType.Single();
                _account.CurrencyID = currency.Single();
                _account.OwnerID = owner.Single();
                _account.UserName = User.Identity.Name;
                dataContext.Accounts.InsertOnSubmit(_account);
                dataContext.SubmitChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, account);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = account.AccountID }));
                return response;
            }
            catch (Exception ex)
            {

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            //return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        }

        // DELETE api/ApiAccount/5
        public HttpResponseMessage DeleteAccount(int id)
        {
            try
            {
                dataContext.DeleteAccount(id);
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