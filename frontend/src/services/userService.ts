import { User, UserFormData } from '@/types/User';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class UserService {
  static async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users. Please try again later.');
    }
  }

  static async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user. Please try again later.');
    }
  }

  static async createUser(userData: UserFormData): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          website: userData.website,
          company: {
            name: userData.company,
            catchPhrase: '',
            bs: '',
          },
          address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
              lat: '',
              lng: '',
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user. Please try again later.');
    }
  }

  static async updateUser(id: number, userData: UserFormData): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          website: userData.website,
          company: {
            name: userData.company,
            catchPhrase: '',
            bs: '',
          },
          address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
              lat: '',
              lng: '',
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user. Please try again later.');
    }
  }

  static async deleteUser(id: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  }
}