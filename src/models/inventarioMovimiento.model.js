export const InventarioMovimientoModel = (connection, DataTypes) => {
    return connection.define('InventarioMovimiento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_inventario_producto: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipo_movimiento: {
        allowNull: false,
        type: DataTypes.ENUM('entrada', 'salida', 'ajuste', 'devolucion'),
      },
      cantidad: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      usuario_responsable: {
        allowNull: false,
        type: DataTypes.STRING,
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