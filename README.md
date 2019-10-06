# glamazon-db
baby's first database

### Improvements
* Currently, if you try to buy more items than there is left in stock, you can't buy any items. E.g. if there are 5 books left and you reqest 6, you won't get any. Future releases would allow you to purchase the remaining 5, instead of forcing you to put in a new purchase request for 5. I think the way I would do this is by having a few cases: one for if books - request === 0 and one for if books - request < 0, , which case the user would be allowed to purchase request - the absolute value of books-request.