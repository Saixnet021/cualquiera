# Auditoría del proyecto

## Lista de archivos y funciones

### app/ (Rutas y Páginas)
- `app/admin/page.tsx`: Orquestador del Dashboard administrativo usando tabs.
- `app/admin/tabs/orders-tab.tsx`: Interfaz para gestionar pedidos (aprobar/rechazar) vía use-cases.
- `app/admin/tabs/products-tab.tsx`: Interfaz CRUD de productos con subida de imágenes a Cloudinary.
- `app/admin/tabs/users-tab.tsx`: Tabla de gestión de usuarios y asignación de roles admin/customer.
- `app/api/upload/route.ts`: API Route segura para subir imágenes a Cloudinary desde el servidor.
- `app/auth/page.tsx`: Página de autenticación (Login/Registro).
- `app/layout.tsx`: Layout raíz que inyecta el `AuthProvider` y el sistema de notificaciones.
- `app/page.tsx`: Página de inicio con carruseles de productos y banners.

### components/ (UI Compartida - Legacy/UI)
- `components/navbar.tsx`: Barra de navegación con acceso al carrito y auth.
- `components/cart.tsx`: Carrito lateral con lógica de checkout legacy (redirect directo).
- `components/product-card.tsx`: Card visual de producto (legacy).
- `components/purchase-modal.tsx`: Modal de confirmación de compra (legacy).
- `components/ui/*`: Biblioteca de componentes base (Buttons, Inputs, Cards, etc.).

### features/ (Módulos - Legacy/Redundantes)
- `features/auth/store/auth.store.ts`: Capa de compatibilidad que re-exporta el store central de `src/`.
- `features/cart/store/cart.store.ts`: Implementación de Zustand para el carrito de compras.
- `features/orders/components/purchase-modal.tsx`: Versión refactorizada del modal de compra.
- `features/orders/hooks/use-order.ts`: Hook que conecta la UI con el `CreateOrderUseCase`.
- `features/products/hooks/use-products.ts`: Hook que conecta la UI con el `GetProductsUseCase`.

### services/ (Legacy - Fuera de src)
- `services/order.service.ts`: Lógica directa de Firebase para pedidos (Redundante). -> **Equivalente**: `src/infrastructure/firebase/order.repository.ts`
- `services/product.service.ts`: Lógica directa de Firebase para productos (Redundante). -> **Equivalente**: `src/infrastructure/firebase/product.repository.ts`

### store/ (Legacy - Fuera de src)
- `store/auth.ts`: Estado de autenticación antiguo. -> **Equivalente**: `src/presentation/providers/auth.store.ts`
- `store/cart.ts`: Estado de carrito antiguo. -> **Equivalente**: `features/cart/store/cart.store.ts`

### hooks/ (Legacy - Fuera de src)
- `hooks/use-order.ts`: Hook de pedidos antiguo. -> **Equivalente**: `features/orders/hooks/use-order.ts`
- `hooks/use-products.ts`: Hook de productos antiguo. -> **Equivalente**: `features/products/hooks/use-products.ts`

### src/ (Clean Architecture - Nueva Estructura)
- `src/application/usecases/*`: Lógica de negocio pura (CRUD, Aprobaciones).
- `src/domain/entities/*`: Definición de modelos de datos del negocio.
- `src/infrastructure/*`: Implementaciones técnicas (Firebase, Cloudinary).
- `src/presentation/*`: Lógica de estado global y protección de rutas.
- `src/shared/*`: Utilidades y manejo de errores centralizado.

## Imports Legacy detectados
*(Archivos que aún apuntan fuera de `src/` o `features/` refactorizados)*

- En `app/admin/page.tsx`:
  - `import { Button } from '@/components/ui/button';`
- En `features/cart/components/cart.tsx`:
  - `import { useCart } from '@/features/cart/store/cart.store';`
- En `components/cart.tsx`:
  - `import { useCart } from '@/store/cart';`
  - `import { useAuth } from '@/store/auth';`
- En `features/orders/components/purchase-modal.tsx`:
  - `import { useAuth } from '@/features/auth/store/auth.store';`

## Contenido de archivos críticos

### 1. Checkout actual (lógica en Cart)
```tsx
// Ubicación: components/cart.tsx (Líneas 19-51)
  const handleCheckout = async () => {
    if (!user) {
      alert('Debes iniciar sesión para continuar');
      return;
    }
    const total = getTotal();
    try {
      await addDoc(collection(db, 'orders'), {
        userEmail: user.email,
        items: items,
        total: total,
        status: 'pending',
        createdAt: new Date(),
      });
      // ... generación de mensaje WhatsApp ...
    } catch (error) { ... }
  };
```

### 2. Generador de mensaje de WhatsApp
```tsx
// Ubicación: features/orders/components/purchase-modal.tsx (Líneas 78-81)
const message = `Hola, quiero comprar: ${product.name} por ${formatPrice(product.price)}`;
const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51937074085';
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
window.open(whatsappUrl, '_blank');
```

### 3. Subida de Voucher (No existe específicamente para vouchers)
*Actualmente solo existe subida de imágenes para productos en el Admin:*
```tsx
// Ubicación: src/shared/hooks/use-image-upload.ts
// Utiliza la API Route /api/upload que conecta con Cloudinary.
```

### 4. Store del Carrito
```tsx
// Ubicación: features/cart/store/cart.store.ts
export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => { ... }),
            removeItem: (productId) => set((state) => ({ ... })),
            getTotal: () => get().items.reduce((t, i) => t + i.price * i.quantity, 0),
        }),
        { name: 'pedro-sms-cart' }
    )
);
```

## Variables de Entorno (En uso)
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Key pública de Firebase.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Dominio de Auth.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: ID del proyecto Firestore.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Número central del negocio para pedidos.
- `CLOUDINARY_CLOUD_NAME`: Nombre de la cuenta en Cloudinary.
- `CLOUDINARY_API_KEY`: Key para subidas (Server-side).
- `CLOUDINARY_API_SECRET`: Secret para subidas (Server-side).
- `CLOUDINARY_UPLOAD_PRESET`: Configuración de subida predeterminada.
