export interface NonceResponse {
  nonce: string;
  message: string;
}

export interface VerifyResponse {
  accessToken: string;
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