using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using Syncfusion.Mvc.Grid;
using System.Collections;
using System.Data.Linq;
using System.Web.WebPages;
using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
//using Syncfusion.Mvc.Chart;
//using Syncfusion.Mobile.Chart.MVC;    
using System.Text;

namespace WebApi2Service.Models
{
    public class Helpers
    {
    }

    public class Dates
    {
        [DataType(DataType.Date)]
        public DateTime startDate { get; set; }

        [DataType(DataType.Date)]
        public DateTime endDate { get; set; }
    }

    public class Finance_Date_View
    {
        public List<spTransactionsResult> TransactionItems { get; set; }
        public List<spChartTransactionsResult> TransactionChartItems { get; set; }
        public Dates Dates { get; set; }

        //public MVCChartModel MvcChartModel { get; set; }
        //public ChartModel MobileChartModel { get; set; }
    }

    public class FinanceRepository
    {
        FinanceDataContext dataContext = new FinanceDataContext();

        public IList<spTransactionsResult> GetAllTransactions(DateTime startDate, DateTime endDate, string user, string query)
        {
            //return (from u in dataContext.MPiUsers
            //        join t in dataContext.TerritoryMars
            //        on u.MPiUserID equals t.MPiUserID
            //        select u).ToList();

            
            return dataContext.spTransactions(startDate, endDate, 0, user, false, query).ToList();

        }

        public IList<spTransactionsResult> GetAllTransactionsOverZeroOnly(DateTime startDate, DateTime endDate, string user, string query)
        {
            return dataContext.spTransactions(startDate, endDate, 0, user, true, query).ToList();
        }

        public IList<spChartTransactionsResult> GetAllChartTransactions(DateTime startDate, DateTime endDate, string user)
        {
            return dataContext.spChartTransactions(startDate, endDate, 0, user, false).ToList();
        }

        public IList<spChartTransactionsResult> GetAllChartTransactionsOverZeroOnly(DateTime startDate, DateTime endDate, string user)
        {
            return dataContext.spChartTransactions(startDate, endDate, 0, user, true).ToList();
        }


        public ISingleResult<spTransactionsResult> GetTransaction(int? TransactionId, string user)
        {
            return dataContext.spTransactions(null, null, TransactionId, user, false, "");
        }

        public void UpdateTransactions(IEnumerable<spTransactionsResult> Transaction, string user)
        {
            foreach (var trans in Transaction)
            {
                //var account = from a in dataContext.Accounts
                //              //join c in dataContext.Companies on a.CompanyID equals c.CompanyID
                //              where a.AccountName == trans.accountname
                //              select a.AccountID;

                dataContext.UpdateTransaction(
                                                        trans.transactionid
                                                        //, account.Single()
                                                        ,trans.accountid
                    //, trans.amountdue
                    //, trans.amountbudgeted
                                                        , trans.amountpaid
                                                        , trans.duedate
                    //, trans.transactiondate
                                                        , trans.ispaid
                                                        , user
                                                        );
            }
            dataContext.SubmitChanges();
        }

        public void UpdateTransaction(spTransactionsResult trans, string accountname, string user)
        {
            var account = from a in dataContext.Accounts
                          where a.AccountName == accountname
                          && a.UserName == user
                          select new { a.AccountID, a.AccountType.AccountTypeCode };

            if (account.Count() == 0)   // If Account does not exist, create account
            {
                var company = from c in dataContext.Companies
                              where c.CompanyName == accountname
                              && c.UserName == user
                              select c.CompanyID;
                if (company.Count() == 0) // If company does not exist, create company
                {
                    Company newcompany = new Company();
                    newcompany.CompanyName = accountname;
                    newcompany.UserName = user;
                    dataContext.Companies.InsertOnSubmit(newcompany);
                    dataContext.SubmitChanges();
                }

                var accounttype = from a in dataContext.AccountTypes
                                  where a.AccountTypeCode == (trans.accounttypecode ?? "BILL")
                                  & a.UserName == user
                                  select a.AccountTypeID;

                var currency = from c in dataContext.Currencies
                                  where c.CurrencyCode == "USD"
                                  & c.UserName == user
                                  select c.CurrencyID;

                var owner = from o in dataContext.Owners
                            where o.OwnerCode == user
                            && o.UserName == user
                            select o.OwnerID;

                if (owner.Count() == 0)     // If Owner does not exist, create owner
                {
                    Owner newowner = new Owner();
                    newowner.OwnerCode = user;
                    newowner.FirstName = user;
                    newowner.LastName = "";
                    newowner.UserName = user;
                    dataContext.Owners.InsertOnSubmit(newowner);
                    dataContext.SubmitChanges();
                }

                // Create Account
                Account newaccount = new Account();
                newaccount.AccountNumber = "0000";
                newaccount.AccountName = accountname;
                newaccount.CompanyID = company.Single();
                newaccount.AccountTypeID = accounttype.Single();
                newaccount.CurrencyID = currency.Single();
                newaccount.OwnerID = owner.Single();
                newaccount.UserName = user;	        		             
                dataContext.Accounts.InsertOnSubmit(newaccount);
                dataContext.SubmitChanges();
            }

            var accounttype2 = from a in dataContext.AccountTypes
                              where a.AccountTypeCode == trans.accounttypecode
                              & a.UserName == user
                              select new {a.AccountTypeID, a.AccountTypeCode};
            if (accounttype2.Count() == 0)
            {
                AccountType newaccountype = new AccountType();
                newaccountype.UserName = user;
                newaccountype.AccountTypeCode = trans.accounttypecode;
                newaccountype.AccountTypeName = trans.accounttypecode;
                dataContext.AccountTypes.InsertOnSubmit(newaccountype);
                dataContext.SubmitChanges();

                dataContext.UpdateAccount(
                    account.Single().AccountID
                    , null //account.AccountNumber
                    , null //account.AccountName
                    , null //company.Single() //account.CompanyID
                    , newaccountype.AccountTypeID //account.AccountTypeID
                    , null //account.CurrencyID
                    , null //account.OwnerID
                    , null //user
                    );
                dataContext.SubmitChanges();
            }
            else
            {
                if (trans.accounttypecode != account.Single().AccountTypeCode)
                {
                    dataContext.UpdateAccount(
                       account.Single().AccountID
                       , null //account.AccountNumber
                       , null //account.AccountName
                       , null //company.Single() //account.CompanyID
                       , accounttype2.Single().AccountTypeID //account.AccountTypeID
                       , null //account.CurrencyID
                       , null //account.OwnerID
                       , null //user
                   );
                    dataContext.SubmitChanges();
                }
            }
     
		    dataContext.UpdateTransaction(
                                                        trans.transactionid
                                                        , account.Single().AccountID
                    //, trans.amountdue
                    //, trans.amountbudgeted
                                                        , trans.amountpaid
                                                        , trans.duedate
                    //, trans.transactiondate
                                                        , trans.ispaid
                                                        , user
                                                        );

            dataContext.SubmitChanges();
        }

        public void UpdateTransactionWithAccountid(spTransactionsResult trans, string user)
        {            
            dataContext.UpdateTransaction(
                                                        trans.transactionid
                                                        , trans.accountid
                //, trans.amountdue
                //, trans.amountbudgeted
                                                        , trans.amountpaid
                                                        , trans.duedate
                //, trans.transactiondate
                                                        , trans.ispaid
                                                        , user
                                                        );

            dataContext.SubmitChanges();
        }

        public void AddTransactions(IEnumerable<spTransactionsResult> Trans, string user)
        {
            foreach (var trans in Trans)
            {
                if (trans.accountname == "" || trans.accountname == null)
                    return;
                var account = from a in dataContext.Accounts
                                  //join c in dataContext.Companies on a.CompanyID equals c.CompanyID
                                  where a.AccountName == trans.accountname
                                  select a.AccountID;

                dataContext.InsertTransaction(
                    
                                                        account.Single()
                                                        //trans.accountid
                    //, trans.amountdue
                    //, trans.amountbudgeted
                                                        , trans.amountpaid
                                                        , trans.duedate
                    //,trans.transactiondate
                                                        , trans.ispaid
                                                        , user
                                                        , user
                                                        , user
                                                        );
            }

            dataContext.SubmitChanges();
        }

        public void AddTransaction(spTransactionsResult trans, string accountname, string user)
        {
            var account = from a in dataContext.Accounts
                          where a.AccountName == accountname
                          && a.UserName == user
                          select a.AccountID;
            if (account.Count() == 0)   // If Account does not exist, create account
            {
                var company = from c in dataContext.Companies
                              where c.CompanyName == accountname
                              && c.UserName == user
                              select c.CompanyID;
                if (company.Count() == 0) // If company does not exist, create company
                {
                    Company newcompany = new Company();
                    newcompany.CompanyName = accountname;
                    newcompany.UserName = user;
                    dataContext.Companies.InsertOnSubmit(newcompany);
                    dataContext.SubmitChanges();
                }

                var accounttype = from a in dataContext.AccountTypes
                                  where a.AccountTypeCode == "BILL"
                                  & a.UserName == user
                                  select a.AccountTypeID;
                if (accounttype.Count() == 0) // If account type does not exist, create account type
                {
                    AccountType newaccountype = new AccountType();
                    newaccountype.UserName = user;
                    newaccountype.AccountTypeCode = "BILL";
                    newaccountype.AccountTypeName = "BILL";
                    dataContext.AccountTypes.InsertOnSubmit(newaccountype);
                    dataContext.SubmitChanges();
                }

                var currency = from c in dataContext.Currencies
                               where c.CurrencyCode == "USD"
                               & c.UserName == user
                               select c.CurrencyID;
                if (currency.Count() == 0) // If currency does not exist, create currency
                {
                    Currency newcurrency = new Currency();
                    newcurrency.UserName = user;
                    newcurrency.CurrencyCode = "USD";
                    newcurrency.CurrencyName = "USD";
                    dataContext.Currencies.InsertOnSubmit(newcurrency);
                    dataContext.SubmitChanges();
                }

                var owner = from o in dataContext.Owners
                            where o.OwnerCode == user
                            && o.UserName == user
                            select o.OwnerID;
                if (owner.Count() == 0)     // If Owner does not exist, create owner
                {
                    Owner newowner = new Owner();
                    newowner.OwnerCode = user;
                    newowner.FirstName = "UnknonwnFirstName";
                    newowner.LastName = "UnknownLastName";
                    newowner.UserName = user;
                    dataContext.Owners.InsertOnSubmit(newowner);
                    dataContext.SubmitChanges();
                }

                // Create Account
                Account newaccount = new Account();
                newaccount.AccountNumber = "0000";
                newaccount.AccountName = accountname;
                newaccount.CompanyID = company.Single();
                newaccount.AccountTypeID = accounttype.Single();
                newaccount.CurrencyID = currency.Single();
                newaccount.OwnerID = owner.Single();
                newaccount.UserName = user;
                dataContext.Accounts.InsertOnSubmit(newaccount);
                dataContext.SubmitChanges();
            }

            dataContext.InsertTransaction(
                                                    account.Single()
                                                    , trans.amountpaid
                                                    , trans.duedate
                                                    , trans.ispaid
                                                    , user
                                                    , user
                                                    , user
                                                   );

            dataContext.SubmitChanges();
        }

        public void AddTransactionWithAccountid(spTransactionsResult trans, string user)
        {            
            dataContext.InsertTransaction(
                                                    trans.accountid
                                                    , trans.amountpaid
                                                    , trans.duedate
                                                    , trans.ispaid
                                                    , user
                                                    , user
                                                    , user
                                                   );

            dataContext.SubmitChanges();
        }

        public void DeleteTransactions(IEnumerable<spTransactionsResult> Transaction)
        {
            foreach (var trans in Transaction)
            {
                dataContext.DeleteTransaction(trans.transactionid);
            }
            dataContext.SubmitChanges();   //delete function disabled
        }

        public void DeleteTransaction(Transaction trans)
        {
            dataContext.DeleteTransaction(trans.TransactionID);

            dataContext.SubmitChanges();
        }

        public void DeleteTransaction(int id)
        {
            dataContext.DeleteTransaction(id);

            dataContext.SubmitChanges();
        }

        public IEnumerable<SelectListItem> GetAllAccountNamesList(string user)
        {
            //return (from u in dataContext.MPiUsers
            //        join t in dataContext.TerritoryMars
            //        on u.MPiUserID equals t.MPiUserID
            //        select u).ToList();

            IEnumerable data = from a in dataContext.Accounts
                               where a.UserName == user
                               orderby a.AccountName
                               select a;

            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "",
                Value = "-1"
            });
            foreach (var d in data)
            {
                //string accountName = ((Account)d).AccountName;
                type.Add(new SelectListItem
                {
                    //Selected = false,
                    Text = ((Account)d).AccountName,
                    Value = ((Account)d).AccountID.ToString()
                });
            }


            return type;

        }

        public IEnumerable<SelectListItem> GetAllAccountNamesListNoKey(string user)
        {
            //return (from u in dataContext.MPiUsers
            //        join t in dataContext.TerritoryMars
            //        on u.MPiUserID equals t.MPiUserID
            //        select u).ToList();

            IEnumerable data = from a in dataContext.Accounts
                               where a.UserName == user
                               orderby a.AccountName
                               select a;

            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "",
                Value = ""
            });
            foreach (var d in data)
            {
                //string accountName = ((Account)d).AccountName;
                type.Add(new SelectListItem
                {
                    //Selected = false,
                    Text = ((Account)d).AccountName,
                    Value = ((Account)d).AccountName
                });
            }


            return type;

        }

        public IEnumerable<SelectListItem> GetAllCompaniesList(string user)
        {
            IEnumerable data = from u in dataContext.Companies
                               where u.UserName == user
                               orderby u.CompanyName
                               select u;
            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "<Select>",
                Value = "0"
            });
            foreach (var d in data)
            {
                //string directorName = ((Director)d).DirectorName;
                type.Add(new SelectListItem
                {
                    //Selected = false,
                    Text = ((Company)d).CompanyName,
                    Value = ((Company)d).CompanyID.ToString()
                });
            }
            type.Add(new SelectListItem
            {
                //Selected = false,
                Text = "Add New...",
                Value = "-1"
            });
            return type;
        }

        public int GetLastCompanyID(string user)
        {
            return (from u in dataContext.Companies
                    where u.UserName == user
                    select u.CompanyID).Max();
        }

        public IEnumerable<SelectListItem> GetAllAccountTypesList(string user)
        {
            IEnumerable data = from u in dataContext.AccountTypes
                               where u.UserName == null || u.UserName == user
                               orderby u.AccountTypeCode
                               select u;
            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "<Select>",
                Value = "0"
            });
            foreach (var d in data)
            {
                type.Add(new SelectListItem
                {
                    Text = ((AccountType)d).AccountTypeCode + " - " + ((AccountType)d).AccountTypeName,
                    Value = ((AccountType)d).AccountTypeID.ToString()
                });
            }
            type.Add(new SelectListItem
            {
                Text = "Add New...",
                Value = "-1"
            });
            return type;
        }

        public int GetLastAccountTypeID(string user)
        {
            return (from u in dataContext.AccountTypes
                    where u.UserName == user
                    select u.AccountTypeID).Max();
        }

        public IEnumerable<SelectListItem> GetAllCurrenciesList(string user)
        {
            IEnumerable data = from u in dataContext.Currencies
                               where u.UserName == null || u.UserName == user
                               orderby u.CurrencyCode
                               select u;
            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "<Select>",
                Value = "0"
            });
            foreach (var d in data)
            {
                type.Add(new SelectListItem
                {
                    Text = ((Currency)d).CurrencyCode + " - " + ((Currency)d).CurrencyName,
                    Value = ((Currency)d).CurrencyID.ToString()
                });
            }
            type.Add(new SelectListItem
            {
                Text = "Add New...",
                Value = "-1"
            });
            return type;
        }

        public int GetLastCurrencyID(string user)
        {
            return (from u in dataContext.Currencies
                    where u.UserName == user
                    select u.CurrencyID).Max();
        }

        public IEnumerable<SelectListItem> GetAllOwnersList(string user)
        {
            IEnumerable data = from u in dataContext.Owners
                               where u.UserName == user
                               orderby u.OwnerCode
                               select u;
            List<SelectListItem> type = new List<SelectListItem>();
            type.Add(new SelectListItem
            {
                Text = "<Select>",
                Value = "0"
            });
            foreach (var d in data)
            {
                type.Add(new SelectListItem
                {
                    Text = ((Owner)d).OwnerCode,
                    Value = ((Owner)d).OwnerID.ToString()
                });
            }
            type.Add(new SelectListItem
            {
                Text = "Add New...",
                Value = "-1"
            });
            return type;
        }

        public int GetLastOwnerID(string user)
        {
            return (from u in dataContext.Owners
                    where u.UserName == user
                    select u.OwnerID).Max();
        }

        public IEnumerable<SelectListItem> GetCompanyList()
        {
            IEnumerable data = from u in dataContext.Companies
                               orderby u.CompanyName
                               select u;

            List<SelectListItem> type = new List<SelectListItem>();

            type.Add(new SelectListItem
            {
                Text = "",
                Value = ""
            });

            foreach (var d in data)
            {
                //string userName = ((MPiUser)d).UserID;
                type.Add(new SelectListItem
                {
                    Text = ((Company)d).CompanyName.ToString(),
                    Value = ((Company)d).CompanyID.ToString()
                });
            }


            return type;

        }

    }

    public static class ActiveTabHelper
    {
        private const string DefaultCssClass = "active";

        public static string ActiveTab(this HtmlHelper helper, string activeController, string[] activeActions)
        {
            return helper.ActiveTab(activeController, activeActions, DefaultCssClass);
        }

        public static string ActiveTab(this HtmlHelper helper, string activeController, string activeAction)
        {
            return helper.ActiveTab(activeController, new string[] { activeAction }, DefaultCssClass);
        }

        public static string ActiveTab(this HtmlHelper helper, string activeController, string activeAction, string cssClass)
        {
            return helper.ActiveTab(activeController, new string[] { activeAction }, cssClass);
        }

        public static string ActiveTab(this HtmlHelper helper, string activeController, string[] activeActions, string cssClass)
        {
            string currentAction = helper.ViewContext.Controller.ValueProvider.GetValue("action").RawValue.ToString();
            string currentController = helper.ViewContext.Controller.ValueProvider.GetValue("controller").RawValue.ToString();
            string cssClassToUse = currentController == activeController && activeActions.Contains(currentAction) ? cssClass : string.Empty;
            return cssClassToUse;
        }

        public static string ActiveTab(this HtmlHelper helper, string[] activeController, string[] activeActions, string cssClass)
        {
            string currentAction = helper.ViewContext.Controller.ValueProvider.GetValue("action").RawValue.ToString().ToLower();
            string currentController = helper.ViewContext.Controller.ValueProvider.GetValue("controller").RawValue.ToString().ToLower();
            foreach (string s in activeController)
            {
                if (currentController == s.ToLower() && activeActions.Contains(currentAction))
                    return cssClass;
            }
            return string.Empty;
        }
    }

    public class MobileDisplayMode : DefaultDisplayMode
    {
        private readonly StringCollection _useragenStringPartialIdentifiers = new StringCollection
        {
            "Android",
            "Mobile",
            "Opera Mobi",
            "Samsung",
            "HTC",
            "Nokia",
            "Ericsson",
            "SonyEricsson",
            "iPhone"
        };

        public MobileDisplayMode()
            : base("Mobile")
        {
            ContextCondition = (context => IsMobile(context.GetOverriddenUserAgent()));
        }

        private bool IsMobile(string useragentString)
        {
            return _useragenStringPartialIdentifiers.Cast<string>()
                        .Any(val => useragentString.IndexOf(val, StringComparison.InvariantCultureIgnoreCase) >= 0);
        }
    }

    public static class SimpleNavExtensions
    {
        public static string SimpleNav(this HtmlHelper html, IEnumerable<SimpleNavItem> navItems)
        {
            var urlHelper = new UrlHelper(html.ViewContext.RequestContext);
            string controller = html.ViewContext.RouteData.Values["controller"].ToString();
            string action = html.ViewContext.RouteData.Values["action"].ToString();

            TagBuilder ul = new TagBuilder("ul");
            ul.AddCssClass("clearfix");

            StringBuilder listBuilder = new StringBuilder();
            TagBuilder li = null;
            TagBuilder a = null;
            foreach (var item in navItems)
            {
                a = new TagBuilder("a");
                a.Attributes.Add("href", urlHelper.Action(item.Action, item.Controller));
                a.InnerHtml = item.Text;

                li = new TagBuilder("li");
                if (item.GetSelected != null && item.GetSelected(action, controller))
                    li.AddCssClass("sel");
                li.InnerHtml = a.ToString();

                listBuilder.Append(li.ToString());
            }

            ul.InnerHtml = listBuilder.ToString();

            return ul.ToString();
        }
    }

    public class SimpleNavItem
    {
        public string Text { get; set; }
        public string Action { get; set; }
        public string Controller { get; set; }
        public Func<string, string, bool> GetSelected { get; set; }
    }

    class Product
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public string Category { get; set; }
    }
}