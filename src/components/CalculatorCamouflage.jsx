import React, { useState, useRef, useEffect } from 'react';

export default function CalculatorCamouflage({ onExit }) {
  const [display, setDisplay] = useState('0');
  const pressTimer = useRef(null);

  useEffect(() => {
    document.body.classList.add('camouflage-mode');
    return () => {
      document.body.classList.remove('camouflage-mode');
    };
  }, []);

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      onExit();
    }, 2000); // 2 seconds long press to exit
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleNum = (num) => {
    setDisplay(display === '0' ? num : display + num);
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleOp = (op) => {
    setDisplay(display + ' ' + op + ' ');
  };

  const handleCalc = () => {
    try {
      if (display === '112') {
        onExit();
        return;
      }
      // Extremely basic evaluation for simple operations
      const safeEval = new Function('return ' + display.replace(/x/g, '*').replace(/÷/g, '/'));
      setDisplay(String(safeEval()));
    } catch {
      setDisplay('Error');
    }
  };

  const getFontSize = () => {
    const len = display.length;
    if (len <= 6) return '5rem';
    // Decrease by 0.35rem for every character over 6, max reduction to 1.8rem
    const size = 5 - ((len - 6) * 0.35);
    return `${Math.max(1.8, size)}rem`;
  };

  return (
    <div className="calculator-wrapper">
      <div
        className="calc-display"
        style={{ fontSize: getFontSize() }}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        {display}
      </div>
      <div className="calc-keypad">
        <button className="calc-btn op" onClick={display !== '0' ? handleBackspace : handleClear}>
          {display !== '0' ? '⌫' : 'AC'}
        </button>
        <button className="calc-btn op" onClick={() => handleOp('(')}>(</button>
        <button className="calc-btn op" onClick={() => handleOp(')')}>)</button>
        <button className="calc-btn op" onClick={() => handleOp('÷')}>÷</button>

        <button className="calc-btn num" onClick={() => handleNum('7')}>7</button>
        <button className="calc-btn num" onClick={() => handleNum('8')}>8</button>
        <button className="calc-btn num" onClick={() => handleNum('9')}>9</button>
        <button className="calc-btn op" onClick={() => handleOp('x')}>x</button>

        <button className="calc-btn num" onClick={() => handleNum('4')}>4</button>
        <button className="calc-btn num" onClick={() => handleNum('5')}>5</button>
        <button className="calc-btn num" onClick={() => handleNum('6')}>6</button>
        <button className="calc-btn op" onClick={() => handleOp('-')}>-</button>

        <button className="calc-btn num" onClick={() => handleNum('1')}>1</button>
        <button className="calc-btn num" onClick={() => handleNum('2')}>2</button>
        <button className="calc-btn num" onClick={() => handleNum('3')}>3</button>
        <button className="calc-btn op" onClick={() => handleOp('+')}>+</button>

        <button className="calc-btn num zero" onClick={() => handleNum('0')}>0</button>
        <button className="calc-btn num" onClick={() => handleNum('.')}>.</button>
        <button className="calc-btn equals" onClick={handleCalc}>=</button>
      </div>

      <style>{`
        body.camouflage-mode {
          background: #000;
          color: #fff;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .calculator-wrapper {
          background: #000;
          width: 100vw;
          max-width: 400px;
          height: 100dvh;
          max-height: 100dvh;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .calc-display {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 2rem;
          font-weight: 300;
          color: white;
          word-break: break-all;
          overflow: hidden;
          user-select: none;
        }

        .calc-keypad {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          padding: 20px;
          padding-bottom: 40px;
          flex-shrink: 0;
        }

        .calc-btn {
          border: none;
          outline: none;
          background: #333;
          color: white;
          font-size: 2rem;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: filter 0.2s;
          box-sizing: border-box;
          padding: 0;
        }
        
        @media (max-width: 400px) {
           .calc-btn {
             font-size: 1.5rem;
           }
        }

        .calc-btn:active {
          filter: brightness(1.5);
        }

        .calc-btn.op {
          background: #a5a5a5;
          color: black;
        }

        .calc-btn.op:last-child,
        .calc-btn:nth-child(4n),
        .calc-btn.equals {
          background: #ff9f0a;
          color: white;
        }

        .calc-btn.zero {
          grid-column: 1 / 3;
          aspect-ratio: auto;
          border-radius: 100px;
          padding-left: 30px;
          justify-content: flex-start;
        }
      `}</style>
    </div>
  );
}
