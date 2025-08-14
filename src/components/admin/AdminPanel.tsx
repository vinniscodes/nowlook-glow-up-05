import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import CompanyManagement from './CompanyManagement';
import SupportTickets from './SupportTickets';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="support">Suporte</TabsTrigger>
            <TabsTrigger value="transactions">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard onNavigate={handleNavigate} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="companies">
            <CompanyManagement />
          </TabsContent>

          <TabsContent value="support">
            <SupportTickets />
          </TabsContent>

          <TabsContent value="transactions">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Relatório Financeiro</h3>
              <p className="text-muted-foreground">Em desenvolvimento - Integração com Stripe</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;