# Trend Edge
- Single Page React Web Application, hosted on heroku via an express server; data posts and pulls required for the application are made via communication with an MDB Atlas database. 

https://trend-edge.herokuapp.com/dash

**ABOUT THIS APP** 
- Trend Edge is a multi-asset trend monitoring system. The system generates scoring metrics by analyzing the price history and technical indicators of a given stock or sector (ETF), applies a user-defined weighting for each of the scoring metrics, and outputs a "Trend Edge". 

(For an in depth explanation of the scoring system, please see the white paper available at Trend Edge's About page.)

- In order for the user to access the watchlist page and update their user settings, they must create an account. Without an account, only the sector page is available for viewing, with default User Settings. All accounts created are encrypted via BCryptJS. 

- In the user settings, there are two selections to be made: 

1) The "fast" moving average, and the "slow" moving average.
2) The weightings to be applied to the scoring metrics. 

- Once these settings are confirmed (modified from their default settings, or retained), the user may visit the watchlist and sector pages.

- The sector page displays nine sub sectors of the stock market that are actively followed in investing and "FinTwit (Financial Twitter)" communities. Their Trend Edge are generated using the most actively traded ETFs for that sector. 

- The watchlist page displays a table of user defined stocks that they wish to track Trend Edge for. They can add and remove stocks from the table with ease. 

- Price Data for both the Sector and Watchlist pages are updated Weekly on Fridays at 18:00 Eastern Standard time. Weekly data pulls are fitting due to the usage of weekly closing prices for price and technical indicator data. 

**Future Enhancements of the application**
- Future enhancements in the pipeline for implementation include: additional user settings (lookback for moving average slope, MACD. Daily/monthly periodicity availability, additional technical indicators), additional fundamental/technical data in the user watchlist table, customized sector page with additional fundamental and technical sector information, dark mode, and more! 

**Modules required, and links to documentation**

React 
- https://reactjs.org/docs/getting-started.html

Express webframework 
- https://expressjs.com/en/api.html

Mongoose
- https://mongoosejs.com/docs/api.html

BCryptsJS
- https://www.npmjs.com/package/bcryptjs

Json Web Token
- https://www.npmjs.com/package/jsonwebtoken

JWT Decode
- https://www.npmjs.com/package/jwt-decode

CORS
- https://www.npmjs.com/package/cors

Material UI
- https://material-ui.com/getting-started/installation/

Axios
- https://www.npmjs.com/package/axios

Bootstrap 
- https://www.npmjs.com/package/bootstrap

Cron
- https://www.npmjs.com/package/cron

Formik 
- https://www.npmjs.com/package/formik

Jquery 
- https://www.npmjs.com/package/jquery

Yup 
- https://www.npmjs.com/package/yup

Formik
- https://www.npmjs.com/package/formik

Clsx
- https://www.npmjs.com/package/clsx

Medium Zoom 
- https://www.npmjs.com/package/medium-zoom

