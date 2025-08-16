import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ReviewSystemProps {
  establishmentId: string;
  serviceId?: string;
  bookingId?: string;
  canReview?: boolean;
}

const ReviewSystem = ({ establishmentId, serviceId, bookingId, canReview = false }: ReviewSystemProps) => {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Maria Silva',
      rating: 5,
      comment: 'Excelente atendimento! Profissionais muito qualificados e ambiente acolhedor.',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: '2',
      userId: '2',
      userName: 'João Santos',
      rating: 4,
      comment: 'Serviço de qualidade, pontualidade impecável. Recomendo!',
      date: '2024-01-10',
      helpful: 8
    },
    {
      id: '3',
      userId: '3',
      userName: 'Ana Costa',
      rating: 5,
      comment: 'Fiquei muito satisfeita com o resultado. Voltarei com certeza.',
      date: '2024-01-05',
      helpful: 15
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(review => review.rating === star).length,
    percentage: (reviews.filter(review => review.rating === star).length / reviews.length) * 100
  }));

  const handleSubmitReview = () => {
    if (rating === 0 || comment.trim() === '') {
      toast.error('Por favor, adicione uma avaliação e comentário');
      return;
    }

    // Aqui integraria com o backend para salvar a avaliação
    toast.success('Avaliação enviada com sucesso!');
    setShowReviewForm(false);
    setRating(0);
    setComment('');
  };

  const renderStars = (rating: number, interactive = false, size = 'h-4 w-4') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= (interactive ? (hoveredStar || rating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Resumo das Avaliações */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Avaliações e Comentários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estatísticas Gerais */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(averageRating), false, 'h-5 w-5')}
                </div>
                <p className="text-muted-foreground mt-1">
                  {reviews.length} avaliação{reviews.length !== 1 ? 'ões' : ''}
                </p>
              </div>
            </div>

            {/* Distribuição das Estrelas */}
            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-8">{star}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botão para Avaliar */}
          {canReview && (
            <div className="mt-6 pt-4 border-t">
              <Button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                {showReviewForm ? 'Cancelar Avaliação' : 'Avaliar Serviço'}
              </Button>
            </div>
          )}

          {/* Formulário de Avaliação */}
          {showReviewForm && (
            <div className="mt-4 p-4 border rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sua Avaliação</label>
                {renderStars(rating, true, 'h-6 w-6')}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Comentário</label>
                <Textarea
                  placeholder="Conte sobre sua experiência..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSubmitReview} className="flex-1">
                  Enviar Avaliação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <Card className="shadow-professional">
        <CardHeader>
          <CardTitle>Comentários dos Clientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.map((review, index) => (
            <div key={review.id}>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{review.userName}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <Badge variant="secondary" className="text-xs">
                      {review.rating === 5 ? 'Excelente' : 
                       review.rating === 4 ? 'Muito Bom' : 
                       review.rating === 3 ? 'Bom' : 
                       review.rating === 2 ? 'Regular' : 'Ruim'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground">{review.comment}</p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Útil ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Responder
                    </Button>
                  </div>
                </div>
              </div>
              
              {index < reviews.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
          
          <div className="text-center mt-6">
            <Button variant="outline">Ver Mais Avaliações</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSystem;