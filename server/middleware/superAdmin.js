// middleware/authorize.js
import jwt from 'jsonwebtoken';

export const authorizeSuperAdmin = (req, res, next) => {
    if (req.user?.role !== 'superAdmin') {
      return res.status(403).json({ msg: 'Access denied: Super admin only' });
    }
    next();
  };
  

  export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: admin only' });
    }
    next();
  };

  
  export const authorizeEmployee = (req, res, next) => {
    const allowedRoles = ['Editor', 'Journalist', 'Photographer', 'Proofreader', 'admin'];

    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: Employee only' });
    }

    next();
};