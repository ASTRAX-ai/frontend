import { NonceResponse, VerifyResponse, AuthError } from '../types/auth';
import { PublicKey } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

const API_BASE_URL = 'https://astraxwallet.betheback.my.id/api/v1';

export class AuthService {
  private static nonceRequest: Promise<NonceResponse> | null = null;

  static async getNonce(publicKey: string): Promise<NonceResponse> {
    // If there's already a nonce request in progress, return that instead of making a new one
    if (this.nonceRequest) {
      return this.nonceRequest;
    }

    try {
      this.nonceRequest = fetch(`${API_BASE_URL}/auth/nonce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
  body: JSON.stringify({ publicKey }),
      }).then(async (response) => {
        if (!response.ok) {
          throw await response.json() as AuthError;
        }
        return response.json() as Promise<NonceResponse>;
      });

      const result = await this.nonceRequest;
      this.nonceRequest = null; // Clear the request after it's done
      return result;
    } catch (error) {
      this.nonceRequest = null; // Clear the request if it fails
      throw error;
    }
  }

  static async verifySignature(publicKey: string, signature: string): Promise<VerifyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          signature,
        }),
      });

      if (!response.ok) {
        throw await response.json() as AuthError;
      }

      return await response.json() as VerifyResponse;
    } catch (error) {
      throw error;
    }
  }

  static async logout(refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw await response.json() as AuthError;
      }
    } catch (error) {
      throw error;
    }
  }

  static async signMessage(wallet: WalletContextState, message: string): Promise<string> {
    try {
      if (!wallet.signMessage) {
        throw new Error("Wallet doesn't support message signing");
      }

      const messageBytes = new TextEncoder().encode(message);
      const signature = await wallet.signMessage(messageBytes);
      return Buffer.from(signature).toString('base64');
    } catch (error) {
      throw error;
    }
  }
}