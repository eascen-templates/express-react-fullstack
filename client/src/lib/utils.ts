import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchWithAutoRefresh(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401) return response;

  const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (refreshResponse.ok) {
    return await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
    });
  }

  return response;
}

export const fetchApi = {
  get: (apiPath: string) => {
    return fetchWithAutoRefresh(apiPath, {
      method: "GET",
    });
  },

  post: (apiPath: string, body: any) => {
    return fetchWithAutoRefresh(apiPath, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },

  delete: (apiPath: string, body: any) => {
    return fetchWithAutoRefresh(apiPath, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },

  put: (apiPath: string, body: any) => {
    return fetchWithAutoRefresh(apiPath, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },

  patch: (apiPath: string, body: any) => {
    return fetchWithAutoRefresh(apiPath, {
      method: "PATCH",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  },
};
