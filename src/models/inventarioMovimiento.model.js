export const InventarioMovimientoModel = (connection, DataTypes) => {
  return connection.define('InventarioMovimiento', {
    id_movimiento: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      comment: 'Identificador único del movimiento (SERIAL PRIMARY KEY)'
    },
    id_inventario: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'FK -> inventarios_productos.id_inventario. Registro de inventario afectado',
      references: { model: 'inventarios_productos', key: 'id_inventario' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    tipo_movimiento: {
      allowNull: false,
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste', 'devolucion'),
      comment: "Tipo (entrada, salida, ajuste, devolución)"
    },
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'Cantidad afectada'
    },
    fecha_movimiento: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: connection.literal('CURRENT_TIMESTAMP'),
      comment: 'Fecha y hora del movimiento'
    },
    usuario_responsable: {
      allowNull: true,
      type: DataTypes.STRING(50),
      comment: 'Usuario que realizó el movimiento (opcional)'
    },
    notas: {
      allowNull: true,
      type: DataTypes.TEXT,
      comment: 'Observaciones o motivo del movimiento (opcional)'
    }
  }, {
    tableName: 'inventarios_movimientos',
    timestamps: false,
    comment: 'Movimientos registrados sobre inventarios de productos'
  });
};
