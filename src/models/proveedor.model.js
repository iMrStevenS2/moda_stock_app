export const ProveedorModel = (connection, DataTypes) => {
  return connection.define('Proveedor', {
    id_proveedor: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador técnico único del proveedor (SERIAL PRIMARY KEY)'
    },

    tipo_documento: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'Tipo de documento (NIT, CC, CE, etc.) - NOT NULL'
    },

    numero_documento: {
      allowNull: false,
      type: DataTypes.STRING(30),
      comment: 'Número de identificación del proveedor - NOT NULL'
    },

    razon_social: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Nombre o razón social del proveedor - NOT NULL'
    },

    nombre_contacto: {
      allowNull: true,
      type: DataTypes.STRING(100),
      comment: 'Persona de contacto principal (opcional)'
    },

    email_contacto: {
      allowNull: true,
      type: DataTypes.STRING(100),
      validate: { isEmail: true },
      comment: 'Correo electrónico del contacto (opcional)'
    },

    telefono_contacto: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Teléfono del contacto (opcional)'
    },

    direccion: {
      allowNull: true,
      type: DataTypes.STRING(150),
      comment: 'Dirección física del proveedor (opcional)'
    },

    ciudad: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Ciudad de ubicación (opcional)'
    },

    departamento: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Departamento o región (opcional)'
    },

    pais: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'País (opcional)'
    },

    estado: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { isIn: [[0, 1]] },
      comment: 'Estado del cliente: 1 = activo, 0 = inactivo'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones adicionales o historial comercial (opcional)'
    }
  }, {
    tableName: 'proveedores',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: 'fecha_actualizacion',
    comment: 'Tabla de proveedores',
    indexes: [
      { unique: true, fields: ['tipo_documento', 'numero_documento'], name: 'uq_proveedor_tipo_numero' }
    ]
  });
};