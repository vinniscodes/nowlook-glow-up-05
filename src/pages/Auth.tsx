import { useEffect } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthInfo() {
  useEffect(() => { document.title = "Autenticação | Mavinda"; }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container py-10">
        <Card className="max-w-2xl mx-auto animate-enter">
          <CardHeader>
            <CardTitle>Autenticação</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Para habilitar login, cadastro e agendamentos protegidos, conecte seu projeto ao Supabase pela interface do Lovable (botão verde "Supabase" no topo direito) e volte aqui. Eu implementarei autenticação completa (email/senha), perfis e regras de acesso.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
