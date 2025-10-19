export const PedidoModel = (connection, DataTypes) => {
  return connection.define('Pedido', {
    id_pedido: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del pedido (SERIAL PRIMARY KEY)'
    },

    id_cliente: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK -> clientes.id_cliente. Cliente que abre el pedido - NOT NULL',
      references: { model: 'clientes', key: 'id_cliente' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },

    id_cliente_final: {
      allowNull: true,
      type: DataTypes.INTEGER,
      comment: 'FK -> clientes.id_cliente. Cliente que paga el pedido (nullable)',
      references: { model: 'clientes', key: 'id_cliente' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },

    fecha_pedido: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: connection.literal('CURRENT_DATE'),
      comment: 'Fecha de creación del pedido (por defecto CURRENT_DATE)'
    },

   estado: {
      allowNull: false,
      type: DataTypes.STRING(20),
      defaultValue: 'creado',
      comment: "Estado del pedido (ejemplos: 'creado','pendiente','entregado','pagado','cerrado','cancelado'). Se recomienda parametrizar estos valores en una tabla 'estados_pedidos' y usar FK (id_estado) si se desea mayor flexibilidad."
    },

    total_estimado: {
      allowNull: false,
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      comment: 'Valor estimado del pedido (NUMERIC(10,2))'
    },

    id_factura: {
      allowNull: true,
      type: DataTypes.INTEGER,
      comment: 'Referencia futura a una factura (nullable)'
    },

    saldo_pendiente: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Valor pendiente por pagar (entero, por defecto 0)'
    },

    fecha_cancelacion: {
      allowNull: true,
      type: DataTypes.DATE,
      comment: 'Fecha de cancelación del pedido (nullable)'
    },

    creado_por: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Usuario que gestionó/creó el pedido (opcional, identificador legible)'
    },

    cancelado_por: {
      allowNull: true,
      type: DataTypes.STRING(20),
      comment: 'Usuario del sistema que canceló el pedido (opcional, identificador legible)'
    },

    motivo_cancelacion: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Motivo por el cual el cliente o sistema canceló el pedido (nullable)'
    },

    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones adicionales del pedido (nullable)'
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_actualizacion',
    comment: 'Tabla de pedidos realizados por los clientes',
    indexes: [
      { fields: ['estado'], name: 'idx_pedidos_estado' },
      { fields: ['id_cliente'], name: 'idx_pedidos_id_cliente' }
    ]
  });
};