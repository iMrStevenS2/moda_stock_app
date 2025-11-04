export const InsumosCatalogoModel = (connection, DataTypes) => {
  return connection.define('Insumos_catalogo', {
    id_insumo: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    codigo_insumo: {
      allowNull: false,
      type: DataTypes.STRING(20),
      unique: true,
      comment: 'Código interno o comercial del insumo'
    },

    nombre_insumo: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Nombre comercial del insumo'
    },

    tipo_insumo: {
      allowNull: false,
      type: DataTypes.STRING(50),
      comment: 'Categoría del insumo (tela, accesorio, herramienta, etc.)'
    },

    unidad_medida: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'Unidad de medida (m, kg, unidad, paquete, etc.)'
    },

    descripcion: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'activo'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'insumos_catalogo',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Catálogo maestro de insumos'
  });
};
