export const PedidoModel = (connection, DataTypes) => {
    return connection.define('Pedido', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_cliente: {
        allowNull: false,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      id_cliente_final: {
        allowNull: true,
        type: DataTypes.INTEGER,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fecha_pedido: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      estado: {
        allowNull: false,
        type: DataTypes.ENUM('pendiente', 'en proceso', 'completado', 'cancelado'),
        defaultValue: 'pendiente',
      },
      total_estimado: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      id_factura: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      notas: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      saldo_pendiente: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
    }, {
      timestamps: true,
      createdAt: 'creadoEn',
      updatedAt: 'actualizadoEn'
    })
  }