# TODO (MVP)
1. Create a simple web server using Node.js and Express.js, or a Puppeteer script.
2. Write a function which goes to specified URLs and accesses desired SKUs.
3. Use cron jobs to run the function every thirty minutes.
5. Update the function to actually purchase any found items.
6. Set up SMS/RCS alerts that an item has been found and/or purchased (optional: do we want to manually confirm purchases once the items are in our cart? If the items are not going to go out of stock once they're in our cart, then yes, else probably not).
7. Build comprehensive local tests.
8. Deploy AWS infrastructure.

# TODO (After MVP)
1. Create and connect a simple PostgreSQL database.
2. Update the function to record logs of each cron run in the database.

# Questions
1. What should the spending limit be when making purchases?
2. Which source of funds should be used when making purchases (Paypal, Credit Cards, etc.)?
3. Should we have the function run more than once every thirty minutes?