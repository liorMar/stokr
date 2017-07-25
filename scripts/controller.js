'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.controller = {

};

(function init(){
  let interval;

  let hash = window.Stokr.view.getUrlHash();
  window.Stokr.view.setListener('body', 'click', stockHandle);

  if (window.Stokr.view.getUrlHash() === 'search'){
    window.Stokr.view.renderSearch();
  }

  window.Stokr.DB.getState()
    .then(state => {
        window.Stokr.model.state = state;
        return window.Stokr.DB.getStocks(state.stocksToShow);
    }).then(stocks => {
      window.Stokr.model.stocks = stocks;
      if (window.Stokr.view.getUrlHash() !== 'search') {
        loadStocksToView(stocks, window.Stokr.model.state);
        interval = setInterval(refreshStocks, 10000);
      }

      // window.Stokr.view.setListener('body', 'click', stockHandle);
  });

  function loadStocksToView(stocks, state) {
    if (state.filterState){
      applyHandler(state.filterData);
    } else {
      window.Stokr.view.renderMainPage(stocks, state);
    }
  }

  function stockHandle(action, args) {
    switch (action) {
      case 'change':
        changeButtonHandler();
        break;
      case 'up':
        upDownHandler(args[0], -1);
        break;
      case 'down':
        upDownHandler(args[0], 1);
        break;
      case 'filter':
        toggleHandler('filterState');
        break;
      case 'apply':
        applyHandler(args);
        break;
      case 'edit':
        toggleHandler('editState');
        break;
      case 'remove':
        removeSymbol(args[0]);
        break;
      case 'refresh':
        refreshStocks();
        break;
      case 'search-button':
        clearInterval(interval);
        window.Stokr.view.renderSearch();
        break;
      case 'search':

        break;
      case 'cancel':
        interval = setInterval(refreshStocks, 10000);
        loadStocksToView(window.Stokr.model.stocks, window.Stokr.model.state);
        break;
    }
  }

  function upDownHandler(symbol, action) {
    let state = window.Stokr.model.state;

    let oldIndex = state.stocksToShow.findIndex(function (stockSymbol) {
      return symbol === stockSymbol;
    });

    if (oldIndex !== -1) {
      swapSymbols(state, oldIndex, oldIndex+action);
      window.Stokr.DB.updateStocksToShow(state.stocksToShow);
      loadStocksToView(window.Stokr.model.stocks, state);
    }
  }

  function swapSymbols(state, oldIndex, newIndex) {
    let firstSymbol = state.stocksToShow.splice(oldIndex, 1)[0];
    state.stocksToShow.splice(newIndex, 0, firstSymbol);
  }

  function changeButtonHandler(){
    let state = window.Stokr.model.state;
    state.preferredChange = (state.preferredChange+1) % state.changePreferences.length;

    loadStocksToView(window.Stokr.model.stocks, state);
    //TODO save state
  }

  function toggleHandler(toToggle) {
    let state = window.Stokr.model.state;

    window.Stokr.model.state[toToggle] = !window.Stokr.model.state[toToggle];

    loadStocksToView(window.Stokr.model.stocks, state);
    //TODO save state
  }

  function applyHandler(filterParams) {
    let state = window.Stokr.model.state;

    state.filterData = filterParams;

    let stocks = window.Stokr.model.stocks.filter(filterFunc.bind(filterParams));

    window.Stokr.view.renderMainPage(stocks, state);
    //TODO save state
  }

  function filterFunc(stock) {
    let filterParams = this;

    let stockPercentChange = Number(stock.PercentChange);

    return (stock.Symbol.toLowerCase().includes(filterParams.name.toLowerCase()) ||
      stock.Name.toLowerCase().includes(filterParams.name.toLowerCase())) &&
      ((filterParams.gain === 'all') ||
      (filterParams.gain === 'losing' && stockPercentChange < 0) ||
      (filterParams.gain === 'gaining' && stockPercentChange > 0)) &&
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
      });;
  }
}());
