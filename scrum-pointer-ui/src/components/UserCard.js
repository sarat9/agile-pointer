// components/UserCard.js
import React from 'react';
import './styles.css';

const UserCard = ({ name, points, isPointsRevealed }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="w-1/2 text-center">
        <p className="text-lg font-bold text-green">{name}</p>
      </div>

      <div className="w-1/2 flex justify-center m-1">
        <div className="relative w-12 h-16 perspective">
          <div className={`w-full h-full transform-style-3d transition-transform duration-700 ease-in-out ${
            isPointsRevealed ? 'rotate-y-180' : ''
          }`}>
            <div className="absolute w-full h-full bg-gray-800 text-white flex items-center justify-center rounded-lg shadow-lg transform rotate-y-0 backface-hidden border-2 border-white">
              <p className="text-4xl font-bold">❓</p>
            </div>

            <div className="absolute w-full h-full bg-blue-600 text-white flex items-center justify-center rounded-lg shadow-lg transform rotate-y-180 backface-hidden border-2 border-white">
              <p className="text-4xl font-bold">{points ?? '?'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
