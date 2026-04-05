(function () {
  const display = document.getElementById('current');
  const expr = document.getElementById('expression');

  let current = '0';
  let previous = '';
  let operator = '';
  let shouldReset = false;

  function updateDisplay() {
    display.textContent = current;
    const opSymbol = { '/': '\u00F7', '*': '\u00D7', '-': '\u2212', '+': '+' };
    expr.textContent = previous && operator
      ? previous + ' ' + (opSymbol[operator] || operator) + ' '
      : '';
  }

  function inputNumber(val) {
    if (shouldReset) {
      current = val;
      shouldReset = false;
    } else if (current === '0' && val !== '.') {
      current = val;
    } else {
      if (current.length >= 15) return;
      current += val;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldReset) {
      current = '0.';
      shouldReset = false;
      updateDisplay();
      return;
    }
    if (!current.includes('.')) {
      current += '.';
      updateDisplay();
    }
  }

  function inputOperator(op) {
    if (operator && !shouldReset) {
      calculate();
    }
    previous = current;
    operator = op;
    shouldReset = true;
    updateDisplay();
  }

  function calculate() {
    if (!operator || !previous) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b === 0 ? 'Error' : a / b; break;
      default: return;
    }

    if (result === 'Error') {
      current = 'Error';
    } else {
      const rounded = parseFloat(result.toPrecision(12));
      current = String(rounded);
    }

    previous = '';
    operator = '';
    shouldReset = true;
    updateDisplay();
  }

  function clear() {
    current = '0';
    previous = '';
    operator = '';
    shouldReset = false;
    updateDisplay();
  }

  function backspace() {
    if (shouldReset || current === 'Error') {
      clear();
      return;
    }
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }

  function percent() {
    current = String(parseFloat(current) / 100);
    updateDisplay();
  }

  document.querySelector('.buttons').addEventListener('click', function (e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    switch (action) {
      case 'number': inputNumber(value); break;
      case 'decimal': inputDecimal(); break;
      case 'operator': inputOperator(value); break;
      case 'equals': calculate(); break;
      case 'clear': clear(); break;
      case 'backspace': backspace(); break;
      case 'percent': percent(); break;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('+');
    else if (e.key === '-') inputOperator('-');
    else if (e.key === '*') inputOperator('*');
    else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape') clear();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === '%') percent();
  });

  updateDisplay();
})();
