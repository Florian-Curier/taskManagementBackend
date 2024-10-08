import express, { Request, Response, NextFunction } from 'express';  // Ajoutez Request, Response et NextFunction
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import { auth, AuthRequest } from '../middlewares/auth'

const router = express.Router();


// Route de connexion
router.post('/signin', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ], async (req: Request, res: Response, next: NextFunction) => {  // Ajoutez les types pour req, res, next
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Vérifier si le mot de passe est correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
  
      // Générer un token JWT
      const payload = {
        user: {
          id: user.id
        }
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'defaultSecretKey',   
        { expiresIn: '1h' },  // Expiration du token
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error((error as any).message);
      res.status(500).send('Erreur serveur');
    }
  });

// Route protégée : récupérer les infos utilisateur (nécessite l'authentification)
router.get('/me', auth, async (req: Request, res: Response) => {
    try {
      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById((req as any).user.id).select('-password');  // Enlever le mot de passe des résultats
      res.json(user);
    } catch (error) {
      console.error("Error server:", error);
      res.status(500).send('Error server');
    }
  });

  //Route protégée par le middleware auth
  router.get('/protected', auth, (req: AuthRequest, res: Response, next: NextFunction) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

export default router;