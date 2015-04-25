FinanceApp.factory("SearchService", function (ApiAccount) {
    var accountnames = [];

    return {
        
        searchAccountNames: function (query,sort_order,is_desc,offset,limit) {
            ApiAccount.query({
                q: query,
                sort: sort_order,
                desc: is_desc,
                offset: offset,
                limit: limit
            },
           function (accounts) {
               angular.forEach(accounts, function (account) {
                   accountnames.push(account.AccountName);
               });
           });
            return accountnames;
        }
    };
});