export const UsuarioModel = (connection, DataTypes) => {
  return connection.define('Usuario', {
    id_usuario: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    usuario: { // nombre de usuario para login (único)
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },

    tipo_documento: {
      allowNull: false,
      type: DataTypes.STRING(10)
    },

    numero_documento: {
      allowNull: false,
      type: DataTypes.STRING(20)
    },

    primer_nombre: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    segundo_nombre: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    primer_apellido: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },

    segundo_apellido: {
      allowNull: true,
      type: DataTypes.STRING(100)
    },

    correo: {
      allowNull: false,
      type: DataTypes.STRING(100),
      validate: { isEmail: true }
    },

    contrasena_hash: { // hash de la contraseña
      allowNull: false,
      type: DataTypes.TEXT
    },

    rol: {
      allowNull: false,
      type: DataTypes.STRING(30),
      defaultValue: 'usuario'
    },

    estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'activo'
    },

    fecha_ultimo_login: {
      allowNull: true,
      type: DataTypes.DATE
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT
    },

    token_recuperacion: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }, {
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    indexes: [
      {
        unique: true,
        fields: ['usuario'],
        name: 'uq_usuario_usuario'
      },
      {
        unique: true,
        fields: ['tipo_documento', 'numero_documento'],
        name: 'uq_usuario_tipo_numero_documento'
      }
    ]
  });
};
