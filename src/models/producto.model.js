export const ProductoModel = (connection, DataTypes) => {
    return connection.define('Producto', {
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
      tipo_producto: {
        allowNull: false,
        type: DataTypes.ENUM('Uniforme escolar', 'Vestido de gala'),
      },
      talla: {
        allowNull: false,
        type: DataTypes.ENUM('S', 'M', 'L', 'XL', 'XXL'),
      },
      color: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      genero: {
        allowNull: false,
        type: DataTypes.ENUM('Masculino', 'Femenino'),
      },
      material: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      precio: {
        allowNull: false,
        type: DataTypes.FLOAT,
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