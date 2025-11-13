import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthState } from '../types/auth';
import { AuthService } from '../services/auth';
import { useWallet } from '@solana/wallet-adapter-react';

interface AuthContextType extends AuthState {
  login: (publicKey: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  publicKey: null,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const wallet = useWallet();

  const login = useCallback(async (publicKey: string) => {
    try {
      // Get nonce
      console.log('[Auth] requesting nonce for', publicKey);
      const { message } = await AuthService.getNonce(publicKey);
      console.log('[Auth] nonce message received:', message);

      // Sign message
      const signature = await AuthService.signMessage(wallet, message);
      console.log('[Auth] signature produced (truncated):', signature?.slice?.(0, 16));

      // Verify signature
      console.log('[Auth] sending verify request');
      const response = await AuthService.verifySignature(publicKey, signature);
      
      // Get token from either 'token' or 'accessToken' field
      const accessToken = response.token || response.accessToken;
      const refreshToken = response.refreshToken;
      
      if (!accessToken) {
        throw new Error('No token received from verify response');
      }
      
      console.log('[Auth] verify succeeded, user.publicKey=', response.user?.publicKey);
      console.log('[Auth] token received (truncated):', accessToken?.slice?.(0, 16));

      // Update state
      setAuth({
        accessToken,
        refreshToken,
        publicKey: response.user.publicKey,
        isAuthenticated: true,
      });

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      throw error;
    }
  }, [wallet]);

  const logout = useCallback(async () => {
    try {
      if (auth.refreshToken) {
        await AuthService.logout(auth.refreshToken);
      }

      // Clear state and storage
      setAuth(initialState);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Disconnect wallet if connected
      if (wallet.connected && wallet.disconnect) {
        await wallet.disconnect();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, [auth.refreshToken, wallet]);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}