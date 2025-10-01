export const InventarioProductoModel = (connection, DataTypes) => {
    return connection.define('InventarioProducto', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_producto: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad_disponible: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      ubicacion: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fecha_entrada: {
        allowNull: false,
        type: DataTypes.DATE,
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