window.Stokr = window.Stokr || {};

window.Stokr.model = {
  stocks:
    [
      {
        "Symbol": "WIX",
        "Name": "Wix.com Ltd.",
        "Change": "0.750000",
        "PercentChange": "+1.51%",
        "CapitalMarket" : "3.4B",
        "LastTradePriceOnly": "76.099998"
      },
      {
        "Symbol": "MSFT",
        "Name": "Microsoft Corporation",
        "PercentChange": "-2.09%",
        "Change": "-0.850006",
        "CapitalMarket" : "7.2B",
        "LastTradePriceOnly": "69.620003"
      },
      {
        "Symbol": "YHOO",
        "Name": "Yahoo! Inc.",
        "Change": "0.279999",
        "PercentChange": "+1.11%",
        "CapitalMarket" : "4.7B",
        "LastTradePriceOnly": "50.599998"
      },
      {
        "Symbol": "AAPL",
        "Name": "Apple.com Company",
        "Change": "-0.349999",
        "PercentChange": "-2.62%",
        "CapitalMarket" : "749.7B",
        "LastTradePriceOnly": "143.729998"
      },
      {
        "Symbol": "GOOG",
        "Name": "Google.com Inc",
        "Change": "-0.349999",
        "PercentChange": "-2.62%",
        "CapitalMarket" : "345.3B",
        "LastTradePriceOnly": "927.327"
      },
      {
        "Symbol": "GPO",
        "Name": "GoPro.com LTD",
        "Change": "0.49999",
        "PercentChange": "+30.38%",
        "CapitalMarket" : "1.2B",
        "LastTradePriceOnly": "11.09"
      }
    ],
  state: {
    stocksToShow:
      [
        "WIX",
        "GOOG",
        "YHOO",
        "AAPL",
        "GPO",
        "MSFT",
        "AAPL"
      ],
    preferredNumber: 0,
    changePreferences: [
      "PercentChange",
      "Change",
      "CapitalMarket"
    ]
  },
  getStocks: function() {
    return stocks;
  },
  getState: function() {
    return state;
  }
};

// const stocks =
//   [
//     {
//       "Symbol": "WIX",
//       "Name": "Wix.com Ltd.",
//       "Change": "0.750000",
//       "PercentChange": "+1.51%",
//       "CapitalMarket" : "3.4B",
//       "LastTradePriceOnly": "76.099998"
//     },
//     {
//       "Symbol": "MSFT",
//       "Name": "Microsoft Corporation",
//       "PercentChange": "-2.09%",
//       "Change": "-0.850006",
//       "CapitalMarket" : "7.2B",
//       "LastTradePriceOnly": "69.620003"
//     },
//     {
//       "Symbol": "YHOO",
//       "Name": "Yahoo! Inc.",
//       "Change": "0.279999",
//       "PercentChange": "+1.11%",
//       "CapitalMarket" : "4.7B",
//       "LastTradePriceOnly": "50.599998"
//     },
//     {
//       "Symbol": "AAPL",
//       "Name": "Apple.com Company",
//       "Change": "-0.349999",
//       "PercentChange": "-2.62%",
//       "CapitalMarket" : "749.7B",
//       "LastTradePriceOnly": "143.729998"
//     },
//     {
//       "Symbol": "GOOG",
//       "Name": "Google.com Inc",
//       "Change": "-0.349999",
//       "PercentChange": "-2.62%",
//       "CapitalMarket" : "345.3B",
//       "LastTradePriceOnly": "927.327"
//     },
//     {
//       "Symbol": "GPO",
//       "Name": "GoPro.com LTD",
//       "Change": "0.49999",
//       "PercentChange": "+30.38%",
//       "CapitalMarket" : "1.2B",
//       "LastTradePriceOnly": "11.09"
//     }
//   ];
//
// const state = {
//   stocksToShow:
//     [
//       "WIX",
//       "GOOG",
//       "YHOO",
//       "AAPL",
//       "GPO",
//       "MSFT",
//       "AAPL"
//     ],
//   preferredNumber: 0,
//   changePreferences: [
//     "PercentChange",
//     "Change",
//     "CapitalMarket"
//   ]
// };
//
// function getState() {
//   return state;
// }

