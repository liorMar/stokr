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
        <button class="remove-button ${state.editState ? '' : 'ignore'}"></button>
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
  return changeType === 'Change' ? _round(stock[changeType]) : stock[changeType];
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
    <div class="filter">
      <div class="div-filter-name-gain">
          <div>
            <label for="name" class="capitalize">by name</label>
            <input type="text" id="name" value="${state.filterData.name}">
          </div>
          <div>
            <label for="gain" class="capitalize">by gain</label>
            <select id="gain">
              <option value="all" class="capitalize" ${state.filterData.gain === 'all' ? 'selected' : ''}>all</option>
              <option value="losing" class="capitalize" ${state.filterData.gain === 'losing' ? 'selected' : ''}>losing</option>
              <option value="gaining" class="capitalize" ${state.filterData.gain === 'gaining' ? 'selected' : ''}>gaining</option>
            </select>
          </div>
      </div>
      <div class="div-filter-range">
          <div>
            <label for="range-from" class="capitalize">by range: from</label>
            <input type="number" id="range-from" value="${state.filterData.from}">
          </div>
          <div>
            <label for="range-to" class="capitalize">by range: to</label>
            <input type="number" id="range-to" value="${state.filterData.to}">
          </div>
      </div>
      <button class="apply-button">Apply</button>
  </div>
  `;
}

function _setListener(selector, eventType, handler) {
  document.querySelector(selector)
    .addEventListener(eventType, function (ev) {
      if (ev.target.classList.contains('up-button')) {
        handler('up', [_getClosestParent(ev.target, 'li').id]);
      } else if (ev.target.classList.contains('down-button')) {
        handler('down', [_getClosestParent(ev.target, 'li').id]);
      } else if (ev.target.classList.contains('change-button')) {
        handler('change');
      } else if (ev.target.classList.contains('filter-button')) {
        handler('filter');
      } else if (ev.target.classList.contains('edit-button')) {
        handler('edit');
      } else if (ev.target.classList.contains('apply-button')) {
        handler('apply', _extractFilterParams());
      } else if (ev.target.classList.contains('remove-button')) {
        handler('remove', [_getClosestParent(ev.target, 'li').id]);
      } else if (ev.target.classList.contains('refresh-button')) {
        handler('refresh');
      }
    });
}

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
