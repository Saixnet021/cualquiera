
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCheckoutStore } from '../store/checkout.store';

const shippingSchema = z.object({
  fullName: z.string().min(3, 'Nombre muy corto'),
  dni: z.string().min(8, 'DNI debe tener al menos 8 dígitos').regex(/^\d+$/, 'Solo números'),
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  courier: z.enum(['Shalom', 'Olva', 'Otro']),
  phone: z.string().min(9, 'Teléfono inválido').regex(/^\d+$/, 'Solo números'),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export function ShippingForm() {
  const { shippingData, setShippingData, nextStep } = useCheckoutStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingData,
  });

  const onSubmit = (data: ShippingFormValues) => {
    setShippingData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">Nombre Completo</label>
          <Input {...register('fullName')} placeholder="JUAN PEREZ" className={errors.fullName ? 'border-red-500' : ''} />
          {errors.fullName && <p className="text-[8px] text-red-500 ml-1 font-black uppercase">{errors.fullName.message}</p>}
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">DNI</label>
          <Input {...register('dni')} placeholder="8 DIGITOS" className={errors.dni ? 'border-red-500' : ''} />
          {errors.dni && <p className="text-[8px] text-red-500 ml-1 font-black uppercase">{errors.dni.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">Dirección de Entrega</label>
        <Input {...register('address')} placeholder="CALLE, AV, JR..." className={errors.address ? 'border-red-500' : ''} />
        {errors.address && <p className="text-[8px] text-red-500 ml-1 font-black uppercase">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">Ciudad/Distrito</label>
          <Input {...register('city')} placeholder="LIMA, AREQUIPA..." className={errors.city ? 'border-red-500' : ''} />
          {errors.city && <p className="text-[8px] text-red-500 ml-1 font-black uppercase">{errors.city.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">Teléfono</label>
          <Input {...register('phone')} placeholder="9 DIGITOS" className={errors.phone ? 'border-red-500' : ''} />
          {errors.phone && <p className="text-[8px] text-red-500 ml-1 font-black uppercase">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-muted-fg uppercase tracking-widest ml-1">Courier (Agencia)</label>
        <select 
          {...register('courier')}
          className="w-full h-11 px-4 py-2 text-xs bg-input-bg border border-input-border text-fg focus:outline-none focus:border-fg font-black uppercase tracking-widest"
        >
          <option value="Shalom">SHALOM (RECOJO)</option>
          <option value="Olva">OLVA (DOMICILIO)</option>
          <option value="Otro">OTRO / CONTRAENTREGA</option>
        </select>
      </div>

      <Button type="submit" className="w-full bg-fg text-bg hover:opacity-80 font-black h-12 mt-4 uppercase text-sm tracking-widest rounded-none">
        Siguiente
      </Button>
    </form>
  );
}
