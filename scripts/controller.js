'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.controller = {

};

(function init(){
  let state = window.Stokr.DB.getState();
  window.Stokr.model.state = state;

  let stocks = window.Stokr.DB.getStocks(state.stocksToShow);

  window.Stokr.view.renderMainPage(stocks, state);
  window.Stokr.view.setListener('body', 'click', stockHandle);
}());



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

      break;
    case 'apply':

      break;
  }

  // if (ev.target.classList.contains('arrow-button')) {
  //   upDownHandler(ev.target);
  // } else if (ev.target.classList.contains('change-button')) {
  //
  // } else if (ev.target.classList.contains('filter-button')) {
  //   filterButtonHandler(ev.target);
  // } else if (ev.target.classList.contains('apply-button')) {
  //   applyButtonHandler();
  // }
}

function upDownHandler(symbol, action) {
  let state = window.Stokr.model.state;

  let oldIndex = state.stocksToShow.findIndex(function (stockSymbol) {
    return symbol === stockSymbol;
  });

  if (oldIndex !== -1) {
    swapSymbols(state, oldIndex, oldIndex+action);
    window.Stokr.DB.updateStocksToShow(state.stocksToShow);
    window.Stokr.view.renderMainPage(window.Stokr.DB.getStocks(state.stocksToShow), state);
  }

  // let symbol = buttonElement.parentElement.getAttribute('data-symbol');
  //
  // let stockIndex = stocksToShow.findIndex((stockSymbol) => {
  //   return stockSymbol === symbol
  // });
  //
  // let firstSwapStockLiElement = window.Stokr.view.getElementBySelector('.' + stocksToShow[stockIndex]);
  // let secondSwapStockLiElement = window.Stokr.view.getElementBySelector('.' + stocksToShow[stockIndex + newPosition]);
  //
  // swapLiStockClass(firstSwapStockLiElement, stockIndex, secondSwapStockLiElement, newPosition, stocksToShow);
  //
  // swapLiButtonsDisabledValue(firstSwapStockLiElement, secondSwapStockLiElement);
  //
  // swapInnerHTML(firstSwapStockLiElement, secondSwapStockLiElement);
  // swapStocks(stockIndex, newPosition);
}

function changeButtonHandler(){
  let state = window.Stokr.model.state;
  state.preferredChange = (state.preferredChange+1) % state.changePreferences.length;

  window.Stokr.view.renderMainPage(window.Stokr.DB.getStocks(state.stocksToShow), state);
}

function swapSymbols(state, oldIndex, newIndex) {
  let firstSymbol = state.stocksToShow.splice(oldIndex, 1)[0];
  state.stocksToShow.splice(newIndex, 0, firstSymbol);
}

function swapLiButtonsDisabledValue(firstSwapStockLiElement, secondSwapStockLiElement) {
  let firstSwapStockDivArrowElement = firstSwapStockLiElement.querySelector('.box-arrow');
  let secondSwapStockDivArrowElement = secondSwapStockLiElement.querySelector('.box-arrow');

  let tempDisabled = firstSwapStockDivArrowElement.firstElementChild.disabled;
  firstSwapStockDivArrowElement.firstElementChild.disabled = secondSwapStockDivArrowElement.firstElementChild.disabled;
  secondSwapStockDivArrowElement.firstElementChild.disabled = tempDisabled;

  tempDisabled = firstSwapStockDivArrowElement.lastElementChild.disabled;
  firstSwapStockDivArrowElement.lastElementChild.disabled = secondSwapStockDivArrowElement.lastElementChild.disabled;
  secondSwapStockDivArrowElement.lastElementChild.disabled = tempDisabled;
}



