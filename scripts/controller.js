'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.controller = {

};

(function init(){
  window.Stokr.DB.getState(function (state) {
    window.Stokr.model.state = state;
    window.Stokr.DB.getStocks(function (stocks) {
      state.stocks = stocks;
      loadStocksToView(state);
      window.Stokr.view.setListener('body', 'click', stockHandle);
    }, state.stocksToShow);
  });
}());

function loadStocksToView(state, stocks) {
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
    loadStocksToView(state);
  }
}

function swapSymbols(state, oldIndex, newIndex) {
  let firstSymbol = state.stocksToShow.splice(oldIndex, 1)[0];
  state.stocksToShow.splice(newIndex, 0, firstSymbol);
}

function changeButtonHandler(){
  let state = window.Stokr.model.state;
  state.preferredChange = (state.preferredChange+1) % state.changePreferences.length;

  loadStocksToView(state);
  //TODO save state
}

function toggleHandler(toToggle) {
  window.Stokr.model.state[toToggle] = !window.Stokr.model.state[toToggle];

  let state = window.Stokr.model.state;

  loadStocksToView(state);
  //TODO save state
}

function applyHandler(filterParams) {
  let state = window.Stokr.model.state;

  let stocks = state.stocks.filter(filterFunc.bind(filterParams));

  state.filterData = filterParams;

  window.Stokr.view.renderMainPage(stocks, state);
  //TODO save state
}

function filterFunc(stock) {
  let filterParams = this;

  let stockPercentChange = Number(stock.PercentChange.substr(0,stock.PercentChange.length-1));

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

  let index = state.stocksToShow.findIndex(function (stockSymbol) {
    return symbol === stockSymbol;
  });

  if (index !== -1) {
    state.stocksToShow.splice(index, 1);

    loadStocksToView(state, stocks);
    window.Stokr.DB.updateStocksToShow(state.stocksToShow);
  }
}
