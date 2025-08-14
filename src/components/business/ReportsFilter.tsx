import { useState } from 'react';
import { Filter, Download, Calendar, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface FilterOptions {
  dateRange: { from: Date; to: Date } | undefined;
  professional: string;
  service: string;
  paymentStatus: string;
  clientType: string;
}

interface ReportsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  onExport: (format: 'pdf' | 'excel') => void;
}

const ReportsFilter = ({ onFilterChange, onExport }: ReportsFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: undefined,
    professional: 'all',
    service: 'all',
    paymentStatus: 'all',
    clientType: 'all'
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Contar filtros ativos
    let count = 0;
    if (newFilters.dateRange) count++;
    if (newFilters.professional !== 'all') count++;
    if (newFilters.service !== 'all') count++;
    if (newFilters.paymentStatus !== 'all') count++;
    if (newFilters.clientType !== 'all') count++;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      dateRange: undefined,
      professional: 'all',
      service: 'all',
      paymentStatus: 'all',
      clientType: 'all'
    };
    setFilters(clearedFilters);
    setActiveFiltersCount(0);
    onFilterChange(clearedFilters);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    onExport(format);
    toast.success(`Relatório ${format.toUpperCase()} exportado com sucesso!`);
  };

  return (
    <Card className="shadow-professional">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Filtros de Relatório</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">
                {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Salvar Filtro
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <DatePickerWithRange
              date={filters.dateRange}
              onDateChange={(dateRange) => updateFilter('dateRange', dateRange)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Profissional</label>
            <Select value={filters.professional} onValueChange={(value) => updateFilter('professional', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="joao">João Silva</SelectItem>
                <SelectItem value="pedro">Pedro Santos</SelectItem>
                <SelectItem value="carlos">Carlos Lima</SelectItem>
                <SelectItem value="lucas">Lucas Oliveira</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Serviço</label>
            <Select value={filters.service} onValueChange={(value) => updateFilter('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="corte">Corte</SelectItem>
                <SelectItem value="barba">Barba</SelectItem>
                <SelectItem value="corte-barba">Corte + Barba</SelectItem>
                <SelectItem value="sobrancelha">Sobrancelha</SelectItem>
                <SelectItem value="tratamento">Tratamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status Pagamento</label>
            <Select value={filters.paymentStatus} onValueChange={(value) => updateFilter('paymentStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Em Atraso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Cliente</label>
            <Select value={filters.clientType} onValueChange={(value) => updateFilter('clientType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="returning">Recorrentes</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Ações de Export */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Faturamento Filtrado: R$ 15.750</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">125 Agendamentos</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">45 Clientes únicos</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsFilter;