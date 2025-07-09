
export const errorHandler = (err, req, res, next) => {
    // Verifica si el error tiene un código de estado HTTP
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Envía una respuesta con el código de estado y mensaje
    res.status(statusCode).json({
      message: err.message || 'Ha ocurrido un error inesperado',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Solo mostramos el stack en desarrollo
    });
  };
  
