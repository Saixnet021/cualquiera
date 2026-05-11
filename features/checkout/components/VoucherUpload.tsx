
'use client';

import { useState, useEffect } from 'react';
import { useImageUpload } from '@/src/shared/hooks/use-image-upload';
import { useCheckoutStore } from '../store/checkout.store';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, Check, QrCode, CreditCard, Info } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { SettingsRepository, AppSettings } from '@/src/infrastructure/firebase/settings.repository';

const settingsRepo = new SettingsRepository();

export function VoucherUpload() {
  const { voucherUrl, setVoucherUrl, nextStep, prevStep } = useCheckoutStore();
  const { upload, uploading } = useImageUpload();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsRepo.getSettings();
        setSettings(data);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file);
      if (url) {
        setVoucherUrl(url);
        toast.success('Comprobante subido');
      }
    } catch (error) {
      toast.error('Error al subir la imagen');
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="text-center space-y-2 mb-4">
        <h3 className="font-black text-fg uppercase tracking-widest text-sm">Comprobante de pago</h3>
        <p className="text-[10px] text-muted-fg font-black uppercase tracking-tighter">Sigue las instrucciones para completar tu pedido.</p>
      </div>

      {/* Payment Instructions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* QR Section */}
        <div className="border border-border p-4 bg-muted/30 flex flex-col items-center justify-center space-y-3">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
            <QrCode className="w-3 h-3" /> Escanea para pagar
          </p>
          {loadingSettings ? (
             <div className="w-32 h-32 bg-muted animate-pulse border border-border" />
          ) : settings?.paymentQrUrl ? (
            <div className="relative w-32 h-32 bg-white border border-border p-1 group cursor-zoom-in" onClick={() => window.open(settings.paymentQrUrl, '_blank')}>
                <Image src={settings.paymentQrUrl} alt="QR de Pago" fill className="object-contain" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
            </div>
          ) : (
            <div className="w-32 h-32 border border-dashed border-border flex items-center justify-center opacity-20">
                <QrCode className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Bank Details Section */}
        <div className="border border-border p-4 bg-muted/30 space-y-3">
           <p className="text-[9px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
            <CreditCard className="w-3 h-3" /> Cuentas Bancarias
          </p>
          {loadingSettings ? (
            <div className="space-y-2">
                <div className="h-3 bg-muted animate-pulse w-full" />
                <div className="h-3 bg-muted animate-pulse w-2/3" />
            </div>
          ) : (
            <div className="text-[10px] font-bold uppercase text-fg leading-relaxed whitespace-pre-wrap">
                {settings?.paymentDetails || 'Comuníquese con el administrador para los datos de pago.'}
            </div>
          )}
        </div>
      </div>

      <div className="bg-fg/5 border-l-2 border-fg p-3 flex gap-3">
        <Info className="w-4 h-4 text-fg shrink-0" />
        <p className="text-[9px] font-bold text-fg uppercase leading-tight">
            Una vez realizado el pago, suba su comprobante (captura o foto) para procesar su pedido.
        </p>
      </div>

      {/* Upload Area */}
      <div className="relative group">
        <label className={`
          flex flex-col items-center justify-center w-full h-40 border border-dashed cursor-pointer
          transition-all duration-200
          ${voucherUrl ? 'border-fg bg-bg' : 'border-border bg-muted hover:border-muted-fg'}
        `}>
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-fg animate-spin" />
              <span className="text-[10px] font-black text-fg uppercase">Subiendo...</span>
            </div>
          ) : voucherUrl ? (
            <div className="relative w-full h-full p-2">
              <Image src={voucherUrl} alt="Voucher" fill className="object-contain" />
              <div className="absolute inset-0 bg-fg/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-bg text-[10px] font-black uppercase">Cambiar imagen</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-muted-fg" />
              <span className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Subir comprobante</span>
              <span className="text-[8px] text-muted-fg opacity-50 uppercase">JPG, PNG o WebP</span>
            </div>
          )}
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="flex-1 font-black uppercase text-[10px] h-11"
        >
          Atrás
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!voucherUrl || uploading}
          className="flex-1 bg-fg text-bg hover:opacity-80 font-black uppercase text-[10px] h-11"
        >
          {voucherUrl ? 'Siguiente' : 'Esperando imagen'}
        </Button>
      </div>
    </div>
  );
}
