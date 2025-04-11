// middleware/authorize.js
import jwt from 'jsonwebtoken';

export const authorizeSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'superAdmin') {
      return res.status(403).json({ msg: 'Access denied: Super admin only' });
    }
    next();
  };
  