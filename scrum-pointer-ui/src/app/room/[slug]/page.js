"use client";

import { use, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import PointSelection from './../../../components/PointSelection';
import ParticipantsList from './../../../components/ParticipantsList';

export default function Room({ params }) {
  const roomId = use(params).slug;
  const [users, setUsers] = useState([]);
  const [isPointsRevealed, setIsPointsRevealed] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    userId: '',
    name: '',
    joined: false,
    myPoints: null,
  });

  const socketRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!roomId) return;
    const savedUser = JSON.parse(localStorage.getItem(`poker-user-${roomId}`));
    if (savedUser) setCurrentUser({...savedUser});

    if (!socketRef.current) socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    socket.on('connect', () => console.log('✅ Connected:', socket.id));
    socket.on('disconnect', (reason) => console.log(`❌ Disconnected: ${reason}`));

    socket.on('joined-room', ({ userId }) => {
      setCurrentUser((prev) => {
        const updatedUser = { ...prev, userId, joined: true };
        localStorage.setItem(`poker-user-${roomId}`, JSON.stringify(updatedUser));
        return updatedUser;
      });
    });

    socket.on('user-joined', (updatedUsers) => setUsers(updatedUsers.users));
    socket.on('points-updated', ({ userId, points }) =>
      setUsers((prevUsers) => prevUsers.map((user) => (user.userId === userId ? { ...user, points } : user)))
    );

    socket.on('points-revealed', (updatedUsers) => {
      setIsPointsRevealed(true);
      setUsers(updatedUsers.users);
    });

    socket.on('points-hidden', (updatedUsers) => {
      setIsPointsRevealed(false);
      setUsers(updatedUsers.users);
    });

    socket.on('users-reloaded', ({ users, isPointsRevealed }) => {
      setUsers(users);
      setIsPointsRevealed(isPointsRevealed);
    });

    socket.on('points-restarted', ({ users, isPointsRevealed }) => {
      setUsers(users);
      setIsPointsRevealed(isPointsRevealed);
      setCurrentUser((prev) => {
        const updatedUser = { ...prev, myPoints: null };
        localStorage.setItem(`poker-user-${roomId}`, JSON.stringify(updatedUser));
        return updatedUser;
      });
    });

    if (savedUser) {
      setTimeout(() => {
        socket.emit('reload-users', { roomId, userId: savedUser.userId, userName: savedUser.name });
      }, 500);
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId]);

  const joinRoom = () => {
    if (!currentUser.name || !socketRef.current) return;
    const updatedUser = { ...currentUser, joined: true };
    setCurrentUser(updatedUser);
    localStorage.setItem(`poker-user-${roomId}`, JSON.stringify(updatedUser));

    socketRef.current.emit('join-room', {
      roomId,
      userName: currentUser.name,
      userId: currentUser.userId,
    });
  };

  const selectPoints = (points) => {
    const updatedUser = { ...currentUser, myPoints: points };
    setCurrentUser(updatedUser);
    localStorage.setItem(`poker-user-${roomId}`, JSON.stringify(updatedUser));

    socketRef.current.emit('select-points', {
      userId: currentUser.userId,
      roomId,
      points,
    });
  };

  const restartPointing = () => {
    socketRef.current.emit('restart-pointing', {
      userId: currentUser.userId,
      roomId
    });
  };

  const revealPoints = () => socketRef.current.emit('reveal-points', { roomId });
  const hidePoints = () => socketRef.current.emit('hide-points', { roomId });

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 p-6">
      {!currentUser.name || !currentUser.joined ? (
        <div className="text-center bg-gradient-to-r from-gray-50 to-gray-200 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Enter Your Name!</h1>
          <p className="text-lg text-gray-600 mb-4">Lets estimate our stories</p>
          <input
            type="text"
            className="mt-4 p-4 w-full border border-gray-300 rounded-lg text-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Type your name here..."
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, name: e.target.value }))}
          />
          <button
            onClick={joinRoom}
            className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 w-full"
          >
            🚀 Go to Room!
          </button>
          
        </div>
      ) : (
        <>
          <PointSelection selectPoints={selectPoints} selectedPoints={currentUser.myPoints} />

          <div className="w-full max-w-lg text-center mt-8">
            <ParticipantsList
              users={users}
              isPointsRevealed={isPointsRevealed}
              revealPoints={revealPoints}
              hidePoints={hidePoints} 
              restartPointing={restartPointing}
            />
          </div>
        </>
      )}
    </div>
  );
}
