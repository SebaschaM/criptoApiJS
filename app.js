const criptomonedaSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const form = document.querySelector("#formulario");
const form_group = document.querySelector("#form_group");
const result = document.querySelector("#resultado");

const searchObj = {
  currency: "",
  cryptocurrency: "",
};

const getCryptocurrencies = (cryptocurrencies) =>
  new Promise((resolve) => {
    resolve(cryptocurrencies);
  });

document.addEventListener("DOMContentLoaded", () => {
  getTopCryptocurrencies();

  form.addEventListener("submit", submitForm);

  criptomonedaSelect.addEventListener("change", readValue);
  monedaSelect.addEventListener("change", readValue);
});

async function getTopCryptocurrencies() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  try {
    const response = await fetch(url);
    const resultData = await response.json();
    const cryptocurrencies = await getCryptocurrencies(resultData.Data);
    selectCryptocurrencies(cryptocurrencies);
  } catch (error) {
    console.log(error);
  }
}

function selectCryptocurrencies(cryptocurrencies) {
  cryptocurrencies.forEach((crypto) => {
    const { FullName, Name } = crypto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedaSelect.appendChild(option);
  });
}

function readValue(e) {
  searchObj[e.target.name] = e.target.value;
  //console.log(searchObj);
}

function submitForm(e) {
  e.preventDefault();

  // Validation
  const { currency, cryptocurrency } = searchObj;

  if (currency === "" || cryptocurrency === "") {
    console.log("Both fields are mandatory");
    return;
  }

  const spinner = document.querySelector("#spinner");
  spinner.style.display = "flex";
  form_group.style.display = "none";
  setTimeout(() => {
    showSpinner();
    setTimeout(() => {
      spinner.style.display = "none";
      getAPIdata();
    }, 1000);
  }, 1000);
}

async function getAPIdata() {
  const { currency, cryptocurrency } = searchObj;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;

  try {
    const response = await fetch(url);
    const quotationData = await response.json();
    showQuotation(quotationData.DISPLAY[cryptocurrency][currency]);
    console.log(quotationData.DISPLAY[cryptocurrency][currency]);
  } catch (error) {
    console.log(error);
  }
}

function showQuotation(quotation) {
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quotation;

  const result = document.querySelector("#resultado");
  result.style.display = "flex";

  const form = document.querySelector("#form_group");
  form.style.display = "none";

  const infoDiv = document.createElement("div");
  infoDiv.classList.add("information_cot_container");

  const title = document.createElement("h2");
  title.classList.add("form_tittle");
  title.innerHTML = "QUOTATION";

  const priceInfo = document.createElement("p");
  priceInfo.classList.add("information_cot");
  priceInfo.innerHTML = `The price is: <span>${PRICE}</span>`;

  const highPriceInfo = document.createElement("p");
  highPriceInfo.classList.add("information_cot");
  highPriceInfo.innerHTML = `Highest price of the day: <span>${HIGHDAY}</span>`;

  const lowPriceInfo = document.createElement("p");
  lowPriceInfo.classList.add("information_cot");
  lowPriceInfo.innerHTML = `Lowest price of the day: <span>${LOWDAY}</span>`;

  const last24HourChangeInfo = document.createElement("p");
  last24HourChangeInfo.classList.add("information_cot");
  last24HourChangeInfo.innerHTML = `Last 24 hours variation: <span>${CHANGEPCT24HOUR}%</span>`;

  const lastUpdateInfo = document.createElement("p");
  lastUpdateInfo.classList.add("information_cot");
  lastUpdateInfo.innerHTML = `Last update: <span>${LASTUPDATE}</span>`;

  const backBtn = document.createElement("a");
  backBtn.classList.add("back_btn");
  backBtn.innerHTML = "Go back";
  backBtn.href = "index.html";

  result.appendChild(title);
  infoDiv.appendChild(priceInfo);
  infoDiv.appendChild(highPriceInfo);
  infoDiv.appendChild(lowPriceInfo);
  infoDiv.appendChild(last24HourChangeInfo);
  infoDiv.appendChild(lastUpdateInfo);
  result.appendChild(infoDiv);
  result.appendChild(backBtn);
}

function showSpinner() {
  const spinner = document.querySelector("#spinner");
  spinner.style.display = "flex";
}
