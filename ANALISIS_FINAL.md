# ANÁLISIS FINAL DEL PROYECTO — E-COMMERCE DEMO

Este documento detalla el estado técnico y funcional del proyecto tras la refactorización a Arquitectura Limpia y la implementación del tema B&W Minimalista.

## 1. Estado actual de cada feature implementada

| Feature | Estado | Observaciones |
| :--- | :--- | :--- |
| **Checkout** | ⚠️ **Incompleto** | El flujo de `CheckoutModal` (Envío -> Pago -> Confirmar) funciona pero está desconectado del botón "Comprar" directo. |
| **Stock en tiempo real** | ✅ **Completo** | Implementado con `onSnapshot` en el admin y lógica de descuento atómico en `ConfirmPaymentUseCase`. |
| **Panel admin (Kanban)** | ✅ **Completo** | Tres columnas funcionales (`voucher_uploaded`, `paid`, `shipped`) con actualizaciones automáticas. |
| **Roles** | ✅ **Completo** | Gestión de `admin` vs `customer` protegida, con script de promoción y sección de invitaciones. |
| **Limpieza legacy** | ❌ **Roto** | Existen múltiples archivos duplicados (`components/product-card.tsx` vs `features/products/components/product-card.tsx`) que confunden al compilador. |

### Fragmentos problemáticos (Checkout / Inconsistencia):
En `features/products/components/product-card.tsx` (L109), el botón "Comprar" abre el modal antiguo:
```tsx
<Button onClick={() => setIsPurchaseModalOpen(true)}>Buy Now</Button>
<PurchaseModal isOpen={isPurchaseModalOpen} product={product} ... />
```
Mientras que el carrito usa el nuevo flujo:
```tsx
// features/cart/components/cart.tsx
<CheckoutModal isOpen={isCheckoutOpen} ... />
```
**Resultado:** "Comprar" directo no pide dirección ni comprobante, solo envía a WhatsApp.

---

## 2. Tipos y contratos

### Definiciones actuales:

**CartItem (types/index.ts)**
```typescript
export interface CartItem extends Product {
  quantity: number;
  size?: string;
}
```

**CartItemEntity (src/domain/entities/cart.entity.ts)** — ⚠️ **Inconsistente (Sin size)**
```typescript
export interface CartItemEntity extends ProductEntity {
  quantity: number;
}
```

**OrderEntity (src/domain/entities/order.entity.ts)**
```typescript
export interface OrderEntity {
  id: string;
  items: CartItemEntity[]; // ⚠️ Perdería el 'size' al persistir/recuperar si se castea estrictamente
  status: 'pending' | 'approved' | 'rejected' | 'voucher_uploaded' | 'paid' | 'shipped';
  shippingData?: ShippingData;
  voucherUrl?: string;
  // ...
}
```

---

## 3. Flujo de datos end-to-end

1. **Selección**: `ProductCard.tsx` llama a `addItem` del `cart.store.ts`.
2. **Checkout**: `cart.tsx` abre `CheckoutModal.tsx`.
3. **Datos de Envío**: `ShippingForm.tsx` guarda en `checkout.store.ts`.
4. **Pago**: `VoucherUpload.tsx` usa `useImageUpload.ts` -> API `/api/upload` -> Cloudinary.
5. **Persistencia**: `use-checkout.ts` llama a `createCheckoutOrder` (`features/checkout/actions.ts`).
6. **WhatsApp**: `use-checkout.ts` abre `wa.me` con mensaje detallado.
7. **Verificación Admin**: `OrdersTab.tsx` detecta el pedido (status: `voucher_uploaded`).
8. **Confirmación**: Admin pulsa "Confirmar pago" -> `ConfirmPaymentUseCase.ts` ejecuta `writeBatch`:
   - ⚠️ **Actualiza** `order.status` a `paid`.
   - ⚠️ **Descuenta stock** de `products` (manejando variantes si hay `size`).
9. **Envío**: Admin pulsa "Marcar enviado" -> `MarkShippedUseCase.ts` actualiza a `shipped` con `trackingNumber`.

---

## 4. Imports rotos o circulares

- **Roto**: El archivo `components/auth-button.tsx` fue reemplazado por `features/auth/components/auth-button.tsx`, pero algunos layouts antiguos podrían seguir llamando al anterior.
- **Roto**: `lib/firebase.ts` re-exporta desde `src/infrastructure/firebase/firebase.config`, pero hubo errores de ruta en el último despliegue (corregidos manualmente).

---

## 5. Variables de entorno

| Variable | Usada en | Estado en .env.example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_*` | `firebase.config.ts` | ✅ Presente |
| `CLOUDINARY_*` | `cloudinary.service.ts` | ✅ Presente |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `use-checkout.ts` | ✅ Presente |
| `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` | `UpdateUserRoleUseCase.ts` | ✅ Presente |

---

## 6. Inconsistencias de nomenclatura

- **Size**: En la UI se llama "Talla", en el código "size", en Firestore "variant".
- **Voucher**: En el código se usa "voucherUrl", en la UI "Comprobante", en el mensaje de WA "Comprobante".
- **Shipping**: En el store se usa `shippingData`, en Firestore a veces se aplana.

---

## 7. Código duplicado

1. **Creación de órdenes**:
   - `features/checkout/actions.ts` -> `createCheckoutOrder` (Usado en el carrito).
   - `src/application/orders/create-order.usecase.ts` -> `CreateOrderUseCase` (Usado en compra directa).
   *Hacen casi lo mismo pero con distintos estados iniciales.*

2. **Componentes de UI**:
   - `components/product-card.tsx` vs `features/products/components/product-card.tsx`.
   - `components/cart.tsx` vs `features/cart/components/cart.tsx`.

---

## 8. Lo que falta para producción

1. **Manejo de Errores**: Muchos `try/catch` solo muestran un `toast` genérico o un `console.error`. Falta logueo formal de errores.
2. **Estados de Carga**: El botón de "Comprar" directo no tiene un `loading` visual claro mientras se crea la orden en Firestore.
3. **Validación de Stock**: Al agregar al carrito, no se valida si el usuario está pidiendo más de lo que hay en stock (solo se valida al confirmar el pago en el admin).
4. **Seguridad Firestore**: Las reglas actuales son funcionales pero podrían ser más granulares para evitar que un usuario vea el `voucherUrl` de otro si conoce el ID.
5. **Limpieza**: Se deben eliminar los directorios `services/`, `store/` y `hooks/` de la raíz, ya que toda esa lógica fue movida a `src/` o `features/`.
6. **Diseño**: El `CheckoutModal` y el `SplashScreen` aún no han sido migrados totalmente al tema Blanco y Negro (B&W).
