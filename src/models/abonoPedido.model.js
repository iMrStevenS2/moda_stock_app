export const AbonoPedidoModel = (connection, DataTypes) => {
  return connection.define('AbonoPedido', {
    id_abono: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del abono (SERIAL PRIMARY KEY)'
    },

    id_pedido: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK -> pedidos.id_pedido. Pedido al que se aplica el abono - NOT NULL',
      references: { model: 'pedidos', key: 'id_pedido' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    fecha_abono: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: connection.literal('CURRENT_TIMESTAMP'),
      comment: 'Fecha y hora del abono (por defecto CURRENT_TIMESTAMP)'
    },

    monto_abonado: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Valor del abono realizado (NUMERIC(10,2)) - NOT NULL'
    },

    metodo_pago: {
      allowNull: false,
      type: DataTypes.STRING(50),
      comment: 'Método de pago (efectivo, transferencia, tarjeta, etc.) - NOT NULL'
    },

    usuario_registro: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Usuario del sistema que registró el abono (opcional)'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones adicionales (referencia, comprobante, etc.)'
    }
  }, {
    tableName: 'abonos_pedidos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Registro de abonos aplicados a pedidos',
    indexes: [
      { fields: ['id_pedido'], name: 'idx_abonos_id_pedido' }
    ]
  });
};