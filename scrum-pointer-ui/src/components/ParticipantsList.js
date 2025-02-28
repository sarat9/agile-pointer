import React from 'react';
import UserCard from './UserCard';

const ParticipantsList = ({ users, isPointsRevealed, revealPoints, hidePoints, restartPointing }) => {
  return (
    <div className="mt-8 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-4">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={revealPoints}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Reveal Points
        </button>
        <button
          onClick={hidePoints}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Hide Points
        </button>
        <button
          onClick={restartPointing}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
        >
          Restart 
        </button>
      </div>

      <h2 className="text-xl font-bold text-center mb-6 text-blue-800">Participants</h2>

      <div className="w-full">
        {users && users.map((user) => (
          <UserCard
            key={user.userId}
            name={user.name}
            points={user.points}
            isPointsRevealed={isPointsRevealed}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
