import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Import all models
import { ClienteModel } from './cliente.model.js';
import { UsuarioModel } from './usuario.model.js';
import { ProveedorModel } from './proveedor.model.js';
import { ProductosCodificacionModel } from './productosCodificacion.model.js';
import { InsumosCatalogoModel } from './InsumosCatalogo.model.js';
import { InsumosProveedorModel } from './insumosProveedor.model.js';
import { InventarioProductoModel } from './inventarioProducto.model.js';
import { InventarioMovimientoModel } from './inventarioMovimiento.model.js';
import { PedidoModel } from './pedido.model.js';
import { DetallePedidoModel } from './detallePedido.model.js';
import { AbonoPedidoModel } from './abonoPedido.model.js';
import { RolesUsuarioModel } from './roles.model.js';
import { EstadoPedidoModel } from './pedidoEstadoModel.js';
import { runDefaultData } from '../config/run-default-data.js';

// Initialize models
export const Cliente = ClienteModel(sequelize, Sequelize);
export const Usuario = UsuarioModel(sequelize, Sequelize);
export const Proveedor = ProveedorModel(sequelize, Sequelize);
export const ProductosCodificacion = ProductosCodificacionModel(sequelize, Sequelize);
export const InsumosCatalogo = InsumosCatalogoModel(sequelize, Sequelize);
export const InsumosProveedor = InsumosProveedorModel(sequelize, Sequelize.DataTypes || Sequelize);
export const InventarioProducto = InventarioProductoModel(sequelize, Sequelize);
export const InventarioMovimiento = InventarioMovimientoModel(sequelize, Sequelize);
export const Pedido = PedidoModel(sequelize, Sequelize);
export const DetallePedido = DetallePedidoModel(sequelize, Sequelize);
export const AbonoPedido = AbonoPedidoModel(sequelize, Sequelize);
export const Roles = RolesUsuarioModel(sequelize, Sequelize.DataTypes); 
export const EstadoPedido = EstadoPedidoModel(sequelize, Sequelize.DataTypes);


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

// Relacion de tipos de productos e inventarios
// Nota: la tabla `inventarios_productos` referencia a `productos_codificacion.codigo_producto`.
ProductosCodificacion.hasMany(InventarioProducto, {
  foreignKey: 'codigo_producto',
  sourceKey: 'codigo_producto',
  as: 'inventarios'
});
InventarioProducto.belongsTo(ProductosCodificacion, {
  foreignKey: 'codigo_producto',
  targetKey: 'codigo_producto',
  as: 'productosCodificacion'
});

ProductosCodificacion.hasMany(DetallePedido, { 
  foreignKey: 'id_producto', 
  as: 'detallesPedido' 
});
DetallePedido.belongsTo(ProductosCodificacion, { 
  foreignKey: 'id_producto', 
  as: 'productosCodificacion' 
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
ProductosCodificacion.belongsToMany(Pedido, { 
  through: DetallePedido, 
  foreignKey: 'id_producto', 
  otherKey: 'id_pedido',
  as: 'pedidos' 
});
Pedido.belongsToMany(ProductosCodificacion, { 
  through: DetallePedido, 
  foreignKey: 'id_pedido', 
  otherKey: 'id_producto',
  as: 'productos_codificacion' 
});

// Asociaciones: Usuario -> RolesTipos muchos a uno
Usuario.belongsTo(Roles, {
  foreignKey: 'id_rol',
  as: 'rol',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
  constraints: true
});
Roles.hasMany(Usuario, {
  foreignKey: 'id_rol',
  as: 'usuarios',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
  constraints: true
});

///Pedido -> EstadoPedido (many-to-one)
Pedido.belongsTo(EstadoPedido, {
  foreignKey: 'id_estado',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
  constraints: true
});
EstadoPedido.hasMany(Pedido, { foreignKey: 'id_estado' });


// // Sync database (only in development)
// if (process.env.NODE_ENV === 'development') {
//   sequelize.sync({ alter: false });
// }

export async function initializeDatabase({ sync = false, seed = false, syncOptions = { alter: true } } = {}) {
  if (sync) {
    console.log('[db init] sincronizando esquema (sequelize.sync) con options:', syncOptions);
    await sequelize.sync(syncOptions);
    console.log('[db init] sincronización completada');
  }
  if (seed) {
    console.log('[db init] aplicando default data (seed)');
    await runDefaultData();
  }
}

export default sequelize;

