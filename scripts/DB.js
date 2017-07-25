'use strict';

window.Stokr = window.Stokr || {};

(function init(adpater) {
  function _getStocks(stockSymbols) {
    let symbols = stockSymbols.reduce((symbols, symbol, index) => {
        if (index === 0) {
          return symbol;
        } else {
          return symbols + ',' + symbol;
        }
      }, null);

    return fetch(`http://localhost:7000/quotes?q=${symbols}`)
      .then((res) => {
        if(res.ok && res.status === 200 && res.headers.get('Content-Type').includes('application/json')) {
          return res.json().then(object => {
            return object.query.results.quote.reduce((stocks, stock) => {
              stocks.push(_extractStock(stock));
              return stocks;
            }, []);
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
      "CapitalMarket" : stock.MarketCapitalization,
      "LastTradePriceOnly": stock.LastTradePriceOnly
    };
  }

  function _getStockBySymbol(symbol) {
    return JSON.parse(JSON.stringify(stocks.find((stock) => {
      return stock.Symbol === symbol;
    })));
  }

  function _getState() {
    return fetch('scripts/state.json')
      .then((res) => {
        return res.json();
    });
  }

  function _updateStocksToShow(newStocksToShow) {
    state.stocksToShow = newStocksToShow;
  }

  function _updateFilterData(newfilterData) {
    state.filterData = newfilterData;
  }

  window.Stokr.DB = {
    getStocks: _getStocks,
    getStockBySymbol: _getStockBySymbol,
    getState: _getState,
    updateStocksToShow: _updateStocksToShow,
    updateFilterData: _updateFilterData
  };
})();

//
