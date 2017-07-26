'use strict';

window.Stokr = window.Stokr || {};

(function init(adpater) {
  let baseURL = 'http://localhost:7000/';
  let getStockURL = 'quotes?q=';
  let searchStockURL = 'search?q=';

  function _getStocks(stockSymbols) {
    let symbols = stockSymbols.reduce((symbols, symbol, index) => {
        if (index === 0) {
          return symbol;
        } else {
          return symbols + ',' + symbol;
        }
      }, null);

    return fetch(`${baseURL}${getStockURL}${symbols}`)
      .then((res) => {
        if(res.ok && res.status === 200 && res.headers.get('Content-Type').includes('application/json')) {
          return res.json().then(object => {
            if (object.query.count === 1) {
              return [_extractStock(object.query.results.quote)]
            } else if (object.query.count > 1) {
              return object.query.results.quote.map((stock) => {
                return _extractStock(stock);
              });
            }
          });
        } else {
          return fetch('scripts/stocks.json').then((res) => res.json());
        }
      });
  }

  function _extractStock(stock) {
    return {
      "Symbol": stock.Symbol,
      "Name": stock.Name,
      "Change": stock.Change,
      "PercentChange": (Math.round(stock.realtime_chg_percent * 100) / 100).toFixed(2),
      "CapitalMarket" : _capitalMarket(stock.MarketCapitalization),
      "LastTradePriceOnly": stock.LastTradePriceOnly
    };
  }

  function _capitalMarket(capitalMarket) {
    capitalMarket = capitalMarket.substr(0, capitalMarket.length-1);
    return (Math.round(capitalMarket * 100) / 100).toFixed(2)
  }

  function _getStockBySymbol(symbol) {
    return JSON.parse(JSON.stringify(stocks.find((stock) => {
      return stock.Symbol === symbol;
    })));
  }

  function _getState() {
    return Promise.resolve().then(() => {
      let state = localStorage.getItem("state");

      if (state) {
        return JSON.parse(state);
      } else {
        _updateState(defoultState);

        return defoultState;
      }
    })
  }

  function _updateState(newState) {
      localStorage.setItem("state", JSON.stringify(newState));
  }

  function _search(searchValue) {
    return fetch(`${baseURL}${searchStockURL}${searchValue}`)
      .then((res) => {
        if(res.ok && res.status === 200 && res.headers.get('Content-Type').includes('application/json')) {
          return res.json().then(object => {
            return object.ResultSet.Result.reduce((results, res) => {
              results.push({
                symbol: res.symbol,
                name: res.name,
              });

              return results;
            }, [searchValue]);
          });
        } else {
          return [searchValue];
        }
      });
  }

  const defoultState = {
    stocksToShow: [
      "WIX",
      "GOOG",
      "AAPL",
      "MSFT",
      "NKE",
      "SBUX",
      "T25.TA"
    ],
    preferredChange: 1,
    filterState: false,
    editState: false,
    searchState: false,
    changePreferences: [
      "PercentChange",
      "Change",
      "CapitalMarket"
    ],
    filterData: {
      "name": "",
      "gain": "all",
      "from": "",
      "to": ""
    }
  };

  window.Stokr.DB = {
    getStocks: _getStocks,
    getStockBySymbol: _getStockBySymbol,
    getState: _getState,
    updateState: _updateState,
    search: _search
  };
})();

//
