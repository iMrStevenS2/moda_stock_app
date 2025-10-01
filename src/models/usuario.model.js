export const UsuarioModel = (connection, DataTypes) => {
    return connection.define('Usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },

      nombre: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      correo: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      contrasena: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      rol: {
        allowNull: false,
        type: DataTypes.ENUM('admin', 'usuario'),
        defaultValue: 'usuario',
      },
      estado: {
        allowNull: false,
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
      },
      notas: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      token_recuperacion: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    }, {
      timestamps: true,
      createdAt: 'creadoEn',
      updatedAt: 'actualizadoEn'
    })
  }