export const RolesUsuarioModel = (connection, DataTypes) => {
  return connection.define('Roles_usuarios', {
    id_rol: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del rol'
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING(30),
      unique: true,
      comment: 'Nombre del rol (ej. admin, supervisor, empleado) - único'
    },
    descripcion: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Descripción funcional del rol'
    }
  }, {
    tableName: 'roles_usuarios',
    timestamps: false,
    comment: 'Tabla de tipos de rol'
  });
};