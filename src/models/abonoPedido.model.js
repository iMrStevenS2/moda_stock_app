export const AbonoPedidoModel = (connection, DataTypes) => {
    return connection.define('AbonoPedido', {
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
      fecha_abono: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      monto_abono: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      metodo_pago: {
        allowNull: false,
        type: DataTypes.ENUM('efectivo', 'transferencia', 'cheque', 'tarjeta'),
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