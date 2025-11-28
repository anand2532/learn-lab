/**
 * API Client for Learn Lab Backend
 * Handles all API communication with the backend services
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.4.1:8080/api/v1';

export interface ApiError {
  message: string;
  code?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: {
        id: string;
        email: string;
        name: string;
        created_at: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser() {
    return this.request<{
      user: {
        id: string;
        email: string;
        name: string;
        created_at: string;
      };
    }>('/auth/me');
  }

  async refreshToken() {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.request<{
        access_token: string;
        expires_in: number;
      }>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      localStorage.setItem('access_token', response.access_token);
      return response;
    }
  }

  // Course endpoints
  async getCourses(page: number = 1, pageSize: number = 10) {
    return this.request(`/courses?page=${page}&page_size=${pageSize}`);
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(title: string, description: string, slug: string) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify({ title, description, slug }),
    });
  }

  async updateCourse(id: string, title?: string, description?: string) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // AI endpoints
  async getHelp(question: string, context?: string) {
    const user = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    
    return this.request('/ai/help', {
      method: 'POST',
      body: JSON.stringify({
        question,
        context,
        user_id: user?.id || '',
      }),
    });
  }

  async analyzeCode(code: string, language: string) {
    const user = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    
    return this.request('/ai/analyze-code', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        user_id: user?.id || '',
      }),
    });
  }

  // Executor endpoints
  async executeCode(
    code: string,
    language: string,
    timeoutSeconds: number = 10,
    memoryLimitMB: number = 128
  ) {
    const user = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    
    return this.request('/execute', {
      method: 'POST',
      body: JSON.stringify({
        code,
        language,
        user_id: user?.id || '',
        timeout_seconds: timeoutSeconds,
        memory_limit_mb: memoryLimitMB,
      }),
    });
  }

  // Progress endpoints
  async updateProgress(
    courseId: string,
    topicId?: string,
    subtopicId?: string,
    completed?: boolean,
    progressPercentage?: number
  ) {
    const user = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user?.id || '',
        course_id: courseId,
        topic_id: topicId,
        subtopic_id: subtopicId,
        completed,
        progress_percentage: progressPercentage,
      }),
    });
  }

  async getProgress(courseId?: string) {
    const user = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;
    
    const params = courseId ? `?course_id=${courseId}` : '';
    return this.request(`/progress${params}`);
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export class for custom instances
export default ApiClient;

