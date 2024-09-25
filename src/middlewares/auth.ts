import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface pour le token utilisateur ajouté à la requête
export interface AuthRequest extends Request {
  user?: { id: string };  // Typage plus précis
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  // Vérifiez si un token est présent
  if (!token) {
    return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
  }

  try {
    // Décoder le token JWT avec la clé secrète et typage
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey') as { user: { id: string } };

    // Assigner le champ `user` du token décodé à req.user
    req.user = decoded.user;
console.log('User decoded')
    // Passer au middleware suivant ou à la route
    next();
  } catch (err) {
    console.error('Erreur lors du décodage du token :', err);
    res.status(401).json({ message: 'Token invalide' });
  }
};