import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

const TaskBoard = ({ tasks, users, currentUser, onStatusChange }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'Done': return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
            case 'Pending': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return <Circle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-50 border-green-100 text-green-700';
            case 'Done': return 'bg-blue-50 border-blue-100 text-blue-700';
            case 'Pending': return 'bg-amber-50 border-amber-100 text-amber-700';
            default: return 'bg-gray-50 border-gray-100 text-gray-700';
        }
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Unknown';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-600" />
                Tasks
            </h2>

            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.id} className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}>
                                {getStatusIcon(task.status)}
                                {task.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Assigned to: <span className="text-gray-600 font-medium">{getUserName(task.assignedTo)}</span></span>
                            {task.assignedTo === currentUser.id && (
                                <button className="text-indigo-600 hover:text-indigo-800 font-medium">Update Status</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
