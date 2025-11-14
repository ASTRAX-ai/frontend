export interface NonceResponse {
  nonce: string;
  message: string;
}

export interface VerifyResponse {
  token?: string;           // Actual API response uses 'token'
  accessToken?: string;     // Also support 'accessToken'
  refreshToken: string;
  user: {
    publicKey: string;
  };
}

export interface AuthError {
  message: string;
  statusCode: number;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  publicKey: string | null;
  isAuthenticated: boolean;
}