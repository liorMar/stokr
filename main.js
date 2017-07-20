const stocks =
  [
    {
      "Symbol": "WIX",
      "Name": "Wix.com Ltd.",
      "Change": "0.750000",
      "PercentChange": "+1.51%",
      "LastTradePriceOnly": "76.099998"
    },
    {
      "Symbol": "MSFT",
      "Name": "Microsoft Corporation",
      "PercentChange": "-2.09%",
      "Change": "-0.850006",
      "LastTradePriceOnly": "69.620003"
    },
    {
      "Symbol": "YHOO",
      "Name": "Yahoo! Inc.",
      "Change": "0.279999",
      "PercentChange": "+1.11%",
      "LastTradePriceOnly": "50.599998"
    }
  ];

(function init() {
  function loadStocks(stocks) {
    const ulElement = document.querySelector('main > ul');
    ulElement.innerHTML = stocks.reduce(
      function (html, stock, index) {
        return html + addStock(stock, (index === 0 && 'disabled' ) || '', (index === (stocks.length - 1) && 'disabled' ) || '');
      }, '');
  }

  function round(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
  }

  function redOrGreen(num) {
    return num >= 0 ? 'green-button' : 'red-button';
  }

  function addStock(stock, upDisabled, downDisabled) {
    return `<li class="box">
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

  loadStocks(stocks);

  setHandler('.up-button', stockHandle, -1);
  setHandler('.down-button', stockHandle, 1);

  function stockHandle(ev, newPosition) {
    let symbol = ev.target.parentElement.getAttribute('data-symbol');

    let stockIndex = 0;
    stocks.find((stock, index) => {stockIndex = index; return stock.Symbol === symbol});

    let tempStock = stocks[stockIndex];
    stocks[stockIndex] = stocks[stockIndex+newPosition];
    stocks[stockIndex+newPosition] = tempStock;

    //TODO instead of loadStocks do switch inner html!!!
    loadStocks(stocks);

    setHandler('.up-button', stockHandle, -1);
    setHandler('.down-button', stockHandle, 1);
  }

  function setHandler(selector, handler, handlerArgs) {
    document.querySelectorAll(selector)
      .forEach(function (li) {
        li.addEventListener('click', function (ev) {
          handler(ev, handlerArgs);
        });
      })
  }
}());
