export const InsumosProveedorModel = (connection, DataTypes) => {
  return connection.define('Insumos_proveedor', {
    id_insumo_proveedor: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    id_insumo: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK a insumos_catalogo.id_insumo'
    },

    id_proveedor: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK a proveedores.id_proveedor'
    },

    precio_unitario: {
      allowNull: false,
      type: DataTypes.DECIMAL(10,2)
    },

    condiciones_pago: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'activo'
    },

    fecha_registro: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'insumos_proveedor',
    timestamps: false,
    comment: 'Vínculo comercial entre insumos y proveedores'
  });
};
