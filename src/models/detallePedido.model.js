export const DetallePedidoModel = (connection, DataTypes) => {
  const DetallePedido = connection.define('DetallePedido', {
    id_detalle: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del ítem del pedido (SERIAL PRIMARY KEY)'
    },

    id_pedido: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK -> pedidos.id_pedido. Pedido principal - NOT NULL',
      references: { model: 'pedidos', key: 'id_pedido' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    id_producto: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK -> productos.id_producto. Producto solicitado - NOT NULL',
      references: { model: 'productos', key: 'id_producto' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'Cantidad solicitada - NOT NULL'
    },

    precio_unitario: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Precio estimado por unidad (NUMERIC(10,2)) - NOT NULL'
    },

    subtotal: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Total por ítem (cantidad * precio_unitario). Calculado al crear el detalle - NOT NULL'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones específicas del ítem (opcional)'
    }
  }, {
    tableName: 'detalle_pedidos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Detalle de los productos incluidos en cada pedido',
  });
  return DetallePedido;
};