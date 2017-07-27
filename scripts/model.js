'use strict';

window.Stokr = window.Stokr || {};

(function init() {
  const state = {
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

  const stateListeners = {
    stocksToShow: [],
    preferredChange: [],
    filterState: [],
    editState: [],
    searchState: [],
    changePreferences: [],
    filterData: []
  };

  let stocks;

  function _updateStateValue(parameter, value) {
    state[parameter] = value;
    stateListeners[parameter].forEach(func => func());
  }

  function _addListener(on, listener) {
    stateListeners[on].push(listener);
  }

  function _getState() {
    return _clone(state);
  }

  function _getStocks() {
    return _clone(stocks);
  }

  function _clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  window.Stokr.model = {
    addListener: _addListener,
    updateStateValue: _updateStateValue,
    getState: _getState,
    getStocks: _getStocks
  };
})();
