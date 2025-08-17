const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form #get-exchange-rate");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swap = document.querySelector("#swap");

// for (let c in countryList) {
//     console.log(c, countryList[c]);
// }

// Populate dropdowns with currency codes.
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        // assigning default values to the dropdown
        if (select.name === "from" && currCode === "USD") newOption.selected = "selected";
        if (select.name === "to" && currCode === "INR") newOption.selected = "selected";
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => updateFlag(evt.target));
}


/**
 * Fetches exchange rate from the API.
 * @param {string} from - The currency code to convert from.
 * @param {string} to - The currency code to convert to.
 * @returns {Promise<number>} - A promise that resolves with the exchange rate.
 */
async function fetchExchangeRate(from, to) {
    const url = `${BASE_URL}/${from.toLowerCase()}.json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch exchange rates. Status: ${response.status}`);
    }
    const data = await response.json();
    const rate = data[from.toLowerCase()][to.toLowerCase()];
    return rate;
}

/**
 * Updates the exchange rate display.
 */
async function updateExchangeRate() {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = 1;
    }

    try {
        msg.innerText = "Getting exchange rate...";
        const rate = await fetchExchangeRate(fromCurr.value, toCurr.value);
        const finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Failed to fetch rates. Please try again later.";
        console.error("Error fetching exchange rate:", err);
    }
}

/**
 * Updates the flag image for a given select element.
 * @param {HTMLSelectElement} ele - The select element that was changed.
 */
const updateFlag = (ele) => {
    const currCode = ele.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = ele.parentElement.querySelector("img");
    img.src = newSrc;
}

// Initial update on page load
window.addEventListener("load", updateExchangeRate);

// Add event listener to the button
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Add event listener to the swap button
swap.addEventListener("click", (evt) => {
    evt.preventDefault();
    const temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr); // update flag for "from"
    updateFlag(toCurr);   // update flag for "to"
    updateExchangeRate();
});