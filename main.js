const stocks =
  [
    {
      "Symbol": "WIX",
      "Name": "Wix.com Ltd.",
      "Change": "0.750000",
      "PercentChange": "+1.51%",
      "thirdChange" : "N/A",
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "thirdChange" : "N/A",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "YHOO",
      "Name": "Yahoo! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "thirdChange" : "N/A",
      "LastTradePriceOnly": "50.599998"
    },
    {
      "Symbol": "YHOO2",
      "Name": "Yahoo2! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "thirdChange" : "N/A",
      "LastTradePriceOnly": "50.599998"
    }
  ];

const stocksToShow =
  [
    "WIX",
    "MSFT",
    "YHOO"
  ];

const changePreferences = {
  0: "PercentChange",
  1: "Change",
  2: "thirdChange",
  preferredNumber: 0,
  length: 3
};

function stockFindFunction(stock) {
  return stock.Symbol === this[0];
}

function round(number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}

function redOrGreen(num) {
  return num >= 0 ? 'green-button' : 'red-button';
}

(function init(stocks, stocksToShow) {
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
    const ulElement = document.querySelector('main > ul');
    let stock;
    ulElement.innerHTML = stocksToShow.reduce(
      function (html, stockSymbol, index) {
        if (stock = stocks.find(stockFindFunction.bind([stockSymbol])))
          return html + addStock(stock, (index === 0 && 'disabled' ) || '', (index === (stocksToShow.length - 1) && 'disabled' ) || '');
        return html;
      }, '');
  }

  function addStock(stock, upDisabled, downDisabled) {
    return `<li class="box ${stock.Symbol}">
      <h2>${stock.Symbol} (${stock.Name})</h2>   
      <div>
        ${round(stock.LastTradePriceOnly)}     
        <button class="change-button ${redOrGreen(Number(stock.PercentChange.substr(0, stock.PercentChange.length - 1)))}">
          ${stock.PercentChange} 
        </button>     
        <div class="box-arrow" data-symbol="${stock.Symbol}">       
          <button class="icon-arrow up-button" ${upDisabled}></button>
          <button class="icon-arrow down-button" ${downDisabled}></button>
        </div>
      </div>
    </li>`;
  }

  loadHeader();
  loadStocks();

  setHandler('body', stockHandle);
}(stocks, stocksToShow));

function swapStocks(stockIndex, newPosition) {
  let tempStock = stocks[stockIndex];
  stocks[stockIndex] = stocks[stockIndex + newPosition];
  stocks[stockIndex + newPosition] = tempStock;
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
  firstSwapStockLiElement.classList.remove(stocks[stockIndex].Symbol);
  secondSwapStockLiElement.classList.remove(stocks[stockIndex + newPosition].Symbol);
  firstSwapStockLiElement.classList.add(stocks[stockIndex + newPosition].Symbol);
  secondSwapStockLiElement.classList.add(stocks[stockIndex].Symbol);
}

function upDownHandler(buttonElement) {
  let newPosition = (buttonElement.classList.contains('up-button')) ? -1 : 1;

  let symbol = buttonElement.parentElement.getAttribute('data-symbol');

  let stockIndex = 0;
  stocks.find((stock, index) => {
    stockIndex = index;
    return stock.Symbol === symbol
  });

  let firstSwapStockLiElement = document.querySelector('.' + stocks[stockIndex].Symbol);
  let secondSwapStockLiElement = document.querySelector('.' + stocks[stockIndex + newPosition].Symbol);

  swapLiStockClass(firstSwapStockLiElement, stockIndex, secondSwapStockLiElement, newPosition);

  swapLiButtonsDisabledValue(firstSwapStockLiElement, secondSwapStockLiElement);

  swapInnerHTML(firstSwapStockLiElement, secondSwapStockLiElement);
  swapStocks(stockIndex, newPosition);
}

function hideShowReorderControls(liElement) {
  let divElement = liElement.querySelector('.box-arrow');

  if (divElement.classList.contains('box-arrow-hidden')) {
    divElement.classList.remove('box-arrow-hidden');
  } else {
    divElement.classList.add('box-arrow-hidden');
  }
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

  headerElement.classList.add('div-filter');

  headerElement.innerHTML = `
    <div>
        <div>
          <label for="name" class="capitalize">by name</label>
          <input type="text" id="name">
        </div>
        <div>
          <label for="gain" class="capitalize">by gain</label>
          <select id="gain">
            <option value="" class="capitalize"></option>
            <option value="all" class="capitalize">all</option>
            <option value="losing" class="capitalize">losing</option>
            <option value="gaining" class="capitalize">gaining</option>
          </select>
        </div>
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

function filterByName(name) {
  name = name.toLowerCase();
  document.querySelectorAll('.stocks li').forEach(function (stockLiElement) {
    if (!stockLiElement.firstElementChild.textContent.toLowerCase().includes(name)) {
      stockLiElement.classList.add('hide-stocks');
    }
  })
}

function applyButtonHandler() {
  document.querySelectorAll('.stocks li').forEach(resetFilter);
  filterByName(document.getElementById('name').value);
  // filterByGain(document.getElementById('gain'));
  // filterByRange(document.getElementById('range-from'));
}

function changeButtonHandler(){
  changePreferences.preferredNumber = (changePreferences.preferredNumber+1) % changePreferences.length;
  let newPreference = changePreferences[changePreferences.preferredNumber];

  let buttonElements = document.querySelectorAll('.change-button');
  buttonElements.forEach((buttonElement, index) =>
    buttonElement.innerText = newPreference === 'Change' ? round(stocks[index][newPreference]) : stocks[index][newPreference]);
}

function stockHandle(ev) {
  if (ev.target.classList.contains('icon-arrow')) {
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
