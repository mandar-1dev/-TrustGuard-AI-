import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { dbService } from '../services/dbService.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
}

export const authController = {
  async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await dbService.findUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists.'
        });
      }

      // Hash password securely with bcrypt
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user record
      const newUser = await dbService.createUser({
        name: validatedData.name,
        email: validatedData.email,
        password_hash
      });

      // Log event
      await dbService.logSecurityEvent({
        userId: newUser.id,
        eventType: 'LOGIN',
        description: 'Account registered and first login authenticated'
      });

      const token = generateToken(newUser);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.created_at
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user
      const user = await dbService.findUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      // Compare password hash
      const isMatch = await bcrypt.compare(validatedData.password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      // Log security event
      await dbService.logSecurityEvent({
        userId: user.id,
        eventType: 'LOGIN',
        description: 'Successful user authentication from web client'
      });

      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await dbService.findUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found.'
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      if (req.user?.id) {
        await dbService.logSecurityEvent({
          userId: req.user.id,
          eventType: 'LOGOUT',
          description: 'User initiated session sign out'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
};
