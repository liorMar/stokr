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
            <a href="#search" class="search-button icon-search"></a>
          </li>
          <li>
            <button class="refresh-button icon-refresh"></button>
          </li>
          <li>
            <button class="filter-button icon-filter ${_areOn(state.filterState)}"></button>
          </li>
          <li>
            <button class="edit-button icon-settings ${_areOn(state.editState)}"></button>
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
        ${state.editState ? '<button class="remove-button"></button>' : ''}
        <h2>${stock.Symbol}</h2>
        <h3>(${stock.Name})</h3>
      </div>
      <div class="box-numbers">
        ${_round(stock.LastTradePriceOnly)}     
        <button class="change-button ${_redOrGreen(Number(stock.Change))}">
          ${_changeToShow(stock, state)} 
        </button>     
        <div class="box-arrow ${state.filterState ? 'box-arrow-hidden' : ''}" data-symbol="${stock.Symbol}">       
          <button class="icon-arrow up-button arrow-button" ${upDisabled}></button>
          <button class="icon-arrow down-button arrow-button" ${downDisabled}></button>
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
      <button class="apply-button">Apply</button>
  </form>
  `;
  }

  let listener;

  function _setListener(selector, eventType, handler) {
    listener = handler;
    document.querySelector(selector)
      .addEventListener(eventType, function (ev) {
        // debugger;
        if (ev.target.classList.contains('up-button')) {
          handler('up', _getClosestParent(ev.target, 'li').id);
        } else if (ev.target.classList.contains('down-button')) {
          handler('down', _getClosestParent(ev.target, 'li').id);
        } else if (ev.target.classList.contains('change-button')) {
          handler('change');
        } else if (ev.target.classList.contains('filter-button')) {
          handler('filter');
        } else if (ev.target.classList.contains('edit-button')) {
          handler('edit');
        } else if (ev.target.classList.contains('apply-button')) {
          handler('apply', _extractFilterParams(ev));
        } else if (ev.target.classList.contains('remove-button')) {
          handler('remove', _getClosestParent(ev.target, 'li').id);
        } else if (ev.target.classList.contains('refresh-button')) {
          handler('refresh');
        } else if (ev.target.classList.contains('search-button')) {
          handler('search-button');
        } else if (ev.target.classList.contains('cancel-button')) {
          handler('cancel');
        } else if (ev.target.classList.contains('add-button')) {
          handler('add', _getClosestParent(ev.target, 'li').id);
        }
      });
  }

  // {
  //   up: [_getClosestParent(ev.target, 'li').id]
  // }

  function _extractFilterParams() {
    return {
      name: document.getElementById('name').value,
      gain: document.getElementById('gain').value,
      from: document.getElementById('range-from').value,
      to: document.getElementById('range-to').value
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
        <a href="#" class="cancel-button capitalize">cancel</a>
      </div>
      ${_loadSearchResults(results)}`;

    document.querySelector('.panelSearch input').addEventListener('keypress', ev => {
      if(ev.keyCode === 13) {
        window.location.hash = '';
        listener('search', ev.target.value)
      }
    })

    // _setListener()

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
              <button class="add-button">+</button>
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
