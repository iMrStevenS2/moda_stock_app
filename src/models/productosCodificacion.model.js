export const ProductosCodificacionModel = (connection, DataTypes) => {
  return connection.define('Productos_codificacion', {
    id_producto: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del producto (SERIAL PRIMARY KEY) FK A '
    },

    nombre_producto: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Nombre comercial del producto - NOT NULL'
    },

    tipo_producto: {
      allowNull: false,
      type: DataTypes.STRING(50),
      comment: 'Categoría del producto (uniforme, vestido, chaqueta, etc.) - NOT NULL'
    },

    talla: {
      allowNull: true,
      type: DataTypes.STRING(10),
      comment: 'Talla del producto (S, M, L, XL, etc.)'
    },

    color: {
      allowNull: true,
      type: DataTypes.STRING(30),
      comment: 'Color principal del producto'
    },

    genero: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Género objetivo (masculino, femenino, unisex)'
    },

    material: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Tipo de tela/material (algodón, poliéster, mezclado, etc.)'
    },

    precio_unitario: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Precio de venta por unidad (NUMERIC(10,2)) - NOT NULL'
    },

    estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'activo',
      comment: "Estado del producto (por ejemplo: 'activo', 'descontinuado')"
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Detalles adicionales o branding'
    }
  }, {
    tableName: 'productos_codificacion', 
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Tabla de productos codificados en el sistema con esto se categorizan los productos'
  });
};