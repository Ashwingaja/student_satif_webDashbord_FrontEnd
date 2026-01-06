'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    interactive?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({
    rating,
    onRatingChange,
    interactive = false,
    size = 'md'
}: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (value: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    disabled={!interactive}
                    className={cn(
                        'transition-all duration-200',
                        interactive && 'hover:scale-110 cursor-pointer',
                        !interactive && 'cursor-default'
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            'transition-colors duration-200',
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-600'
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
