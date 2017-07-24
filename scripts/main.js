window.Stokr = window.Stokr || {};

function stockFindFunction(stock) {
  return stock.Symbol === this[0];
}

function round(number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}

function redOrGreen(num) {
  return num >= 0 ? 'green-button' : 'red-button';
}

function getStockBySymbol(symbol) {
  return window.Stokr.model.getStocks().find(function (stock) {
    return stock.Symbol === symbol;
  });
}

(function init(stocks, state) {
  function loadHeader() {
    document.querySelector('body header').innerHTML = `
    <h1 class="logo">stokr</h1>
      <nav>
        <ul>
          <li>
            <a href="#" class="search-button icon-search"></a>
          </li>
          <li>
            <button class="refresh-button icon-refresh"></button>
          </li>
          <li>
            <button class="filter-button icon-filter"></button>
          </li>
          <li>
            <button class="settings-button icon-settings"></button>
          </li>
        </ul>
      </nav>
    `;
  }

  function loadStocks() {
    // const ulElement = document.querySelector('main');

    let stock;
    let ulInnerHTML = state.stocksToShow.reduce(
      function (html, stockSymbol, index) {
        if (stock = stocks.find(stockFindFunction.bind([stockSymbol])))
          return html + buildStockLi(stock, (index === 0 && 'disabled' ) || '', (index === (state.stocksToShow.length - 1) && 'disabled' ) || '');
        return html;
      }, '');

    document.querySelector('main').innerHTML = `
    <ul class="stocks">
      ${ulInnerHTML}
    </ul>
    `
  }

  function buildStockLi(stock, upDisabled, downDisabled) {
    return `
    <li class="box ${stock.Symbol}">
      <div>
        <h2>${stock.Symbol}</h2>
        <h3>(${stock.Name})</h3>
      </div>
      <div class="box-numbers">
        ${round(stock.LastTradePriceOnly)}     
        <button class="change-button ${redOrGreen(Number(stock.Change))}">
          ${changeToShow(stock)} 
        </button>     
        <div class="box-arrow" data-symbol="${stock.Symbol}">       
          <button class="icon-arrow up-button arrow-button" ${upDisabled}></button>
          <button class="icon-arrow down-button arrow-button" ${downDisabled}></button>
        </div>
      </div>
    </li>`;
  }

  loadHeader();
  loadStocks();

  setHandler('body', stockHandle);
}(window.Stokr.model.getStocks(), window.Stokr.model.getState()));

function swapStocks(stockIndex, newPosition) {
  let tempStock = window.Stokr.model.getState().stocksToShow[stockIndex];
  window.Stokr.model.getState().stocksToShow[stockIndex] = window.Stokr.model.getState().stocksToShow[stockIndex + newPosition];
  window.Stokr.model.getState().stocksToShow[stockIndex + newPosition] = tempStock;
}

function swapInnerHTML(firstSwapStock, secondSwapStock) {
  let tempHTML = firstSwapStock.innerHTML;
  firstSwapStock.innerHTML = secondSwapStock.innerHTML;
  secondSwapStock.innerHTML = tempHTML;
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

function swapLiStockClass(firstSwapStockLiElement, stockIndex, secondSwapStockLiElement, newPosition) {
  firstSwapStockLiElement.classList.remove(window.Stokr.model.getState().stocksToShow[stockIndex]);
  secondSwapStockLiElement.classList.remove(window.Stokr.model.getState().stocksToShow[stockIndex + newPosition]);
  firstSwapStockLiElement.classList.add(window.Stokr.model.getState().stocksToShow[stockIndex + newPosition]);
  secondSwapStockLiElement.classList.add(window.Stokr.model.getState().stocksToShow[stockIndex]);
}

function upDownHandler(buttonElement) {
  let newPosition = (buttonElement.classList.contains('up-button')) ? -1 : 1;

  let symbol = buttonElement.parentElement.getAttribute('data-symbol');

  let stockIndex = window.Stokr.model.getState().stocksToShow.findIndex((stockSymbol) => {
    return stockSymbol === symbol
  });

  let firstSwapStockLiElement = document.querySelector('.' + window.Stokr.model.getState().stocksToShow[stockIndex]);
  let secondSwapStockLiElement = document.querySelector('.' + window.Stokr.model.getState().stocksToShow[stockIndex + newPosition]);

  swapLiStockClass(firstSwapStockLiElement, stockIndex, secondSwapStockLiElement, newPosition);

  swapLiButtonsDisabledValue(firstSwapStockLiElement, secondSwapStockLiElement);

  swapInnerHTML(firstSwapStockLiElement, secondSwapStockLiElement);
  swapStocks(stockIndex, newPosition);
}

function hideShowReorderControls(liElement) {
  let divElement = liElement.querySelector('.box-arrow');

  divElement.classList.toggle('box-arrow-hidden');
}

function resetFilter(stockElement) {
  stockElement.classList.remove('hide-stocks');
}

function hideFilterPanel(filterButton, mainElement) {
  filterButton.classList.remove('on');
  mainElement.removeChild(mainElement.children[0]);
  mainElement.querySelectorAll('li').forEach(resetFilter);
}

function showFilterPanel(filterButton, mainElement) {
  let headerElement = document.createElement('header');

  // headerElement.classList.add('div-filter');

  headerElement.innerHTML = `
    <div class="div-filter-name-gain">
        <div>
          <label for="name" class="capitalize">by name</label>
          <input type="text" id="name">
        </div>
        <div>
          <label for="gain" class="capitalize">by gain</label>
          <select id="gain">
            <option value="all" class="capitalize">all</option>
            <option value="losing" class="capitalize">losing</option>
            <option value="gaining" class="capitalize">gaining</option>
          </select>
        </div>
    </div>
    <div class="div-filter-range">
        <div>
          <label for="range-from" class="capitalize">by range: from</label>
          <input type="number" id="range-from">
        </div>
        <div>
          <label for="range-to" class="capitalize">by range: to</label>
          <input type="number" id="range-to">
        </div>
    </div>
    <button class="apply-button">Apply</button>
  `;

  mainElement.insertBefore(headerElement, mainElement.childNodes[0]);

  filterButton.classList.add('on');
}

function filterButtonHandler(filterButton) {
  let mainElement = document.querySelector('body main');

  if (filterButton.classList.contains('on')){
    hideFilterPanel(filterButton, mainElement);
  } else {
    showFilterPanel(filterButton, mainElement);
  }

  mainElement.querySelectorAll('li').forEach(hideShowReorderControls);
}

function filterFunc(stockLiElement) {
  let filterParams = this;
  let symbol = stockLiElement.querySelector('h2').innerText;

  let stock = getStockBySymbol(symbol);
  if (!stock)
    return;

  let stockPercentChange = Number(stock.PercentChange.substr(0,stock.PercentChange.length-1));

  stockLiElement.classList.remove('hide-stocks');
  if (!stockLiElement.firstElementChild.textContent.toLowerCase().includes(filterParams[0]) ||
    (filterParams[1] === 'losing' && stockLiElement.querySelector('.change-button').classList.contains('green-button')) ||
    (filterParams[1] === 'gaining' && stockLiElement.querySelector('.change-button').classList.contains('red-button')) ||
    (filterParams[2] !== '' && filterParams[2] > stockPercentChange) ||
    (filterParams[3] !== '' && stockPercentChange > filterParams[3])){
    stockLiElement.classList.add('hide-stocks');
  }
}

function applyButtonHandler() {
  const filterParams = [
    document.getElementById('name').value.toLowerCase(),
    document.getElementById('gain').value,
    document.getElementById('range-from').value,
    document.getElementById('range-to').value
  ];

  document.querySelectorAll('.stocks li').forEach(filterFunc.bind(filterParams));
}

function changeToShow(stock) {
  let changeType = window.Stokr.model.getState().changePreferences[window.Stokr.model.getState().preferredNumber];
  return changeType === 'Change' ? round(stock[changeType]) : stock[changeType];
}

function changeButtonHandler(){
  state.preferredNumber = (window.Stokr.model.getState().preferredNumber+1) % window.Stokr.model.getState().changePreferences.length;

  let buttonElements = document.querySelectorAll('.change-button');
  buttonElements.forEach((buttonElement, index) => {
    let stockSymbol = buttonElement.nextElementSibling.getAttribute('data-symbol');
    buttonElement.innerHTML = changeToShow(getStockBySymbol(stockSymbol));
  });
}

function stockHandle(ev) {
  if (ev.target.classList.contains('arrow-button')) {
    upDownHandler(ev.target);
  } else if (ev.target.classList.contains('change-button')) {
    changeButtonHandler();
  } else if (ev.target.classList.contains('filter-button')) {
    filterButtonHandler(ev.target);
  } else if (ev.target.classList.contains('apply-button')) {
    applyButtonHandler();
  }
}

function setHandler(selector, handler) {
  document.querySelector(selector)
    .addEventListener('click', handler);
}



// const stocks =
//   [
//     {
//       "Symbol": "WIX",
//       "Name": "Wix.com Ltd.",
//       "Change": "0.750000",
//       "PercentChange": "+1.51%",
//       "CapitalMarket" : "3.4B",
//       "LastTradePriceOnly": "76.099998"
//     },
//     {
//       "Symbol": "MSFT",
//       "Name": "Microsoft Corporation",
//       "PercentChange": "-2.09%",
//       "Change": "-0.850006",
//       "CapitalMarket" : "7.2B",
//       "LastTradePriceOnly": "69.620003"
//     },
//     {
//       "Symbol": "YHOO",
//       "Name": "Yahoo! Inc.",
//       "Change": "0.279999",
//       "PercentChange": "+1.11%",
//       "CapitalMarket" : "4.7B",
//       "LastTradePriceOnly": "50.599998"
//     },
//     {
//       "Symbol": "AAPL",
//       "Name": "Apple.com Company",
//       "Change": "-0.349999",
//       "PercentChange": "-2.62%",
//       "CapitalMarket" : "749.7B",
//       "LastTradePriceOnly": "143.729998"
//     },
//     {
//       "Symbol": "GOOG",
//       "Name": "Google.com Inc",
//       "Change": "-0.349999",
//       "PercentChange": "-2.62%",
//       "CapitalMarket" : "345.3B",
//       "LastTradePriceOnly": "927.327"
//     },
//     {
//       "Symbol": "GPO",
//       "Name": "GoPro.com LTD",
//       "Change": "0.49999",
//       "PercentChange": "+30.38%",
//       "CapitalMarket" : "1.2B",
//       "LastTradePriceOnly": "11.09"
//     }
//   ];
//
// const state = {
//   stocksToShow:
//     [
//       "WIX",
//       "GOOG",
//       "YHOO",
//       "AAPL",
//       "GPO",
//       "MSFT",
//       "AAPL"
//     ],
//   preferredNumber: 0,
//   changePreferences: [
//     "PercentChange",
//     "Change",
//     "CapitalMarket"
//   ]
// };
