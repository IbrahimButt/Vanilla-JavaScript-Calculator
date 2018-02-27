/* global
numeral
:true */
/* eslint no-undef: "error" */
/* eslint no-use-before-define: 0 */

// (\d*,)*(\d*)(\.\d+)*$
// console.clear();
const inputDiv = document.getElementById('input');
const historyDiv = document.getElementById('history');

const view = {
  isDigit(value) {
    if (utility.isStateFresh() && (value === '0' || value === '00' || value === '.')) {
      return false;
    } else if (utility.doesInputIncludeDecimal() && value === '.') {
      return false;
    } else if (utility.isLastInputOperator()) {
      inputDiv.innerText = value;
      historyDiv.innerText += value;
    } else if (Number(value) && inputDiv.innerText === '0') {
      inputDiv.innerText = value;
      historyDiv.innerText = value;
    } else {
      // Add digit to input
      // Format input
      inputDiv.innerText = numeral(inputDiv.innerText + value).format();
      // If operator already present
      // Means, input and history shoudlnt be identical
      // Therefore, need to remove last input from history, add new formatted total input
      if (utility.isOrInludesOperator(historyDiv.innerText)) {
        utility.removeLastInputsFromHistoryTillOperator();
        historyDiv.innerText += inputDiv.innerText;
      } else {
        historyDiv.innerText = inputDiv.innerText;
      }
    }
    return true;
  },
  isOperator(value) {
    if (utility.isStateFresh()) {
      return false;
    } else if (utility.isLastInputOperator()) {
      historyDiv.innerText = historyDiv.innerText.slice(0, -1);
    }
    historyDiv.innerText += value;
    return true;
  },
  clearAll() {
    inputDiv.innerText = '0';
    historyDiv.innerText = '';
  },
};

const utility = {
  isInputNumberOrDecimal(value) {
    return Number(value) || value === '.' || value === '0' || value === '00';
  },
  isOrInludesOperator(value) {
    return !!value.match(/[+×−÷]/);
  },
  isLastInputOperator() {
    return !!historyDiv.innerText.match(/[+×−÷]$/);
  },
  isStateFresh() {
    return (inputDiv.innerText === '0' && historyDiv.innerText === '');
  },
  removeLastInputsFromHistoryTillOperator() {
    for (let i = historyDiv.innerText.length; !utility.isLastInputOperator(); i -= 1) {
      historyDiv.innerText = historyDiv.innerText.slice(0, -1);
    }
  },
  doesInputIncludeDecimal() {
    return inputDiv.innerText.includes('.');
  },
};

document.getElementById('calculator__bottom').addEventListener('click', (e) => {
  const value = e.target.innerText;
  // console.log(utility.isOperator(value));
  if (utility.isInputNumberOrDecimal(value)) {
    view.isDigit(value);
  } else if (utility.isOrInludesOperator(value)) {
    view.isOperator(value);
  } else if (value === 'C') {
    view.clearAll();
  }
});
