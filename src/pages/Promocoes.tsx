import { useEffect } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Promocoes() {
  useEffect(() => { document.title = "Promoções | NowLook"; }, []);

  const promos = [
    { id: 1, title: "Corte + Barba", desc: "Combo especial de sexta-feira.", off: "20%" },
    { id: 2, title: "Manicure Gel", desc: "Pacote mensal com 4 sessões.", off: "15%" },
    { id: 3, title: "Spa Day", desc: "Massagem + limpeza de pele.", off: "25%" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container py-6 sm:py-10 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold animate-fade-in">Promoções</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">Ofertas selecionadas para você relaxar e economizar.</p>
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => (
            <Card key={p.id} className="hover-scale animate-enter">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">{p.desc}</p>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:justify-between">
                  <span className="text-xs sm:text-sm rounded-full bg-secondary px-2 sm:px-3 py-1 text-secondary-foreground font-medium">{p.off} OFF</span>
                  <Button variant="hero" size="sm" className="w-full sm:w-auto">
                    <span className="hidden sm:inline">Aproveitar</span>
                    <span className="sm:hidden">Aproveitar Oferta</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
