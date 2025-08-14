import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Review } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{review.clientName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{review.clientName}</p>
            <p className="text-sm text-muted-foreground">
              {review.serviceName} • {format(new Date(review.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
          ))}
          {Array.from({ length: 5 - review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
      </div>
      <p className="text-muted-foreground">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;