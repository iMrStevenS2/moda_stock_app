export const InventarioProductoModel = (connection, DataTypes) => {
  return connection.define('InventarioProducto', {
    id_inventario: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del registro de inventario (SERIAL PRIMARY KEY)'
    },

    codigo_producto: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'FK a productos_codificacion.codigo_producto (VARCHAR(20))',
      references: {
        model: 'productos_codificacion',
        key: 'codigo_producto'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    cantidad_disponible: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Unidades disponibles en stock (por defecto 0)'
    },

    ubicacion: {
      allowNull: true,
      type: DataTypes.STRING(100),
      comment: 'Bodega, estante o zona de almacenamiento (opcional)'
    },

    fecha_entrada: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de ingreso al inventario (por defecto CURRENT_DATE)'
    },

    estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'activo',
      comment: "Estado del inventario (ej. 'activo', 'reservado', 'agotado')"
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones adicionales (lote, condiciones, etc.)'
    }
  }, {
    tableName: 'inventarios_productos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Inventarios por producto terminado',
    indexes: [
      { fields: ['codigo_producto'], name: 'idx_inventarios_codigo_producto' }
    ]
  });
};
