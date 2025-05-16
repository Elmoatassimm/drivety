import { User } from "@prisma/client";
import { Request } from "express";

// Auth types
export type TUserData = User;

export interface TAuthToken {
  accessToken: string;
  refreshToken: string;
}

export type RequestWithUser = Request & {
  user?: {
    id: string;
    userId?: string;
    email: string;
    username?: string;
    role?: string;
  }
};

// Pagination types
export type TPagination = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

// Query parameters type
export type TFindInput = {
  page: number;  // Defaults to 1
  limit: number; // Defaults to 10
  search: string;
  sortBy: string; // Sorting field
  order: "asc" | "desc"; // Sorting order
  skip: number;
};
