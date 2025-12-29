import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, displayName } = req.body;

      // Validate input
      if (!email || !password || !displayName) {
        res.status(400).json({
          error: 'Email, password, and display name are required'
        });
        return;
      }

      // Check password strength
      if (password.length < 6) {
        res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
        return;
      }

      const { user, session, error } = await authService.register({
        email,
        password,
        displayName
      });

      if (error) {
        res.status(400).json({
          error: error.message || 'Registration failed'
        });
        return;
      }

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user?.id,
          email: user?.email,
          displayName: displayName
        },
        session
      });
    } catch (error) {
      console.error('Register controller error:', error);
      res.status(500).json({
        error: 'Internal server error during registration'
      });
    }
  }

  /**
   * POST /api/auth/login
   * Login with email and password
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required'
        });
        return;
      }

      const { user, session, error } = await authService.login({
        email,
        password
      });

      if (error) {
        res.status(401).json({
          error: 'Invalid credentials'
        });
        return;
      }

      // Get user profile
      const { profile } = await authService.getUserProfile(user!.id);

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user?.id,
          email: user?.email,
          displayName: profile?.display_name
        },
        session
      });
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        error: 'Internal server error during login'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout current user
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { error } = await authService.logout();

      if (error) {
        res.status(500).json({
          error: 'Logout failed'
        });
        return;
      }

      res.status(200).json({
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        error: 'Internal server error during logout'
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Not authenticated'
        });
        return;
      }

      const { profile, error } = await authService.getUserProfile(req.user.id);

      if (error) {
        res.status(500).json({
          error: 'Failed to fetch user profile'
        });
        return;
      }

      res.status(200).json({
        user: {
          id: req.user.id,
          email: req.user.email,
          ...profile
        }
      });
    } catch (error) {
      console.error('Get current user controller error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Not authenticated'
        });
        return;
      }

      const { display_name, bio, location, avatar_url } = req.body;

      const { profile, error } = await authService.updateProfile(req.user.id, {
        display_name,
        bio,
        location,
        avatar_url
      });

      if (error) {
        res.status(500).json({
          error: 'Failed to update profile'
        });
        return;
      }

      res.status(200).json({
        message: 'Profile updated successfully',
        profile
      });
    } catch (error) {
      console.error('Update profile controller error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   * Send password reset email
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          error: 'Email is required'
        });
        return;
      }

      const { error } = await authService.resetPassword(email);

      if (error) {
        res.status(500).json({
          error: 'Failed to send reset email'
        });
        return;
      }

      res.status(200).json({
        message: 'Password reset email sent'
      });
    } catch (error) {
      console.error('Reset password controller error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

export default new AuthController();
