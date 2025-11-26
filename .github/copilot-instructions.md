## Instrucciones rápidas para agentes AI

Este repositorio es una API Node.js (Express + Sequelize) con una pequeña SPA en `modastockap_front/`.
Usa módulos ES (`type: module` en `package.json`) y Postgres como BD. A continuación hay puntos prácticos y ejemplos concretos para ser productivo acá.

1) Resumen de arquitectura
- Entradas HTTP -> `src/routes/*.js` -> `src/controllers/*Controller.js` -> `src/services/*Service.js` -> `src/models/*.js` (Sequelize).
- Los modelos se inicializan y asocian en `src/models/index_models.js`. Allí también existe `initializeDatabase({sync,seed})` para sincronizar/sembrar datos.
- Configuración: `src/config/config.js` (lee variables de entorno). Conexión Sequelize en `src/config/database.js`.
- Middlewares importantes: `src/middlewares/auth.middleware.js` (verifica JWT), `src/middlewares/error.middleware.js` (error handler — se monta después de las rutas).

2) Comandos comunes (desde la raíz `moda_stock_app/`)
- `npm run dev` — inicia con nodemon (`src/index.js`).
- `npm start` — inicia Node normal (`node src/index.js`).
- `docker-compose up -d` — levanta Postgres + pgAdmin definido en `docker-compose.yml`.
- Migraciones (sequelize-cli):
  - `npm run migrations:generate -- <name>`
  - `npm run migrations:run`
  - `npm run migrations:revert`

3) Variables de entorno relevantes (definidas en `src/config/config.js`)
- NODE_ENV, PORT
- DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DB_DIALECT
- JWT_SECRET, API_KEY
- Flags de administración: DB_SYNC, DB_SYNC_ALTER, DB_SYNC_LOG, DB_SEED (usar `true`/`false`).

4) Patron y convenciones del proyecto (debe seguirse al editar/añadir features)
- Endpoints: añadir archivo de ruta en `src/routes/` y exportar un router. Conectar el router en `src/index.js`.
- Controller: lógica de parsing/validación de req y respuesta/errores. Debe llamar a servicios.
- Service: lógica de negocio y acceso a modelos (llamadas a `src/models/*`). Evitar lógica de formatos HTTP aquí.
- Modelos: cada archivo de `src/models/*.js` exporta una función que recibe `(sequelize, DataTypes)` y devuelve el model.
- Relaciones: cuando añadas un nuevo modelo, registrar la exportación y las asociaciones en `src/models/index_models.js`.
- Validación: usar `src/utils/validators.js` y `joi` cuando corresponda.

5) Autenticación y autorización
- Login: `src/routes/auth.routes.js` -> `src/controllers/authController.js` -> `src/services/authService.js`.
- JWT: la app comprueba token con `verifyToken` (ver `auth.middleware.js`) y lo aplica en `src/index.js` a rutas protegidas (`/usuarios`, `/clientes`, etc.).

6) Base de datos / sincronización / seed
- En desarrollo puedes activar sincronización automática: exporta `DB_SYNC=true` (y opcionalmente `DB_SYNC_ALTER=true`) antes de iniciar la app.
- Para sólo aplicar seeds: `DB_SEED=true`.
- Los seeds/default data se aplican desde `src/config/run-default-data.js`.

7) Cómo añadir un nuevo endpoint (mini check-list)
- Crear modelo en `src/models/` y registrar en `src/models/index_models.js`.
- Crear service en `src/services/` con funciones reusables.
- Crear controller en `src/controllers/` que valide input y maneje errores (usar `next(err)` si es necesario).
- Crear ruta en `src/routes/` y montarla en `src/index.js`.
- Agregar tests simples en `src/tests/` si es posible.

8) Notas operativas y gotchas
- El proyecto usa `type: module` — usar import/export y extensiones `.js` en imports.
- `src/index.js` monta `errorHandler` al final — no moverlo antes de las rutas.
- Sequelize logging está activado sólo en `development` (ver `src/config/database.js`).

9) Archivos clave a revisar para entender cambios
- `src/models/index_models.js` (asociaciones + initializeDatabase)
- `src/config/database.js`, `src/config/config.js`
- `src/controllers/authController.js`, `src/services/authService.js`
- `docker-compose.yml` (postgres + pgadmin)

Si alguna parte del flujo no está clara (p. ej. ubicación de seeds específicas, estructura de roles, o tests esperados), dime qué sección quieres expandir y actualizo estas instrucciones.
