import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  // Verificar explícitamente el valor de DISABLE_AUTH
  const disableAuth = process.env.DISABLE_AUTH === 'true';
  
  // Si la autenticación está desactivada, permitir paso directo
  if (disableAuth) {
    console.log('⚠️ Advertencia: Autenticación desactivada por DISABLE_AUTH');
    return next();
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Token requerido',
      hint: process.env.NODE_ENV === 'development' ? 
        'Para pruebas, usa DISABLE_AUTH=true en .env o incluye el token en el header Authorization' : undefined
    });
  }

  try {
    // Extraer token del header (soporta "Bearer token" o solo "token")
    const token = authHeader.startsWith('Bearer ') ? 
      authHeader.substring(7) : authHeader;

    const secret = process.env.JWT_SECRET || 'modastocksecret';
    const decoded = jwt.verify(token, secret);
    
    // Adjuntar payload decodificado a req.user para uso en controladores
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      message: 'Token inválido o expirado'
    });
  }
}

// Named export para mantener compatibilidad con imports existentes
export const verifyToken = authMiddleware;