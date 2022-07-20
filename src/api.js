const currenciesHandlers = new Map();

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${process.env.VUE_APP_API_KEY}`
);

const AGGREGATE_INDEX = "5";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice
  } = JSON.parse(e.data);

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = currenciesHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebsocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToCurrencyOnWs(currency) {
  const message = {
    action: "SubAdd",
    subs: [`5~CCCAGG~${currency}~USD`]
  };

  sendToWebsocket(message);
}

function unsubscribeFromCurrencyOnWs(currency) {
  const message = {
    action: "SubRemove",
    subs: [`5~CCCAGG~${currency}~USD`]
  };

  sendToWebsocket(message);
}

export const subscribeToCurrency = (currency, cb) => {
  const subscribers = currenciesHandlers.get(currency) || [];

  currenciesHandlers.set(currency, [...subscribers, cb]);

  subscribeToCurrencyOnWs(currency);
};

export const unsubscribeFromCurrency = (currency) => {
  currenciesHandlers.delete(currency);

  unsubscribeFromCurrencyOnWs(currency);
};
