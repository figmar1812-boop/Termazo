# Termazo — V0.5 Base de datos real (Fase 9)

Home, catálogo, producto, personalizador, carrito y backend, ahora conectados a una base de datos real en PostgreSQL vía Prisma.X

## Cómo conectar tu base de datos (una sola vez)

### 1. Crea una base de datos gratis
Ve a **[neon.tech](https://neon.tech)** (o [supabase.com](https://supabase.com)) → crea una cuenta gratis → crea un proyecto nuevo → copia la cadena de conexión (`DATABASE_URL`).

### 2. Configura la variable de entorno
En tu computadora, dentro de la carpeta `termazo`, crea un archivo llamado `.env` (copia `.env.example` y renómbralo) y pega tu cadena de conexión real.

### 3. Instala dependencias y crea las tablas
```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

Esto crea las tablas en tu base de datos y las llena con los 3 termos iniciales, sus colores y las 5 tipografías.

### 4. Corre el proyecto
```bash
npm run dev
```

## Cómo conectar la base de datos en Vercel (producción)

1. En tu proyecto de Vercel → pestaña **"Settings"** → **"Environment Variables"**.
2. Agrega `DATABASE_URL` con el mismo valor que usaste en tu `.env` local.
3. Vuelve a desplegar (Vercel → pestaña "Deployments" → botón "Redeploy").

## Qué incluye esta versión

- Todo lo de las fases anteriores (Home, catálogo, producto, personalizador, carrito, backend).
- **Base de datos real**: productos, colores, clientes y pedidos ahora viven en PostgreSQL, no en un archivo de código.
- `/api/products` y `/api/products/[slug]` leen de la base de datos.
- `/api/orders` valida, verifica que el producto exista de verdad, calcula el precio con descuento por volumen, y **guarda el pedido de forma permanente**.
- `prisma/seed.ts` — script para cargar (o resetear) el catálogo inicial.

## Cómo probarlo en tu computadora

Necesitas [Node.js](https://nodejs.org) instalado (versión 18 o superior) y una base de datos conectada (ver arriba).

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Cómo publicarlo en internet (paso a paso, sin experiencia previa)

### 1. Crear el repositorio en GitHub
1. Ve a [github.com](https://github.com) y crea una cuenta si no tienes.
2. Crea un nuevo repositorio (botón "New repository"), llámalo `termazo`.
3. En tu computadora, dentro de esta carpeta:
   ```bash
   git init
   git add .
   git commit -m "v0.1 - home base"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/termazo.git
   git push -u origin main
   ```

### 2. Crear el hosting en Vercel
1. Ve a [vercel.com](https://vercel.com) y crea una cuenta con tu mismo usuario de GitHub.
2. Clic en "Add New Project".
3. Selecciona el repositorio `termazo`.
4. Vercel detecta que es Next.js automáticamente — solo da clic en "Deploy".
5. En un par de minutos tendrás una URL pública tipo `termazo.vercel.app`.

### 3. Development / Staging / Production
- **Production**: la rama `main` se publica automáticamente en tu dominio principal.
- **Staging**: cada vez que subas una rama nueva (ej. `git checkout -b fase-3`) y la subas a GitHub, Vercel genera automáticamente una URL de vista previa distinta — así revisas cada fase antes de aprobarla, sin tocar la versión en vivo.
- **Development**: tu propia computadora, con `npm run dev`.

### 4. Conectar tu dominio (cuando lo compres)
1. En Vercel, entra al proyecto → pestaña "Domains".
2. Escribe tu dominio (ej. `termazo.mx`) y sigue las instrucciones — Vercel te da unos registros DNS para configurar en el sitio donde compraste el dominio.
3. El SSL (candado de seguridad `https://`) se activa automáticamente, sin configuración extra.

## Próximos pasos (fases siguientes)

- Fase 3: catálogo `/termos`
- Fase 4: página de producto Termo 20 oz
- Fase 5-6: personalizador real y vista previa
- Fase 8-9: backend + base de datos (aquí "Termos populares" deja de ser data de ejemplo)
