const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  setToken(token) {
    localStorage.setItem("authToken", token);
  }

  removeToken() {
    localStorage.removeItem("authToken");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.credentials = "include";

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async register(userData) {
    const response = await this.request("/user/api/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: userData.name,
        userName: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password
      }),
    });

    if (response.details) {
      return { user: response.details };
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request("/user/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    return response;
  }

  async getCurrentUser() {
    const response = await this.request("/user/api/me", {
      method: "GET",
    });
    return response.user;
  }

  async getRooms() {
    const response = await this.request("/user/api/rooms", {
      method: "GET",
    });
    return response.details;
  }

  async getRoomDetails(roomId) {
    const response = await this.request(`/user/api/room/${roomId}`, {
      method: "GET",
    });
    return response.details;
  }

  async getRoomMembers(roomId) {
    const response = await this.request(`/user/api/room/${roomId}/members`, {
      method: "GET",
    });
    return response.details;
  }

  async createRoom(roomData) {
    const response = await this.request("/user/api/create/room", {
      method: "POST",
      body: JSON.stringify(roomData),
    });
    return response.details;
  }

  async joinRoom(roomId) {
    const response = await this.request("/user/api/join/room", {
      method: "POST",
      body: JSON.stringify({ room_id: roomId }),
    });
    return response.details;
  }

  async getRoomProjects(roomId) {
    const response = await this.request(`/user/api/room/${roomId}/projects`, {
      method: "GET",
    });
    return response.details;
  }

  async getProjectDetails(projectId) {
    const response = await this.request(`/user/api/project/${projectId}`, {
      method: "GET",
    });
    return response.details;
  }

  async createProject(projectData) {
    const response = await this.request("/user/api/create/project", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
    return response.details;
  }

  async appendTask(taskData) {
    const response = await this.request("/user/api/append/task", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    return response.details;
  }

  async updateTaskStatus(projectId, taskId, status) {
    const response = await this.request(`/user/api/project/${projectId}/task/${taskId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return response.details;
  }
}

export default new ApiService();
