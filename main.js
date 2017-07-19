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

// {
//   let t = function () {
//     function loadStocks(stocks) {
//     const ulElement = document.querySelector('main > ul');
//       ulElement.innerHTML = stocks.reduce(
//         function (html, stock, index) {
//           return html + addStock(stock, ulElement, index);
//     }, '');
//   }
//
//   function round(number) {
//     return Math.round(number * 100) / 100;
//   }
//
//   function redOrGreen(num) {
//     if (num >= 0) {
//       return 'green-button';
//     } else
//       return 'red-button';
//   }
//
//   function addStock(stock, index) {
//       return '<li position="'+index+'" class="box">' +
//       '   <h2>'+stock.Symbol+' ('+stock.Name+'</h2>' +
//       '   <div>' +
//       '     ' +round(stock.LastTradePriceOnly)+
//       '     <button class="change-button '+redOrGreen(Number(stock.PercentChange.substr(0, stock.PercentChange.length-1)))+'">'+stock.PercentChange+'</button>' +
//       '     <div class="box-arrow">' +
//       '       <span class="icon-arrow up-button"></span>' +
//       '       <span class="icon-arrow down-button"></span>' +
//       '     </div>' +
//       '   </div>' +
//       '</li>';
//   }
//
//   loadStocks(stocks);
//   }();
// }

(function init() {
  function loadStocks(stocks) {
    const ulElement = document.querySelector('main > ul');
    ulElement.innerHTML = stocks.reduce(
      function (html, stock, index) {
        return html + addStock(stock, ulElement, index);
      }, '');
  }

  function round(number) {
    return Math.round(number * 100) / 100;
  }

  function redOrGreen(num) {
    if (num >= 0) {
      return 'green-button';
    } else
      return 'red-button';
  }

  function addStock(stock, index) {
    return '<li position="'+index+'" class="box">' +
      '   <h2>'+stock.Symbol+' ('+stock.Name+'</h2>' +
      '   <div>' +
      '     ' +round(stock.LastTradePriceOnly)+
      '     <button class="change-button '+redOrGreen(Number(stock.PercentChange.substr(0, stock.PercentChange.length-1)))+'">'+stock.PercentChange+'</button>' +
      '     <div class="box-arrow">' +
      '       <span class="icon-arrow up-button"></span>' +
      '       <span class="icon-arrow down-button"></span>' +
      '     </div>' +
      '   </div>' +
      '</li>';
  }

  loadStocks(stocks);
}());
