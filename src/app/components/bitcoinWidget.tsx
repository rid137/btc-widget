"use client"

import React, { useState, useEffect } from 'react';
import { fetchBitcoinPrice } from '../utils/fetchBitcoinPrice';

const BitcoinWidget: React.FC = () => {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [usdInput, setUsdInput] = useState<number | string>('');
  const [btcOutput, setBtcOutput] = useState<number | string>('--');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getBitcoinPrice = async () => {
      const price = await fetchBitcoinPrice();
      if (price) {
        setBtcPrice(price);
        setLastUpdated(new Date().toLocaleString());
      }
    };

    getBitcoinPrice();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) > 100000000) {
      setErrorMessage('Maximum value is $100,000,000');
      setBtcOutput('--');
    } else {
      setErrorMessage(null);
      setUsdInput(value);

      const usdValue = parseFloat(value);
      if (!isNaN(usdValue) && btcPrice) {
        setBtcOutput((usdValue / btcPrice).toFixed(8));
      } else {
        setBtcOutput('--');
      }
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 bg-white text-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Bitcoin Price Converter</h2>

      <div className="mb-6">
        <div className="text-lg mb-1">Current Price:</div>
        <div className="text-2xl font-bold">${btcPrice ?? '--'} USD</div>
        <div className="text-sm text-gray-500">Last Updated: {lastUpdated ?? '--'}</div>
      </div>

      <div className="mb-4">
        <label htmlFor="usd-input" className="block text-sm font-medium text-gray-700 mb-1">
          Enter USD amount:
        </label>
        <input
          type="number"
          id="usd-input"
          value={usdInput}
          onChange={handleInputChange}
          placeholder="Enter amount in USD"
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          max={100000000}
        />
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      </div>

      <div className="text-lg font-medium">
        <span>Converted BTC: </span>
        <span className="text-xl font-semibold">{btcOutput}</span>
      </div>
    </div>
  );
};

export default BitcoinWidget;
