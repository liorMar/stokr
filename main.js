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

function loadStocks(stocks) {
  const ulElement = document.querySelector('main > ul');
  stocks.forEach(function (stock) {
    addStock(stock, ulElement);
  });
}

function addStock(stock, ulElement) {
  const liElement = document.createElement('li');
  const h2Element = document.createElement('h2');
  h2Element.textContent = stock.Symbol + ' (' + stock.Name + ')';

  const divElement = document.createElement('div');
  divElement.appendChild(document.createTextNode(stock.LastTradePriceOnly));

  const buttonElement = document.createElement('button');
  buttonElement.textContent = stock.PercentChange;
  divElement.appendChild(buttonElement);

  const upButtonElement = document.createElement('button');
  upButtonElement.textContent = 'UP';
  divElement.appendChild(upButtonElement);

  const downButtonElement = document.createElement('button');
  downButtonElement.textContent = 'DOWN';
  divElement.appendChild(downButtonElement);

  liElement.appendChild(h2Element);
  liElement.appendChild(divElement);
  ulElement.appendChild(liElement);
}

//TODO export to init
loadStocks(stocks);
