export const UsuarioModel = (connection, DataTypes) => {
  return connection.define('Usuarios', {
    id_usuario: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador técnico único del usuario (SERIAL PRIMARY KEY)'
    },

    usuario: { // nombre de usuario para login (único)
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true,
      comment: 'Nombre de usuario (login) - NOT NULL, UNIQUE'
    },

    tipo_documento: {
      allowNull: false,
      type: DataTypes.STRING(10),
      comment: 'Tipo de documento (CC, TI, CE, etc.) - NOT NULL'
    },

    numero_documento: {
      allowNull: false,
      type: DataTypes.STRING(20),
      comment: 'Número de documento - NOT NULL'
    },

    primer_nombre: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Primer nombre del usuario - NOT NULL'
    },

    segundo_nombre: {
      allowNull: true,
      type: DataTypes.STRING(100),
      comment: 'Segundo nombre (opcional)'
    },

    primer_apellido: {
      allowNull: false,
      type: DataTypes.STRING(100),
      comment: 'Primer apellido del usuario - NOT NULL'
    },

    segundo_apellido: {
      allowNull: true,
      type: DataTypes.STRING(100),
      comment: 'Segundo apellido (opcional)'
    },

    correo: {
      allowNull: false,
      type: DataTypes.STRING(100),
      validate: { isEmail: true },
      comment: 'Correo electrónico asociado - NOT NULL'
    },

    contrasena: { // hash de la contraseña
      allowNull: false,
      type: DataTypes.TEXT,
      comment: 'Contraseña encriptada (hash) - NOT NULL'
    },

    id_rol: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK a roles_usuarios.id_rol',
      references: { model: 'roles_usuarios', key: 'id_rol' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },


    estado: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { isIn: [[0, 1]] },
      comment: 'Estado del cliente: 1 = activo, 0 = inactivo'
    },


    fecha_ultimo_login: {
      allowNull: true,
      type: DataTypes.DATE,
      comment: 'Última vez que inició sesión'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones adicionales o historial de cambios'
    },

    token_recuperacion: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Token para recuperación de contraseña (temporal)'
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Tabla de usuarios del sistema',
    indexes: [
      { unique: true, fields: ['usuario'], name: 'uq_usuario' },
      { unique: true, fields: ['tipo_documento', 'numero_documento'], name: 'uq_tipo_numero_documento' }
    ]
  });
};