import React from 'react';
import { Users, Crown } from 'lucide-react';

const RoomView = ({ room, users, currentUser }) => {
  if (!room) return <div>Loading Room...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-sm text-gray-500">Room ID: {room.id}</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
          <Users className="w-4 h-4 text-indigo-600" />
          <span className="text-indigo-700 font-medium">{users.length} Users</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-100 transition-colors">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-100" />
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="font-medium text-gray-700">{user.name}</p>
                {room.adminId === user.id && <Crown className="w-3 h-3 text-amber-500" />}
              </div>
              <p className="text-xs text-gray-400">{user.id === currentUser.id ? '(You)' : user.isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomView;
