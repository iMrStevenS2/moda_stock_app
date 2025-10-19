export const ClienteModel = (connection, DataTypes) => {
    return connection.define('Cliente', {
      id_cliente: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      tipo_documento: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      numero_documento: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
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
      telefono: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      direccion: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      ciudad: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      departamento: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      pais: {
        allowNull: false,
        type: DataTypes.STRING,
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
    }, {
      timestamps: true,
      createdAt: 'creadoEn',
      updatedAt: 'actualizadoEn'
    })
  }