export default function errorHandler(err, req, res, next) {
  // Log mínimo en servidor
  console.error(err);

  // Normalizar respuesta
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || 'Internal server error';

  // Opcional: detalles en desarrollo
  const body = { message };
  if (process.env.NODE_ENV === 'development') {
    body.error = {
      name: err.name,
      stack: err.stack
    };
  }

  res.status(status).json(body);
}