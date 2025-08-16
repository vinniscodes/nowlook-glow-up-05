import { useState } from 'react';
import { CreditCard, QrCode, Banknote, Shield, Check, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface PaymentProps {
  amount: number;
  bookingId: string;
  onPaymentSuccess?: () => void;
  onPaymentCancel?: () => void;
}

interface PaymentHistory {
  id: string;
  amount: number;
  method: 'card' | 'pix' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  date: string;
  description: string;
}

const PaymentSystem = ({ amount, bookingId, onPaymentSuccess, onPaymentCancel }: PaymentProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixCode, setShowPixCode] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  // Mock de histórico de pagamentos
  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      amount: 45.00,
      method: 'card',
      status: 'completed',
      date: '2024-01-15',
      description: 'Corte de cabelo - Salão Elegance'
    },
    {
      id: '2',
      amount: 80.00,
      method: 'pix',
      status: 'completed',
      date: '2024-01-10',
      description: 'Massagem relaxante - Spa Bem-Estar'
    },
    {
      id: '3',
      amount: 120.00,
      method: 'card',
      status: 'pending',
      date: '2024-01-20',
      description: 'Tratamento facial - Clínica Beleza'
    }
  ]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = cleaned.match(/\d{4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardInputChange = (field: string, value: string) => {
    if (field === 'number') {
      value = formatCardNumber(value);
    } else if (field === 'expiry') {
      value = formatExpiry(value);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (paymentMethod === 'card') {
        // Simular integração com Stripe
        toast.success('Pagamento processado com sucesso!');
        onPaymentSuccess?.();
      } else if (paymentMethod === 'pix') {
        setShowPixCode(true);
        toast.info('QR Code PIX gerado! Você tem 15 minutos para pagar.');
      } else {
        toast.success('Agendamento confirmado! Pagamento será feito no local.');
        onPaymentSuccess?.();
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Falhou</Badge>;
      case 'cancelled':
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Cancelado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <QrCode className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  if (showPixCode) {
    return (
      <Card className="shadow-professional max-w-md mx-auto">
        <CardHeader className="text-center">
          <QrCode className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle>Pagamento PIX</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Escaneie o QR Code ou copie o código PIX
            </p>
            
            {/* Mock QR Code */}
            <div className="bg-white p-4 border-2 border-dashed border-primary rounded-lg">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                <QrCode className="h-24 w-24 text-primary" />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-mono break-all">
                00020126950014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540554.005802BR5925NOWLOOK SERVICOS LTDA6009SAO PAULO62070503***6304ABCD
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText('00020126950014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000520400005303986540554.005802BR5925NOWLOOK SERVICOS LTDA6009SAO PAULO62070503***6304ABCD');
                  toast.success('Código PIX copiado!');
                }}
              >
                Copiar Código PIX
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-2xl font-bold text-primary">R$ {amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                O pagamento será confirmado automaticamente
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowPixCode(false)}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button 
              onClick={onPaymentCancel}
              variant="ghost"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário de Pagamento */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Pagamento Seguro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Valor */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total a pagar</p>
            <p className="text-3xl font-bold text-primary">R$ {amount.toFixed(2)}</p>
          </div>

          {/* Método de Pagamento */}
          <div>
            <Label className="text-base font-medium">Forma de Pagamento</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as any)}
              className="mt-3"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    Cartão de Crédito
                  </Label>
                  <Badge variant="secondary">Instantâneo</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="pix" id="pix" />
                  <QrCode className="h-5 w-5" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    PIX
                  </Label>
                  <Badge variant="secondary">Instantâneo</Badge>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="cash" id="cash" />
                  <Banknote className="h-5 w-5" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    Dinheiro (no local)
                  </Label>
                  <Badge variant="outline">No atendimento</Badge>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Formulário do Cartão */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => handleCardInputChange('number', e.target.value)}
                  maxLength={19}
                />
              </div>
              
              <div>
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="João Silva"
                  value={cardData.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Validade</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cardCvv">CVV</Label>
                  <Input
                    id="cardCvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <span className="font-medium">PIX</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Após confirmar, você receberá um QR Code para realizar o pagamento PIX.
              </p>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-5 w-5 text-green-600" />
                <span className="font-medium">Pagamento no Local</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O pagamento será realizado diretamente no estabelecimento.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={processPayment}
              disabled={isProcessing}
              className="flex-1"
              variant="hero"
            >
              {isProcessing ? 'Processando...' : `Pagar R$ ${amount.toFixed(2)}`}
            </Button>
            <Button 
              variant="outline" 
              onClick={onPaymentCancel}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Pagamentos */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhum pagamento realizado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentHistory.map((payment, index) => (
                <div key={payment.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getMethodIcon(payment.method)}
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {payment.amount.toFixed(2)}</p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                  {index < paymentHistory.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSystem;