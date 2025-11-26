export const ClienteModel = (connection, DataTypes) => {
  return connection.define('Cliente', {
    id_cliente: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador técnico único del cliente (SERIAL PRIMARY KEY)'
    },

    tipo_documento: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'Tipo de documento (CC, NIT, CE, etc.) - NOT NULL'
    },

    numero_documento: {
      allowNull: false,
      type: DataTypes.STRING(30),
      comment: 'Número de identificación del cliente - NOT NULL'
    },

    nombre: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Nombre completo del cliente - NOT NULL'
    },

    email: {
      allowNull: true,
      type: DataTypes.STRING(100),
      validate: { isEmail: true },
      comment: 'Correo electrónico del cliente (opcional)'
    },

    telefono: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Número de contacto (opcional)'
    },

    direccion: {
      allowNull: true,
      type: DataTypes.STRING(150),
      comment: 'Dirección física (opcional)'
    },

    ciudad: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Ciudad de residencia (opcional)'
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
      comment: 'Observaciones adicionales o historial de interacción (opcional)'
    }
  }, {
    tableName: 'clientes', // nombre controlado de la tabla en la BD
    timestamps: true,
    createdAt: 'fecha_registro',   // fecha_registro equivale a createdAt
    updatedAt: 'fecha_actualizacion',
    comment: 'Tabla de clientes',
    indexes: [
      { unique: true, fields: ['tipo_documento', 'numero_documento'], name: 'uq_cliente_tipo_numero' }
    ]
  });
};
