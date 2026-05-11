
'use client';

import { useState, useEffect } from 'react';
import { SettingsRepository, AppSettings } from '@/src/infrastructure/firebase/settings.repository';
import { Settings, Save, Loader2, Phone, QrCode, CreditCard, Upload, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useImageUpload } from '@/src/shared/hooks/use-image-upload';

const settingsRepo = new SettingsRepository();

export default function SettingsTab() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { upload, uploading, url: uploadedUrl } = useImageUpload();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (uploadedUrl) {
      setSettings(s => s ? { ...s, paymentQrUrl: uploadedUrl } : null);
      toast.success('QR subido correctamente');
    }
  }, [uploadedUrl]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsRepo.getSettings();
      setSettings(data);
    } catch (error) {
      // El repositorio ya maneja el fallback, pero notificamos el error silencioso
      console.warn('Usando configuración por defecto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      await settingsRepo.updateSettings(settings);
      toast.success('Configuración guardada en la nube');
    } catch (error) {
      toast.error('Error al guardar. Revisa los permisos de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-10 bg-muted animate-pulse w-1/4" />
        <div className="h-40 bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Settings className="w-6 h-6 text-fg" />
        <h2 className="text-2xl font-black text-fg uppercase tracking-tighter">Configuración de Pagos y Contacto</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* WhatsApp & Accounts */}
            <div className="space-y-6">
                <div className="p-6 border border-border bg-muted/30 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-muted-fg uppercase tracking-widest">
                            <Phone className="w-3.5 h-3.5" />
                            WhatsApp de Pedidos
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg font-black text-xs">+</span>
                            <input
                                type="text"
                                value={settings?.whatsappNumber || ''}
                                onChange={(e) => setSettings(s => s ? { ...s, whatsappNumber: e.target.value.replace(/\D/g, '') } : null)}
                                placeholder="51987654321"
                                className="w-full bg-bg border border-border h-12 pl-8 pr-4 text-xs font-black tracking-widest focus:border-fg outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[10px] font-black text-muted-fg uppercase tracking-widest">
                            <CreditCard className="w-3.5 h-3.5" />
                            Cuentas Bancarias / Instrucciones
                        </label>
                        <textarea
                            value={settings?.paymentDetails || ''}
                            onChange={(e) => setSettings(s => s ? { ...s, paymentDetails: e.target.value } : null)}
                            placeholder="BCP: XXX-XXXXXX-X-XX..."
                            className="w-full bg-bg border border-border min-h-[120px] p-4 text-[10px] font-bold uppercase tracking-tight focus:border-fg outline-none leading-relaxed"
                        />
                        <p className="text-[8px] text-muted-fg font-bold uppercase">
                            Este texto se mostrará al cliente antes de subir su comprobante.
                        </p>
                    </div>
                </div>
            </div>

            {/* QR Code */}
            <div className="p-6 border border-border bg-muted/30 space-y-6">
                <label className="flex items-center gap-2 text-[10px] font-black text-muted-fg uppercase tracking-widest">
                    <QrCode className="w-3.5 h-3.5" />
                    QR de Pago (Yape / Plin / QR Bancario)
                </label>
                
                <div className="flex flex-col items-center gap-6">
                    {settings?.paymentQrUrl ? (
                        <div className="relative group">
                            <div className="relative w-48 h-48 bg-bg border border-border p-2">
                                <Image src={settings.paymentQrUrl} alt="QR de Pago" fill className="object-contain" />
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSettings(s => s ? { ...s, paymentQrUrl: undefined } : null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-48 h-48 border-2 border-dashed border-border flex flex-col items-center justify-center bg-bg opacity-50">
                            <QrCode className="w-10 h-10 text-muted-fg mb-2" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-fg">Sin QR Configurado</span>
                        </div>
                    )}

                    <label className="cursor-pointer h-12 px-8 flex items-center gap-3 border border-border bg-bg text-fg hover:bg-fg hover:text-bg transition-all text-[9px] font-black uppercase tracking-widest">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {settings?.paymentQrUrl ? 'Reemplazar QR' : 'Subir Código QR'}
                        <input type="file" accept="image/*" onChange={handleImageFile} className="hidden" disabled={uploading} />
                    </label>
                </div>
            </div>
        </div>

        <Button 
            disabled={saving || uploading} 
            className="h-16 px-12 bg-fg text-bg hover:opacity-90 font-black uppercase text-xs tracking-[0.2em] transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Configuración de Pagos
        </Button>
      </form>
    </div>
  );
}
