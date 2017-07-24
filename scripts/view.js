'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.view = {
  renderMainPage: _renderMainPage,
  setListener: _setListener

};

function _renderMainPage(stocks, state) {
  if (state.searchState){
    //TODO display search window
  } else {
    document.querySelector('main').innerHTML = `
      <div class="panelMain">
        <h1 class="logo">stokr</h1>
        <ul>
          <li>
            <a href="#" class="search-button icon-search"></a>
          </li>
          <li>
            <button class="refresh-button icon-refresh"></button>
          </li>
          <li>
            <button class="filter-button icon-filter ${areOn(state.filterState)}"></button>
          </li>
          <li>
            <button class="settings-button icon-settings ${areOn(state.editState)}"></button>
          </li>
        </ul>
      </div>` + loadStocks(stocks, state);
  }
}

function areOn(state) {
  return state ? 'on' : '';
}

function loadStocks(stocks, state) {
  let ulInnerHTML = stocks.reduce(function (html, stock, index) {
    return html + buildStockLi(stock, state, (index === 0 && 'disabled' ) || '', (index === (stocks.length - 1) && 'disabled' ) || '');
  }, '');

  return `
    <ul class="stocks">
      ${ulInnerHTML}
    </ul>`;
}

function buildStockLi(stock, state, upDisabled, downDisabled) {
  return `
    <li class="box" id="${stock.Symbol}">
      <div>
        <h2>${stock.Symbol}</h2>
        <h3>(${stock.Name})</h3>
      </div>
      <div class="box-numbers">
        ${_round(stock.LastTradePriceOnly)}     
        <button class="change-button ${_redOrGreen(Number(stock.Change))}">
          ${_changeToShow(stock, state)} 
        </button>     
        <div class="box-arrow" data-symbol="${stock.Symbol}">       
          <button class="icon-arrow up-button arrow-button" ${upDisabled}></button>
          <button class="icon-arrow down-button arrow-button" ${downDisabled}></button>
        </div>
      </div>
    </li>`;
}

function _changeToShow(stock, state) {
  let changeType = state.changePreferences[state.preferredChange];
  return changeType === 'Change' ? _round(stock[changeType]) : stock[changeType];
}

function _round(number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}

function _redOrGreen(num) {
  return num >= 0 ? 'green-button' : 'red-button';
}

function _setListener(selector, eventType, handler) {
  document.querySelector(selector)
    .addEventListener(eventType, function (ev) {
      if (ev.target.classList.contains('up-button')) {
        handler('up', [getClosestParent(ev.target, 'li').id]);
      } else if (ev.target.classList.contains('down-button')) {
        handler('down', [getClosestParent(ev.target, 'li').id]);
      } else if (ev.target.classList.contains('change-button')) {
        handler('change');
      } else if (ev.target.classList.contains('filter-button')) {
        handler('filter');
      } else if (ev.target.classList.contains('apply-button')) {
        handler('apply', []);
      }
    });
}

function getClosestParent(element, localName) {
  if (element.parentElement && element.parentElement.localName === localName)
    return element.parentElement;
  else if (!element.parentElement || element.parentElement.localName === 'html')
    return undefined;

  return getClosestParent(element.parentElement, localName);
}

function swapLiStockClass(firstSwapStockLiElement, stockIndex, secondSwapStockLiElement, newPosition, stocksToShow) {
  firstSwapStockLiElement.classList.remove(stocksToShow[stockIndex]);
  secondSwapStockLiElement.classList.remove(stocksToShow[stockIndex + newPosition]);
  firstSwapStockLiElement.classList.add(stocksToShow[stockIndex + newPosition]);
  secondSwapStockLiElement.classList.add(stocksToShow[stockIndex]);
}

function swapInnerHTML(firstSwapElement, secondSwapElement) {
  let tempHTML = firstSwapElement.innerHTML;
  firstSwapElement.innerHTML = secondSwapElement.innerHTML;
  secondSwapElement.innerHTML = tempHTML;
}
