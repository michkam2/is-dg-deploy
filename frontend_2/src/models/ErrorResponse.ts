interface ErrorResponse {
  timestamp: string;
  status: string;
  message: string;
  errors: string[];
}

export type { ErrorResponse };
