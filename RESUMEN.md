# Resumen del proyecto

## Stack
- **Runtime**: Node.js
- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS 4
- **Estado Global**: Zustand
- **Base de Datos**: Firebase Firestore (NoSQL)
- **Autenticación**: Firebase Authentication
- **Gestión de Imágenes**: Cloudinary (Upload API & Storage)
- **Validación**: Zod
- **Componentes UI**: Radix UI, Lucide React
- **Notificaciones**: React Hot Toast

## Estructura de archivos
- `app/` - Rutas de Next.js (App Router).
  - `admin/` - Panel de administración protegido por roles.
    - `tabs/` - Componentes modulares para productos, pedidos y usuarios.
  - `api/upload/` - Endpoint para subida de imágenes a Cloudinary.
  - `auth/` - Página de inicio de sesión y registro.
- `components/` - Componentes de UI compartidos y atómicos.
- `features/` - Lógica de negocio organizada por dominios (Legacy/Compatibilidad).
- `lib/` - Configuraciones de terceros (Firebase config).
- `public/` - Assets estáticos (iconos, imágenes, gifs).
- `src/` - Núcleo de la **Arquitectura Limpia**.
  - `application/` - Casos de uso (Use Cases) y DTOs de validación.
  - `domain/` - Entidades de negocio puras e interfaces (contratos) de repositorios.
  - `infrastructure/` - Implementaciones concretas de Firebase y Cloudinary.
  - `presentation/` - Providers globales, guards de seguridad y stores principales.
  - `shared/` - Errores personalizados, hooks genéricos y utilidades.
- `types/` - Definiciones de tipos globales.
- `proxy.ts` - Middleware de Next.js para seguridad y protección de rutas.

## Rutas API
- **POST** `/api/upload`: Recibe un archivo (FormData), lo sube de forma segura a Cloudinary y retorna la URL optimizada.

## Modelos de base de datos (Firestore)
*Nota: Se usa Firestore (NoSQL), no Prisma. A continuación los esquemas de documentos:*

- **users** (`uid` como ID):
  - `email` (string), `displayName` (string), `role` (enum: admin, customer), `createdAt` (timestamp).
- **products** (`id` autogenerado):
  - `name` (string), `description` (string), `price` (number), `stock` (number), `imageUrl` (string), `category` (string), `createdAt` (timestamp).
- **orders** (`id` autogenerado):
  - `userId` (string), `userEmail` (string), `items` (array de items), `total` (number), `status` (enum: pending, approved, rejected), `createdAt` (timestamp).

## Flujo principal (Compra y WhatsApp)
1. **Selección**: El usuario navega por el catálogo y añade productos al carrito (gestionado por `cart.store.ts`).
2. **Confirmación**: En el `PurchaseModal`, el usuario confirma la intención de compra.
3. **Persistencia**: Se ejecuta el `CreateOrderUseCase` que valida los datos con Zod y guarda la orden en Firestore con estado `pending`.
4. **Redirección**: El frontend genera una URL de WhatsApp (`wa.me`) usando el número global configurado en variables de entorno y un mensaje pre-llenado con el nombre y precio del producto.
5. **Apertura**: Se abre una nueva pestaña de WhatsApp para que el usuario envíe el mensaje al administrador.
6. **Gestión Admin**: El administrador recibe el mensaje, verifica el pago y, desde el panel de control, cambia el estado de la orden a `approved`.
7. **Stock**: Al aprobar, se ejecuta el `ApproveOrderUseCase` que descuenta automáticamente las unidades del inventario en Firestore.

## Dependencias externas
- **Firebase**: Hosting de la base de datos en tiempo real y gestión de identidad de usuarios.
- **Cloudinary**: Procesamiento y almacenamiento de imágenes para evitar saturar Firestore con base64.
- **WhatsApp API (wa.me)**: Canal principal de comunicación y cierre de ventas.
- **Vercel**: Infraestructura de despliegue y ejecución de funciones Serverless (API Routes).

## Lo que falta o está incompleto
- **Archivos Redundantes**: Existen directorios fuera de `src/` (`services/`, `store/`, `hooks/`) que contienen lógica legacy duplicada tras la refactorización a Arquitectura Limpia. Deben ser eliminados.
- **Cupones de Descuento**: La entidad `Order` tiene un campo `discount`, pero no existe lógica de negocio ni UI para aplicar códigos promocionales.
- **Migración de Datos**: Algunos productos antiguos en la base de datos podrían seguir teniendo imágenes en formato base64 que deben ser migradas a Cloudinary.
- **Webhooks**: No existe una integración de entrada (Inbound) para recibir mensajes de WhatsApp automáticamente en el sistema; depende de la acción manual del admin.
- **Roles**: Falta una interfaz para que el primer admin pueda promoverse sin intervención manual en la consola de Firebase.
