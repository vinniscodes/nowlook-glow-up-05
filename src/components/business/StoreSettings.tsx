import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Store, Clock, Upload, Phone, Mail, MapPin, Camera, Star, CreditCard, Bell } from 'lucide-react';
import { toast } from 'sonner';

const StoreSettings = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: 'Barbearia Moderna',
    description: 'A melhor barbearia da região com profissionais qualificados e ambiente acolhedor.',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    phone: '(11) 99999-9999',
    email: 'contato@barbeariamoderna.com',
    website: 'www.barbeariamoderna.com',
    instagram: '@barbeariamoderna',
    facebook: 'barbeariamoderna',
    profileImage: '/api/placeholder/200/200'
  });

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '08:00', close: '18:00', isOpen: true },
    tuesday: { open: '08:00', close: '18:00', isOpen: true },
    wednesday: { open: '08:00', close: '18:00', isOpen: true },
    thursday: { open: '08:00', close: '18:00', isOpen: true },
    friday: { open: '08:00', close: '18:00', isOpen: true },
    saturday: { open: '08:00', close: '16:00', isOpen: true },
    sunday: { open: '09:00', close: '14:00', isOpen: false }
  });

  const [policies, setPolicies] = useState({
    cancellationPolicy: 'Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.',
    noShowPolicy: 'Clientes que não comparecem 2 vezes seguidas precisam fazer pré-pagamento.',
    latePolicy: 'Tolerância de 10 minutos. Após esse período, o agendamento pode ser cancelado.',
    paymentPolicy: 'Aceitamos dinheiro, PIX, cartão de débito e crédito.',
    requireConfirmation: true,
    requirePrepayment: false,
    allowOnlineBooking: true,
    autoConfirmBookings: false
  });

  const [notifications, setNotifications] = useState({
    emailBookingConfirm: true,
    emailBookingReminder: true,
    emailBookingCancellation: true,
    smsBookingReminder: false,
    smsBookingConfirm: false,
    pushNotifications: true,
    dailyReport: true,
    weeklyReport: true,
    monthlyReport: false
  });

  const [gallery, setGallery] = useState([
    { id: '1', url: '/api/placeholder/300/200', title: 'Ambiente Principal' },
    { id: '2', url: '/api/placeholder/300/200', title: 'Área de Atendimento' },
    { id: '3', url: '/api/placeholder/300/200', title: 'Produtos' },
    { id: '4', url: '/api/placeholder/300/200', title: 'Equipe' }
  ]);

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const handleSaveStoreInfo = () => {
    toast.success('Informações da loja atualizadas!');
  };

  const handleSaveWorkingHours = () => {
    toast.success('Horário de funcionamento atualizado!');
  };

  const handleSavePolicies = () => {
    toast.success('Políticas atualizadas!');
  };

  const handleSaveNotifications = () => {
    toast.success('Configurações de notificação atualizadas!');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const remainingSlots = 5 - gallery.length;
      if (remainingSlots <= 0) {
        toast.error('Você pode ter no máximo 5 fotos na galeria!');
        return;
      }
      
      const filesToAdd = Math.min(files.length, remainingSlots);
      const newImages = Array.from(files).slice(0, filesToAdd).map((file, index) => ({
        id: Date.now() + index + '',
        url: URL.createObjectURL(file),
        title: `Nova foto ${gallery.length + index + 1}`
      }));
      
      setGallery(prev => [...prev, ...newImages]);
      toast.success(`${filesToAdd} imagem(ns) adicionada(s) à galeria!`);
      
      if (filesToAdd < files.length) {
        toast.warning(`Apenas ${filesToAdd} fotos foram adicionadas. Limite máximo: 5 fotos.`);
      }
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setStoreInfo(prev => ({ ...prev, profileImage: imageUrl }));
      toast.success('Foto de perfil atualizada!');
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setGallery(prev => prev.filter(img => img.id !== imageId));
    toast.success('Imagem removida da galeria!');
  };

  const handleReplaceImage = (imageId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setGallery(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, url: newImageUrl }
          : img
      ));
      toast.success('Imagem substituída!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Configurações da Loja</h2>
        <p className="text-muted-foreground">Gerencie as informações e configurações do seu estabelecimento</p>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="policies">Políticas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Informações Básicas */}
        <TabsContent value="info" className="space-y-6">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Foto de Perfil */}
              <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="relative">
                  <img
                    src={storeInfo.profileImage}
                    alt="Foto de perfil da loja"
                    className="w-32 h-32 object-cover rounded-full border-4 border-background shadow-lg"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full p-2 h-8 w-8"
                    variant="hero"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Foto de Perfil</h3>
                  <p className="text-sm text-muted-foreground">Clique no ícone da câmera para alterar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Nome da Loja</Label>
                  <Input
                    id="storeName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone Principal</Label>
                  <Input
                    id="phone"
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição da Loja</Label>
                <Textarea
                  id="description"
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                  rows={3}
                  placeholder="Descreva sua loja, especialidades, diferenciais..."
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email de Contato</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={storeInfo.website}
                    onChange={(e) => setStoreInfo({...storeInfo, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={storeInfo.instagram}
                    onChange={(e) => setStoreInfo({...storeInfo, instagram: e.target.value})}
                    placeholder="@usuario"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={storeInfo.facebook}
                    onChange={(e) => setStoreInfo({...storeInfo, facebook: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveStoreInfo} className="w-full" variant="hero">
                Salvar Informações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Horários de Funcionamento */}
        <TabsContent value="hours" className="space-y-6">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Label className="font-medium">{dayNames[day as keyof typeof dayNames]}</Label>
                    </div>
                    <Switch
                      checked={hours.isOpen}
                      onCheckedChange={(checked) => 
                        setWorkingHours(prev => ({
                          ...prev,
                          [day]: { ...prev[day as keyof typeof prev], isOpen: checked }
                        }))
                      }
                    />
                    <Badge variant={hours.isOpen ? 'default' : 'secondary'}>
                      {hours.isOpen ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                  
                  {hours.isOpen && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => 
                          setWorkingHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day as keyof typeof prev], open: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => 
                          setWorkingHours(prev => ({
                            ...prev,
                            [day]: { ...prev[day as keyof typeof prev], close: e.target.value }
                          }))
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}

              <Button onClick={handleSaveWorkingHours} className="w-full" variant="hero">
                Salvar Horários
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Galeria */}
        <TabsContent value="gallery" className="space-y-6">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Galeria de Fotos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Indicador de Limite */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Galeria de Fotos</h4>
                  <p className="text-sm text-muted-foreground">
                    {gallery.length}/5 fotos adicionadas
                  </p>
                </div>
                <Badge variant={gallery.length >= 5 ? "destructive" : "secondary"}>
                  {gallery.length >= 5 ? "Limite atingido" : `${5 - gallery.length} restantes`}
                </Badge>
              </div>

              {/* Área de Upload */}
              {gallery.length < 5 && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Adicionar Fotos</h3>
                    <p className="text-muted-foreground">
                      Mostre seu estabelecimento e trabalhos realizados ({5 - gallery.length} fotos restantes)
                    </p>
                    <div className="flex justify-center">
                      <Button variant="outline">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        Selecionar Fotos
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Galeria de Imagens */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleReplaceImage(image.id, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        Trocar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        Remover
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <Input
                        value={image.title}
                        onChange={(e) => {
                          setGallery(gallery.map(img => 
                            img.id === image.id ? { ...img, title: e.target.value } : img
                          ));
                        }}
                        className="text-sm bg-white/90 text-foreground"
                        placeholder="Título da foto"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Instagram Link para Portfolio */}
              <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">IG</span>
                  </div>
                  <h4 className="font-semibold">Portfolio no Instagram</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Conecte seu Instagram para que os clientes vejam seus trabalhos mais recentes
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={storeInfo.instagram}
                    onChange={(e) => setStoreInfo({...storeInfo, instagram: e.target.value})}
                    placeholder="@seuinstagram"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Políticas */}
        <TabsContent value="policies" className="space-y-6">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Políticas de Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cancellationPolicy">Política de Cancelamento</Label>
                  <Textarea
                    id="cancellationPolicy"
                    value={policies.cancellationPolicy}
                    onChange={(e) => setPolicies({...policies, cancellationPolicy: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="noShowPolicy">Política de Não Comparecimento</Label>
                  <Textarea
                    id="noShowPolicy"
                    value={policies.noShowPolicy}
                    onChange={(e) => setPolicies({...policies, noShowPolicy: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="latePolicy">Política de Atraso</Label>
                  <Textarea
                    id="latePolicy"
                    value={policies.latePolicy}
                    onChange={(e) => setPolicies({...policies, latePolicy: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="paymentPolicy">Política de Pagamento</Label>
                  <Textarea
                    id="paymentPolicy"
                    value={policies.paymentPolicy}
                    onChange={(e) => setPolicies({...policies, paymentPolicy: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Configurações Automáticas</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir Confirmação de Agendamento</Label>
                    <p className="text-sm text-muted-foreground">Clientes devem confirmar o agendamento</p>
                  </div>
                  <Switch
                    checked={policies.requireConfirmation}
                    onCheckedChange={(checked) => setPolicies({...policies, requireConfirmation: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Exigir Pré-pagamento</Label>
                    <p className="text-sm text-muted-foreground">Para clientes problemáticos</p>
                  </div>
                  <Switch
                    checked={policies.requirePrepayment}
                    onCheckedChange={(checked) => setPolicies({...policies, requirePrepayment: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir Agendamento Online</Label>
                    <p className="text-sm text-muted-foreground">Clientes podem agendar via app</p>
                  </div>
                  <Switch
                    checked={policies.allowOnlineBooking}
                    onCheckedChange={(checked) => setPolicies({...policies, allowOnlineBooking: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Confirmar Agendamentos Automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Não requer confirmação manual</p>
                  </div>
                  <Switch
                    checked={policies.autoConfirmBookings}
                    onCheckedChange={(checked) => setPolicies({...policies, autoConfirmBookings: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSavePolicies} className="w-full" variant="hero">
                Salvar Políticas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-professional">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Notificações de Agendamento</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email de Confirmação</Label>
                    <p className="text-sm text-muted-foreground">Enviar email quando agendamento for confirmado</p>
                  </div>
                  <Switch
                    checked={notifications.emailBookingConfirm}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookingConfirm: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email de Lembrete</Label>
                    <p className="text-sm text-muted-foreground">Enviar lembrete 24h antes do agendamento</p>
                  </div>
                  <Switch
                    checked={notifications.emailBookingReminder}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookingReminder: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS de Lembrete</Label>
                    <p className="text-sm text-muted-foreground">Enviar SMS 2h antes do agendamento</p>
                  </div>
                  <Switch
                    checked={notifications.smsBookingReminder}
                    onCheckedChange={(checked) => setNotifications({...notifications, smsBookingReminder: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Relatórios</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Relatório Diário</Label>
                    <p className="text-sm text-muted-foreground">Resumo das atividades do dia</p>
                  </div>
                  <Switch
                    checked={notifications.dailyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, dailyReport: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Relatório Semanal</Label>
                    <p className="text-sm text-muted-foreground">Análise semanal de desempenho</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReport: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Relatório Mensal</Label>
                    <p className="text-sm text-muted-foreground">Relatório completo mensal</p>
                  </div>
                  <Switch
                    checked={notifications.monthlyReport}
                    onCheckedChange={(checked) => setNotifications({...notifications, monthlyReport: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full" variant="hero">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSettings;