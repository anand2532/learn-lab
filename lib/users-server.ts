"use server";

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  name: string;
}

const USERS_FILE = join(process.cwd(), "data", "users.json");

// Initialize users file with default user if it doesn't exist
function ensureUsersFile() {
  if (!existsSync(USERS_FILE)) {
    const defaultUsers: User[] = [
      {
        id: "1",
        email: "demo@example.com",
        password: "demo123",
        name: "Demo User",
      },
    ];
    // Ensure data directory exists
    const dataDir = join(process.cwd(), "data");
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf-8");
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  ensureUsersFile();
  try {
    const usersData = readFileSync(USERS_FILE, "utf-8");
    const users: User[] = JSON.parse(usersData);
    return users.find((user) => user.email === email) || null;
  } catch {
    return null;
  }
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  // In production, use bcrypt to compare hashed passwords
  return user.password === password;
}

export async function getAllUsers(): Promise<User[]> {
  ensureUsersFile();
  try {
    const usersData = readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(usersData);
  } catch {
    return [];
  }
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  ensureUsersFile();
  try {
    const users = await getAllUsers();
    const newUser: User = {
      ...user,
      id: String(users.length + 1),
    };
    users.push(newUser);
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

