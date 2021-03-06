'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.controller = {

};

(function init(){
  let interval;

  window.Stokr.view.setListener('body', 'click', stockHandle);

  if (window.Stokr.view.getUrlHash() === 'search'){
    window.Stokr.view.renderSearch();
  }

  window.Stokr.DB.getState()
    .then(state => {
        window.Stokr.model.state = state;
      if (window.Stokr.view.getUrlHash() !== 'search'){
        loadStocksToView([], state);
      }
      return window.Stokr.DB.getStocks(state.stocksToShow);
    }).then(stocks => {
      window.Stokr.model.stocks = stocks;
      if (window.Stokr.view.getUrlHash() !== 'search') {
        loadStocksToView(stocks, window.Stokr.model.state);
        // interval = setInterval(refreshStocks, 10000);
      }
  });

  function loadStocksToView(stocks, state) {
    if (state.filterState){
      applyHandler(stocks, state.filterData);
    } else {
      window.Stokr.view.renderMainPage(stocks, state);
    }
  }

  function stockHandle(action, args) {
    handlers[action](args);
  }

  let handlers = {
    "change": changeButtonHandler,
    "refresh": refreshStocks,
    "add": addHandler,
    "searchValue": searchHandler,
    "remove": removeSymbol,
    "up": function (args) {
      upDownHandler(args, -1);
    },
    "down": function (args) {
      upDownHandler(args, 1);
    },
    "filter": function () {
      toggleHandler('filterState');
    },
    "edit": function () {
      toggleHandler('editState');
    },
    "apply": function (args) {
      applyHandler(window.Stokr.model.stocks, args);
    },
    "search": function () {
      clearInterval(interval);
      window.Stokr.view.renderSearch();
    },
    "cancel": function () {
      // interval = setInterval(refreshStocks, 10000);
      loadStocksToView(window.Stokr.model.stocks, window.Stokr.model.state);
    }
  };

  function upDownHandler(symbol, action) {
    let state = window.Stokr.model.state;

    let oldIndex = state.stocksToShow.findIndex(function (stockSymbol) {
      return symbol === stockSymbol;
    });

    if (oldIndex !== -1 && oldIndex+action >= 0 && oldIndex+action < state.stocksToShow.length) {
      swapSymbols(state, oldIndex, oldIndex+action);
      loadStocksToView(window.Stokr.model.stocks, state);
      window.Stokr.DB.updateState(state);
    }
  }

  function swapSymbols(state, oldIndex, newIndex) {
    let firstSymbol = state.stocksToShow.splice(oldIndex, 1)[0];
    state.stocksToShow.splice(newIndex, 0, firstSymbol);

    firstSymbol = window.Stokr.model.stocks.splice(oldIndex, 1)[0];
    window.Stokr.model.stocks.splice(newIndex, 0, firstSymbol);
  }

  function changeButtonHandler(){
    let state = window.Stokr.model.state;
    state.preferredChange = (state.preferredChange+1) % state.changePreferences.length;

    loadStocksToView(window.Stokr.model.stocks, state);
    window.Stokr.DB.updateState(state);
  }

  function toggleHandler(toToggle) {
    let state = window.Stokr.model.state;

    window.Stokr.model.state[toToggle] = !window.Stokr.model.state[toToggle];

    loadStocksToView(window.Stokr.model.stocks, state);
    window.Stokr.DB.updateState(state);
  }

  function applyHandler(stocks, filterParams) {
    let state = window.Stokr.model.state;

    state.filterData = filterParams;

    stocks = stocks.filter(filterFunc.bind(filterParams));

    window.Stokr.view.renderMainPage(stocks, state);
    window.Stokr.DB.updateState(state);
  }

  function filterFunc(stock) {
    let filterParams = this;

    let stockPercentChange = Number(stock.PercentChange);

    return (stock.Symbol.toLowerCase().includes(filterParams.name.toLowerCase()) ||
      stock.Name.toLowerCase().includes(filterParams.name.toLowerCase())) &&
      ((filterParams.gain === 'all') ||
      (filterParams.gain === 'losing' && stockPercentChange < 0) ||
      (filterParams.gain === 'gaining' && stockPercentChange >= 0)) &&
      (filterParams.from === '' || filterParams.from <= stockPercentChange) &&
      (filterParams.to === '' || stockPercentChange <= filterParams.to);
  }

  function removeSymbol(symbol) {
    let state = window.Stokr.model.state;
    let stocks = window.Stokr.model.stocks;

    let index = state.stocksToShow.findIndex(function (stockSymbol) {
      return symbol === stockSymbol;
    });

    if (index !== -1) {
      state.stocksToShow.splice(index, 1);
      stocks.splice(index, 1);

      loadStocksToView(stocks, state);
    }
  }

  function refreshStocks() {
    return window.Stokr.DB.getStocks(window.Stokr.model.state.stocksToShow)
      .then(stocks => {
        window.Stokr.model.stocks = stocks;
        loadStocksToView(stocks, window.Stokr.model.state);
      });
  }

  function searchHandler(searchValue) {
    let symbols = window.Stokr.model.state.stocksToShow;
    window.Stokr.DB.search(searchValue)
      .then((results, index) => {
        if (index === 0) return true;

        results = results.filter(stock => {
          return symbols.indexOf(stock.symbol) === -1;
        });

        window.Stokr.view.renderSearch(results);
      });
  }

  function addHandler(symbol) {
    let state = window.Stokr.model.state;

    state.stocksToShow.push(symbol);
    window.Stokr.DB.updateState(state);

    window.Stokr.DB.getStocks(state.stocksToShow)
      .then(stocks => {
        window.Stokr.model.stocks = stocks;
        loadStocksToView(stocks, window.Stokr.model.state);
      });

    loadStocksToView(window.Stokr.model.stocks, window.Stokr.model.state);
  }
}());
