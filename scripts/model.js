'use strict';

window.Stokr = window.Stokr || {};

window.Stokr.model = {

  // getAll: _getAll,
  // getStockSymbolsToShow: _getStockSymbolsToShow,
  // addStockSymbol: _addStockSymbol,
  // removeStockSymbol: _removeStockSymbol,
  // swapSymbols: _swapSymbols,
  // getPreferredChange: _getPreferredChange,
  // setPreferredChange: _setPreferredChange,
  // getChangePreferences: _getChangePreferences,
  // addChangePreferences: _addChangePreferences,
  // removeChangePreferences: _removeChangePreferences,
  // getFilterState: _getFilterState,
  // flipFilterState: _flipFilterState,
  // getEditState: _getEditState,
  // flipEditState: _flipEditState,
  // getSearchState: _getSearchState,
  // flipSearchState: _flipSearchState
};

function _getAll() {
  return {
    stocksToShow: _getStockSymbolsToShow(),
    preferredChange: _getPreferredChange(),
    filterState: _getFilterState(),
    editState: _getEditState(),
    searchState: _getSearchState(),
    changePreferences: _getChangePreferences()
  }
}

function _getStockSymbolsToShow() {
  return stocksToShow.slice();
}

function _addStockSymbol(symbol) {
  stocksToShow.add(symbol);
}

function _removeStockSymbol(symbol) {
  stocksToShow.remove(symbol);
}

function _swapSymbols(oldIndex, newIndex) {
  let firstSymbol = stocksToShow.splice(oldIndex, 1)[0];
  stocksToShow.splice(newIndex, 0, firstSymbol);
}

function _getPreferredChange(){
  return preferredChange;
}

function _setPreferredChange(newPreferredChange){
  preferredChange = newPreferredChange;
}

function _getChangePreferences() {
  return changePreferences.slice();
}

function _addChangePreferences(variableName) {
  changePreferences.add(variableName);
}

function _removeChangePreferences(variableName) {
  changePreferences.remove(variableName);
}

function _getFilterState() {
  return filterState;
}

function _flipFilterState() {
  filterState = !filterState;
}

function _getEditState() {
  return editState;
}

function _flipEditState() {
  editState = !editState;
}

function _getSearchState() {
  return searchState;
}

function _flipSearchState() {
  searchState = !searchState;
}
