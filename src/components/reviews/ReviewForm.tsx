import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReviewFormProps {
  companyName: string;
  serviceName: string;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const ReviewForm = ({ companyName, serviceName, onSubmit, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Escreva pelo menos 10 caracteres no seu comentário');
      return;
    }

    onSubmit(rating, comment);
  };

  return (
    <Card className="shadow-professional">
      <CardHeader>
        <CardTitle>Avalie sua experiência</CardTitle>
        <p className="text-muted-foreground">
          {serviceName} em {companyName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="text-sm font-medium">Como foi o atendimento?</label>
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const starValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      (hoveredRating >= starValue || rating >= starValue)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                </button>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {rating === 1 && "Muito ruim"}
              {rating === 2 && "Ruim"}
              {rating === 3 && "Regular"}
              {rating === 4 && "Bom"}
              {rating === 5 && "Excelente"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium">Deixe um comentário</label>
          <Textarea
            placeholder="Conte como foi sua experiência..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2"
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} className="flex-1">
            Enviar Avaliação
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;