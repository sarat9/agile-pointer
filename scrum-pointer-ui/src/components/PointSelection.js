import React from 'react';

const PointSelection = ({ selectPoints, selectedPoints }) => {
  return (
    <div className="text-center">
      <h2 className="text-xl text-blue-900 font-bold mb-3">🎯 Pick a Poker Card</h2>
      <div className="flex gap-3 justify-center">
        {[1, 2, 3, 5, 8, 13, 21, '?'].map((point) => (
          <button
            key={point}
            className={`p-6 text-black font-bold rounded-lg shadow-lg transition duration-200 ${
            (selectedPoints==point) ? 'text-white bg-blue-600 hover:bg-blue-900' : 'bg-slate-300 hover:bg-blue-400'
            }`}
            onClick={() => selectPoints(point)}
          >
            {point}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PointSelection;
