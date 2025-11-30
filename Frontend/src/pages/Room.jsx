import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import apiService from '../services/api.service';
import CreateTaskForm from '../components/CreateTaskForm';
import CreateProjectModal from '../components/CreateProjectModal';
import './Room.css';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchRoomData();
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const [roomData, projectsData, membersData] = await Promise.all([
        apiService.getRoomDetails(roomId),
        apiService.getRoomProjects(roomId),
        apiService.getRoomMembers(roomId)
      ]);
      
      setRoom(roomData);
      setProjects(projectsData);
      setMembers(membersData);
      
      if (projectsData.length > 0) {
        setSelectedProject(projectsData[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch room data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await apiService.createProject({
        ...projectData,
        room_id: roomId,
      });
      setProjects([...projects, newProject]);
      setSelectedProject(newProject._id);
      setShowCreateProject(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      if (!selectedProject) {
        throw new Error('Please create a project first');
      }
      
      const updatedProject = await apiService.appendTask({
        ...taskData,
        project_id: selectedProject,
      });
      
      setProjects(projects.map(p => 
        p._id === selectedProject ? updatedProject : p
      ));
      setShowCreateTask(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const handleStatusChange = async (projectId, taskId, newStatus) => {
    try {
      await apiService.updateTaskStatus(projectId, taskId, newStatus);
      
      setProjects(projects.map(p => {
        if (p._id === projectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => 
              t._id === taskId ? { ...t, status: newStatus } : t
            )
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleOpenChat = () => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return (
      <div className="room-loading">
        <div className="spinner"></div>
        <p>Loading room...</p>
      </div>
    );
  }

  const currentProject = projects.find(p => p._id === selectedProject);

  return (
    <div className="room-page">
      <div className="room-header">
        <div className="container">
          <div className="header-content">
            <div className="room-info">
              <button className="btn-back" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </button>
              <h1>{room?.name}</h1>
              <div className="room-meta">
                <span className="meta-badge">
                  👥 {members.length} members
                </span>
                <span className="meta-badge">
                  📁 {projects.length} projects
                </span>
              </div>
            </div>
            <div className="header-actions">
<div className="text-blue-600 font-semibold">
  Room ID: <span className="text-red-600 font-bold">{roomId}</span>
</div>

              <button className="btn btn-outline" onClick={handleOpenChat}>
                💬 Open Chat
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateProject(true)}
              >
                + New Project
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateTask(true)}
                disabled={projects.length === 0}
              >
                + New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="room-content container">
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No projects yet</h2>
            <p>Create a project to start organizing tasks</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateProject(true)}
            >
              Create First Project
            </button>
          </div>
        ) : (
          <>
            <div className="project-selector">
              <label>Select Project:</label>
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="project-select"
              >
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.projectName} ({project.tasks?.length || 0} tasks)
                  </option>
                ))}
              </select>
            </div>

            {currentProject && (
              <div className="tasks-container">
                <h2>{currentProject.projectName}</h2>
                <div className="tasks-grid">
                  {currentProject.tasks?.map((task) => (
                    <div key={task._id} className="task-card">
                      <div className="task-header">
                        <h3>{task.title}</h3>
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(currentProject._id, task._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      {task.description && <p className="task-description">{task.description}</p>}
                      <div className="task-meta">
                        {task.assigned_to && (
                          <span className="task-assignee">
                            👤 {task.assigned_to.fullName}
                          </span>
                        )}
                        {task.deadline && (
                          <span className="task-deadline">
                            📅 {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateTask && (
        <CreateTaskForm
          onClose={() => setShowCreateTask(false)}
          onCreate={handleCreateTask}
          roomMembers={members}
        />
      )}

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Room;
