import { FileOrFolder } from "@/app/api/list_files/route";
import axios from "axios";
import { SITE_URL } from "../constants";

const apiClient = axios.create({
  baseURL: `${SITE_URL}/api`, // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const getListFiles = async (folder: string) => {
  try {
    const response = await apiClient.get<{
      total: number;
      data: FileOrFolder[];
    }>("/list_files", {
      params: {
        folder,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

export const postFolder = async (folder: string) => {
  try {
    const response = await apiClient.post<{
      total: number;
      data: FileOrFolder[];
    }>("/folder", {
      folder,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const file_collection = () => {
  return {
    async get(path: string) {
      try {
        const response = await apiClient.get<{
          total: number;
          data: Extract<FileOrFolder, { type: "file" }>[];
        }>(`/files/${path}`);
        return response.data.data[0];
      } catch (error) {
        console.error("Error get file:", error);
        throw error;
      }
    },
    async list(folder: string) {
      try {
        const response = await apiClient.get<{
          total: number;
          data: FileOrFolder[];
        }>(`/files/${folder}`);
        return response.data;
      } catch (error) {
        console.error("Error listing files:", error);
        throw error;
      }
    },
    async del(folder: string) {
      try {
        const response = await apiClient.delete(`/files/${folder}`);
        return response.data;
      } catch (error) {
        console.error("Error listing files:", error);
        throw error;
      }
    },
  };
};

// You can add more API methods here in the future
