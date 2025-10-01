export const DetallePedidoModel = (connection, DataTypes) => {
    return connection.define('DetallePedido', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_pedido: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_producto: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cantidad: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      precio_unitario: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      subtotal: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      descuento: {
        allowNull: true,
        type: DataTypes.FLOAT,
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