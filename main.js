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
    }
  ];

const changePreferences = {
  0: "PercentChange",
  1: "Change",
  2: "thirdChange",
  preferredNumber: 0,
  length: 3
};

(function init(stocks) {
  function loadStocks() {
    const ulElement = document.querySelector('main > ul');
    ulElement.innerHTML = stocks.reduce(
      function (html, stock, index) {
        return html + addStock(stock, (index === 0 && 'disabled' ) || '', (index === (stocks.length - 1) && 'disabled' ) || '');
      }, '');
  }

  function addStock(stock, upDisabled, downDisabled) {
    return `<li class="box ${stock.Symbol}">
      <h2>${stock.Symbol} (${stock.Name}</h2>   
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

  function round(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
  }

  function redOrGreen(num) {
    return num >= 0 ? 'green-button' : 'red-button';
  }

  loadStocks();

  setHandler('.stocks', stockHandle);
  setHandler('.stocks', stockHandle);
}(stocks));

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

function changeHandler(){
  changePreferences.preferredNumber = (changePreferences.preferredNumber+1) % changePreferences.length;
  console.log(changePreferences.preferredNumber);
  let newPreference = changePreferences[changePreferences.preferredNumber];

  let buttonElements = document.querySelectorAll('.change-button');
  buttonElements.forEach((buttonElement, index) => buttonElement.innerText = stocks[index][newPreference]);
}

function stockHandle(ev) {
  if (ev.target.classList.contains('icon-arrow'))
    upDownHandler(ev.target);
  else if (ev.target.classList.contains('change-button'))
    changeHandler();
}

function setHandler(selector, handler) {
  document.querySelector(selector)
    .addEventListener('click', handler);
}
