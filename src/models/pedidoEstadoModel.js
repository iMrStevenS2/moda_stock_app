export const EstadoPedidoModel = (connection, DataTypes) => {
  return connection.define('PedidosEstados', {
    id_estado: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'PK de estado del pedido (SERIAL PRIMARY KEY)'
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING(100),
      unique: true,
      comment: 'Nombre legible del estado (ej. creado, pendiente, entregado)'
    },
    descripcion: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Descripción funcional del estado (opcional)'
    }
  }, {
    tableName: 'pedidos_estados',
    timestamps: false,
    comment: 'Catálogo de estados posibles para pedidos'
  });
};