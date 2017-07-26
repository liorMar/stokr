'use strict';

window.Stokr = window.Stokr || {};

(function init(){
  function _renderMainPage(stocks, state) {
    if (state.searchState){
      //TODO display search window
    } else {
      document.querySelector('main').innerHTML = `
      <div class="panelMain">
        <h1 class="logo">stokr</h1>
        <ul>
          <li>
            <a href="#search" class="search-button icon-search" action="search"></a>
          </li>
          <li>
            <button class="refresh-button icon-refresh" action="refresh"></button>
          </li>
          <li>
            <button class="filter-button icon-filter ${_areOn(state.filterState)}" action="filter"></button>
          </li>
          <li>
            <button class="edit-button icon-settings ${_areOn(state.editState)}" action="edit"></button>
          </li>
        </ul>
      </div>
      ${_loadFilter(state)}
      ${_loadStocks(stocks, state)}`;
    }
  }

  function _areOn(state) {
    return state ? 'on' : '';
  }

  function _loadStocks(stocks, state) {
    let ulInnerHTML = stocks.reduce(function (html, stock, index) {
      return html + _buildStockLi(stock, state, (index === 0 && 'disabled' ) || '', (index === (stocks.length - 1) && 'disabled' ) || '');
    }, '');

    return `
    <ul class="stocks">
      ${ulInnerHTML}
    </ul>`;
  }

  function _buildStockLi(stock, state, upDisabled, downDisabled) {
    return `
    <li class="box" id="${stock.Symbol}">
      <div class="stock-name">
        ${state.editState ? '<button class="remove-button" action="remove"></button>' : ''}
        <h2>${stock.Symbol}</h2>
        <h3>(${stock.Name})</h3>
      </div>
      <div class="box-numbers">
        ${_round(stock.LastTradePriceOnly)}     
        <button class="change-button ${_redOrGreen(Number(stock.Change))}" action="change">
          ${_changeToShow(stock, state)} 
        </button>     
        <div class="box-arrow ${state.filterState ? 'box-arrow-hidden' : ''}" data-symbol="${stock.Symbol}">       
          <button class="icon-arrow up-button arrow-button" ${upDisabled} action="up"></button>
          <button class="icon-arrow down-button arrow-button" ${downDisabled} action="down"></button>
        </div>
      </div>
    </li>`;
  }

  function _changeToShow(stock, state) {
    let changeType = state.changePreferences[state.preferredChange];
    if (changeType === 'Change') {
      return _round(stock[changeType]);
    } else if (changeType === 'PercentChange') {
      return stock[changeType] + '%';
    }

    return stock[changeType] + 'B';
  }

  function _round(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
  }

  function _redOrGreen(num) {
    return num >= 0 ? 'green-button' : 'red-button';
  }

  function _loadFilter(state) {
    if (!state.filterState) {
      return ''
    }
    return `
    <form class="filter">
      <div class="div-filter-name-gain">
          <div>
            <label for="name" class="capitalize">by name</label>
            <input type="text" id="name" name="name" value="${state.filterData.name}">
          </div>
          <div>
            <label for="gain" class="capitalize">by gain</label>
            <select id="gain" name="gain">
              <option value="all" class="capitalize" ${state.filterData.gain === 'all' ? 'selected' : ''}>all</option>
              <option value="losing" class="capitalize" ${state.filterData.gain === 'losing' ? 'selected' : ''}>losing</option>
              <option value="gaining" class="capitalize" ${state.filterData.gain === 'gaining' ? 'selected' : ''}>gaining</option>
            </select>
          </div>
      </div>
      <div class="div-filter-range">
          <div>
            <label for="range-from" class="capitalize">by range: from</label>
            <input type="number" id="range-from" name="range-from" value="${state.filterData.from}">
          </div>
          <div>
            <label for="range-to" class="capitalize">by range: to</label>
            <input type="number" id="range-to" name="range-to" value="${state.filterData.to}">
          </div>
      </div>
      <button class="apply-button" action="apply">Apply</button>
  </form>
  `;
  }

  let listener;

  function _setListener(selector, eventType, handler) {
    listener = handler;
    document.querySelector(selector)
      .addEventListener(eventType, function (ev) {
        let action;
        if (action = ev.target.getAttribute('action')) {
          switch (action) {
            case 'apply':
              listener('apply', _extractFilterParams(ev.target));
              break;
            case 'add':
              window.location.hash = '';
            case 'up':
            case 'down':
            case 'remove':
              handler(action, _getClosestParent(ev.target, 'li').id);
              break;
            case 'change':
            case 'filter':
            case 'edit':
            case 'refresh':
            case 'search':
            case 'cancel':
              handler(action);
          }
        }
      });
  }

  function _extractFilterParams(target) {
    target = _getClosestParent(target, 'form');

    return {
      name: target[0].value,
      gain: target[1].value,
      from: target[2].value,
      to: target[3].value
    };
  }

  function _getClosestParent(element, localName) {
    if (element.parentElement && element.parentElement.localName === localName)
      return element.parentElement;
    else if (!element.parentElement || element.parentElement.localName === 'html')
      return undefined;

    return _getClosestParent(element.parentElement, localName);
  }

  function _renderSearch(results) {
    document.querySelector('main').innerHTML = `
      <div class="panelSearch">
        <input type="text" name="search" id="search" value="${results ? results[0] : ''}">
        <a href="#" class="cancel-button capitalize" action="cancel">cancel</a>
      </div>
      ${_loadSearchResults(results)}`;

    document.querySelector('.panelSearch input').addEventListener('keypress', ev => {
      if(ev.keyCode === 13) {
        listener('searchValue', ev.target.value)
      }
    })
  }

  function _loadSearchResults(results) {
    if (results !== undefined) {
      if (results.length === 1) {
        return `
          <div class="search-div">
            <div class="icon-search-place-holder"></div>
            <div class="capitalize">not found</div>
          </div>
        `;
      } else {
        return `
        <ul class="results">
          ${_buildAnswers(results)}
        </ul>`;
      }
    } else {
      return `
          <div class="search-div">
            <div class="icon-search-place-holder"></div>
            <div class="capitalize">search</div>
          </div>
        `;
    }
  }

  function _buildAnswers(reults) {
    return reults.reduce((stocksLis, stock, index) => {
      return index === 0 ? stocksLis : stocksLis + `
            <li class="box" id="${stock.symbol}">
              <div class="stock-name">
                <h2>${stock.symbol}</h2>
                <h3>${stock.name}</h3>
              </div>
              <button class="add-button" action="add">+</button>
            </li>`;
    }, '')
  }

  function _getUrlHash() {
    return window.location.hash.slice(1);
  }

  window.Stokr.view = {
    renderMainPage: _renderMainPage,
    setListener: _setListener,
    renderSearch: _renderSearch,
    getUrlHash: _getUrlHash
  };
})()
