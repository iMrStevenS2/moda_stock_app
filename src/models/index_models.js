import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Import all models
import { ClienteModel } from './cliente.model.js';
import { UsuarioModel } from './usuario.model.js';
import { ProveedorModel } from './proveedor.model.js';
import { ProductoModel } from './producto.model.js';
import { InventarioProductoModel } from './inventarioProducto.model.js';
import { InventarioMovimientoModel } from './inventarioMovimiento.model.js';
import { PedidoModel } from './pedido.model.js';
import { DetallePedidoModel } from './detallePedido.model.js';
import { AbonoPedidoModel } from './abonoPedido.model.js';

// Initialize models
export const Cliente = ClienteModel(sequelize, Sequelize);
export const Usuario = UsuarioModel(sequelize, Sequelize);
export const Proveedor = ProveedorModel(sequelize, Sequelize);
export const Producto = ProductoModel(sequelize, Sequelize);
export const InventarioProducto = InventarioProductoModel(sequelize, Sequelize);
export const InventarioMovimiento = InventarioMovimientoModel(sequelize, Sequelize);
export const Pedido = PedidoModel(sequelize, Sequelize);
export const DetallePedido = DetallePedidoModel(sequelize, Sequelize);
export const AbonoPedido = AbonoPedidoModel(sequelize, Sequelize);

// Define relationships
// Cliente relationships
Cliente.hasMany(Pedido, { 
  foreignKey: 'id_cliente', 
  as: 'pedidos' 
});
Pedido.belongsTo(Cliente, { 
  foreignKey: 'id_cliente', 
  as: 'cliente' 
});

// Cliente final relationship (optional - for when order is for someone else)
Cliente.hasMany(Pedido, { 
  foreignKey: 'id_cliente_final', 
  as: 'pedidosComoClienteFinal' 
});
Pedido.belongsTo(Cliente, { 
  foreignKey: 'id_cliente_final', 
  as: 'clienteFinal' 
});

// Producto relationships
Producto.hasMany(InventarioProducto, { 
  foreignKey: 'id_producto', 
  as: 'inventarios' 
});
InventarioProducto.belongsTo(Producto, { 
  foreignKey: 'id_producto', 
  as: 'producto' 
});

Producto.hasMany(DetallePedido, { 
  foreignKey: 'id_producto', 
  as: 'detallesPedido' 
});
DetallePedido.belongsTo(Producto, { 
  foreignKey: 'id_producto', 
  as: 'producto' 
});

// InventarioProducto relationships
InventarioProducto.hasMany(InventarioMovimiento, { 
  foreignKey: 'id_inventario_producto', 
  as: 'movimientos' 
});
InventarioMovimiento.belongsTo(InventarioProducto, { 
  foreignKey: 'id_inventario_producto', 
  as: 'inventarioProducto' 
});

// Pedido relationships
Pedido.hasMany(DetallePedido, { 
  foreignKey: 'id_pedido', 
  as: 'detalles' 
});
DetallePedido.belongsTo(Pedido, { 
  foreignKey: 'id_pedido', 
  as: 'pedido' 
});

Pedido.hasMany(AbonoPedido, { 
  foreignKey: 'id_pedido', 
  as: 'abonos' 
});
AbonoPedido.belongsTo(Pedido, { 
  foreignKey: 'id_pedido', 
  as: 'pedido' 
});

// Many-to-many relationship between Producto and Pedido through DetallePedido
Producto.belongsToMany(Pedido, { 
  through: DetallePedido, 
  foreignKey: 'id_producto', 
  otherKey: 'id_pedido',
  as: 'pedidos' 
});
Pedido.belongsToMany(Producto, { 
  through: DetallePedido, 
  foreignKey: 'id_pedido', 
  otherKey: 'id_producto',
  as: 'productos' 
});

// Sync database (only in development)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: false });
}

export default sequelize;