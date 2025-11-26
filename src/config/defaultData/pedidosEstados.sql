INSERT INTO pedidos_estados (nombre, descripcion) VALUES
('creado','Pedido creado'),
('pendiente','Pendiente de preparación/entrega'),
('entregado','Pedido entregado al cliente'),
('pagado','Pago registrado'),
('cerrado','Pedido cerrado'),
('cancelado','Pedido cancelado')
ON CONFLICT (nombre) DO NOTHING;