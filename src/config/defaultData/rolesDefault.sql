-- Inserta roles por defecto. Asume que la tabla existe y tiene columna "nombre" única.
INSERT INTO roles_usuarios (nombre, descripcion) VALUES
('admin', 'Administrador con todos los permisos'),
('supervisor', 'Supervisor — manejo de operaciones y supervisión'),
('empleado', 'Empleado — acceso operativo limitado')
ON CONFLICT (nombre) DO NOTHING;