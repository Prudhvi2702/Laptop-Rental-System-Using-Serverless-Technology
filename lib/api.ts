// API utility functions for interacting with the backend

// Types
interface UserData {
  username: string;
  password: string;
  email: string;
}

interface LaptopData {
  laptop_id?: string;
  brand: string;
  model: string;
  price_per_day: number;
  available?: boolean;
}

interface RentalData {
  laptop_id: string;
  user_id: string;
  rental_days: number;
}

interface PaymentData {
  user_id: string; // Added to match Lambda expectations
  rental_id: string;
  amount: number;
  payment_method: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  payment_id?: string; // Updated to match Lambda response
}

interface RentalResponse {
  rental_id: string;
  status: string;
}

/**
 * Base URL for the API
 */
const BASE_URL = "https://uijoj390ad.execute-api.us-east-1.amazonaws.com/prod";

/**
 * Helper function to handle API responses
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json() as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data as T;
};

/**
 * Register a new user
 */
export const registerUser = async (userData: UserData): Promise<ApiResponse<any>> => {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

/**
 * Confirm a user's registration
 */
export const confirmUser = async (username: string, confirmationCode: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`${BASE_URL}/users/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      confirmation_code: confirmationCode,
    }),
  });

  return handleResponse(response);
};

/**
 * Login a user
 */
export const loginUser = async (username: string, password: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  return handleResponse(response);
};

/**
 * Get available laptops
 */
export const getAvailableLaptops = async (token: string): Promise<ApiResponse<LaptopData[]>> => {
  const response = await fetch(`${BASE_URL}/laptops/available`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

/**
 * Add a new laptop
 */
export const addLaptop = async (laptopData: LaptopData, token: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`${BASE_URL}/laptops/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(laptopData),
  });

  return handleResponse(response);
};

/**
 * Update an existing laptop
 */
export const updateLaptop = async (laptopData: LaptopData, token: string): Promise<ApiResponse<any>> => {
  const response = await fetch(`${BASE_URL}/laptops/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(laptopData),
  });

  return handleResponse(response);
};

/**
 * Create a new rental
 */
export const createRental = async (rentalData: RentalData, token: string): Promise<ApiResponse<RentalResponse>> => {
  try {
    const response = await fetch(`${BASE_URL}/rentals/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rentalData),
    });

    if (!response.ok) {
      const errorData = await response.json() as ApiResponse<any>;
      throw new Error(errorData.error || "Failed to create rental");
    }

    return await response.json() as ApiResponse<RentalResponse>;
  } catch (error) {
    console.error("Error creating rental:", error);
    throw error;
  }
};

/**
 * Process a payment
 */
export const processPayment = async (paymentData: PaymentData, token: string): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_URL}/payments/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};