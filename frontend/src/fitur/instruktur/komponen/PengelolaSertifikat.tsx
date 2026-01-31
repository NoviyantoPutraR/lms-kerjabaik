import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/komponen/ui/card';
import { Button } from '@/komponen/ui/button';
import { Slider } from '@/komponen/ui/slider';
import { Label } from '@/komponen/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/komponen/ui/tabs";
import { Upload, Save, Eye, Loader2, Trash2, Type, Image as ImageIcon, Move, Palette } from 'lucide-react';
import { supabase } from '@/pustaka/supabase';
import { toast } from 'sonner';

interface CertificateConfig {
  url_background?: string;
  name_coords: { x: number; y: number; size: number; color?: string };
  course_coords: { x: number; y: number; size: number; color?: string };
}

interface PengelolaSertifikatProps {
  kursusId: string;
  initialConfig?: CertificateConfig;
}

export function PengelolaSertifikat({ kursusId, initialConfig }: PengelolaSertifikatProps) {
  const [config, setConfig] = useState<CertificateConfig>(initialConfig || {
    name_coords: { x: 421, y: 300, size: 40, color: '#155eef' },
    course_coords: { x: 421, y: 200, size: 24, color: '#1f2937' },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG/PNG)');
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${kursusId}-template-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sertifikat')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sertifikat')
        .getPublicUrl(filePath);

      setConfig(prev => ({ ...prev, url_background: publicUrl }));
      toast.success('Template berhasil diunggah');
    } catch (error: any) {
      toast.error('Gagal mengunggah gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaved(false);
      const { data: course } = await supabase
        .from('kursus')
        .select('metadata')
        .eq('id', kursusId)
        .single();
      
      const newMetadata = {
        ...(course?.metadata || {}),
        certificate_config: config
      };

      const { error } = await supabase
        .from('kursus')
        .update({
          metadata: newMetadata
        })
        .eq('id', kursusId);

      if (error) throw error;
      toast.success('Konfigurasi sertifikat berhasil disimpan');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      toast.error('Gagal menyimpan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTemplate = () => {
    setConfig(prev => ({ ...prev, url_background: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const widthA4 = 842;
  const heightA4 = 595;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Controls Panel (Left) - Scrollable */}
      <Card className="w-full lg:w-[400px] shrink-0 border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-lg">Editor Sertifikat</CardTitle>
              <CardDescription className="text-xs">Sesuaikan tampilan sertifikat.</CardDescription>
            </div>
          </div>
          <Button 
            className={`w-full transition-all duration-300 ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : saved ? (
              <span className="flex items-center"><Save className="h-4 w-4 mr-2" /> Tersimpan!</span>
            ) : (
              <span className="flex items-center"><Save className="h-4 w-4 mr-2" /> Simpan Perubahan</span>
            )}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-lg">
              <TabsTrigger value="general" className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" /> Background
              </TabsTrigger>
              <TabsTrigger value="name" className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Type className="h-3.5 w-3.5 mr-1.5" /> Nama
              </TabsTrigger>
              <TabsTrigger value="course" className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Type className="h-3.5 w-3.5 mr-1.5" /> Judul
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="general" className="mt-0 space-y-4 data-[state=inactive]:hidden">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/20">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                  <Upload className="h-4 w-4 mr-2" /> Upload Template
                </h4>
                <p className="text-xs text-blue-600/80 dark:text-blue-300/70 mb-4 leading-relaxed">
                  Unggah desain sertifikat kosong (tanpa teks nama/judul). 
                  Ukuran rekomendasi: <strong>842 x 595 piksel</strong> (Format JPG/PNG).
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1 h-9 bg-white dark:bg-zinc-950"
                  >
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Upload className="h-3.5 w-3.5 mr-2" />}
                    {config.url_background ? 'Ganti File' : 'Pilih File'}
                  </Button>
                  {config.url_background && (
                    <Button variant="ghost" size="icon" onClick={resetTemplate} className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="name" className="mt-0 space-y-6 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <Label className="text-sm font-medium">Koordinat</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    X:{config.name_coords.x}, Y:{config.name_coords.y}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <Label className="text-[11px] text-muted-foreground">Posisi Horizontal (X)</Label>
                    </div>
                    <Slider 
                      value={[config.name_coords.x]} 
                      max={widthA4} 
                      step={1} 
                      onValueChange={([val]) => setConfig(prev => ({ ...prev, name_coords: { ...prev.name_coords, x: val } }))} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Posisi Vertikal (Y)</Label>
                    <Slider 
                      value={[config.name_coords.y]} 
                      max={heightA4} 
                      step={1} 
                      onValueChange={([val]) => setConfig(prev => ({ ...prev, name_coords: { ...prev.name_coords, y: val } }))} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <Label className="text-sm font-medium">Gaya Teks</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Ukuran</Label>
                    <div className="flex items-center gap-2">
                       <Slider 
                        value={[config.name_coords.size]} 
                        min={10} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => setConfig(prev => ({ ...prev, name_coords: { ...prev.name_coords, size: val } }))} 
                        className="flex-1"
                      />
                      <span className="text-[10px] w-6 text-right">{config.name_coords.size}</span>
                    </div>
                  </div>
                   <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Warna</Label>
                    <div className="flex gap-2">
                       <div className="relative">
                          <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden relative">
                             <input 
                              type="color" 
                              value={config.name_coords.color || '#000000'} 
                              onChange={(e) => setConfig(prev => ({ ...prev, name_coords: { ...prev.name_coords, color: e.target.value } }))}
                              className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                            />
                          </div>
                       </div>
                      <input 
                         type="text"
                         value={config.name_coords.color || '#000000'}
                         onChange={(e) => setConfig(prev => ({ ...prev, name_coords: { ...prev.name_coords, color: e.target.value } }))}
                         className="h-8 flex-1 text-[11px] px-2 border border-input rounded uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="course" className="mt-0 space-y-6 data-[state=inactive]:hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <Label className="text-sm font-medium">Koordinat</Label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    X:{config.course_coords.x}, Y:{config.course_coords.y}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Posisi Horizontal (X)</Label>
                    <Slider 
                      value={[config.course_coords.x]} 
                      max={widthA4} 
                      step={1} 
                      onValueChange={([val]) => setConfig(prev => ({ ...prev, course_coords: { ...prev.course_coords, x: val } }))} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Posisi Vertikal (Y)</Label>
                    <Slider 
                      value={[config.course_coords.y]} 
                      max={heightA4} 
                      step={1} 
                      onValueChange={([val]) => setConfig(prev => ({ ...prev, course_coords: { ...prev.course_coords, y: val } }))} 
                    />
                  </div>
                </div>
              </div>

               <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                  <Label className="text-sm font-medium">Gaya Teks</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Ukuran</Label>
                    <div className="flex items-center gap-2">
                       <Slider 
                        value={[config.course_coords.size]} 
                        min={10} 
                        max={100} 
                        step={1} 
                        onValueChange={([val]) => setConfig(prev => ({ ...prev, course_coords: { ...prev.course_coords, size: val } }))} 
                        className="flex-1"
                      />
                      <span className="text-[10px] w-6 text-right">{config.course_coords.size}</span>
                    </div>
                  </div>
                   <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground">Warna</Label>
                    <div className="flex gap-2">
                       <div className="relative">
                          <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden relative">
                             <input 
                              type="color" 
                              value={config.course_coords.color || '#000000'} 
                              onChange={(e) => setConfig(prev => ({ ...prev, course_coords: { ...prev.course_coords, color: e.target.value } }))}
                              className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
                            />
                          </div>
                       </div>
                      <input 
                         type="text"
                         value={config.course_coords.color || '#000000'}
                         onChange={(e) => setConfig(prev => ({ ...prev, course_coords: { ...prev.course_coords, color: e.target.value } }))}
                         className="h-8 flex-1 text-[11px] px-2 border border-input rounded uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
          
          <div className="p-3 border-t border-gray-100 dark:border-zinc-800 text-[10px] text-muted-foreground text-center bg-gray-50/50 dark:bg-zinc-900/50 rounded-b-lg">
             Tips: Gunakan slider horizontal/vertikal untuk menggeser posisi teks.
          </div>
        </Tabs>
      </Card>

      {/* Preview Section - Sticky & Flexible */}
      <div className="flex-1 h-full min-h-[400px] bg-gray-50 dark:bg-zinc-900/30 rounded-lg border border-gray-200 dark:border-zinc-800 flex flex-col relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/50 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-zinc-700 flex items-center text-xs font-medium">
          <Eye className="w-3.5 h-3.5 mr-2 text-primary" />
          Live Preview
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
          {/* Scalable Container */}
          <div 
             className="relative bg-white shadow-2xl rounded-sm overflow-hidden select-none transition-all duration-300 ease-in-out"
             style={{
                width: '100%',
                maxWidth: '842px',
                aspectRatio: '842/595',
             }}
          >
             {config.url_background ? (
               <img src={config.url_background} className="absolute inset-0 w-full h-full object-cover" alt="Certificate Background" />
             ) : (
               <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-double border-gray-200 m-8 bg-gray-50/50">
                 <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                 </div>
                 <p className="text-sm text-gray-500 font-medium">Preview Area</p>
                 <p className="text-xs text-gray-400 mt-1">Belum ada background</p>
               </div>
             )}

             <div className="absolute inset-0 w-full h-full">
                {/* NAMA SISWA */}
                <div 
                   className="absolute transform -translate-x-1/2 translate-y-1/2 whitespace-nowrap cursor-help hover:outline hover:outline-1 hover:outline-blue-400 transition-colors"
                   style={{
                      left: `${(config.name_coords.x / widthA4) * 100}%`,
                      bottom: `${(config.name_coords.y / heightA4) * 100}%`,
                      fontSize: `max(${config.name_coords.size * 0.7}px, ${config.name_coords.size / 10}cqw)`, 
                      color: config.name_coords.color || '#000000',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                   }}
                   title={`Posisi Nama: X=${config.name_coords.x}, Y=${config.name_coords.y}`}
                   onClick={() => setActiveTab('name')}
                >
                  NAMA PESERTA
                </div>

                {/* JUDUL KURSUS */}
                <div 
                   className="absolute transform -translate-x-1/2 translate-y-1/2 whitespace-nowrap cursor-help hover:outline hover:outline-1 hover:outline-blue-400 transition-colors"
                   style={{
                      left: `${(config.course_coords.x / widthA4) * 100}%`,
                      bottom: `${(config.course_coords.y / heightA4) * 100}%`,
                      fontSize: `max(${config.course_coords.size * 0.7}px, ${config.course_coords.size / 10}cqw)`,
                      color: config.course_coords.color || '#000000',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                   }}
                   title={`Posisi Judul: X=${config.course_coords.x}, Y=${config.course_coords.y}`}
                   onClick={() => setActiveTab('course')}
                >
                  JUDUL KURSUS
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
