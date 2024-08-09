'use client'

import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function Stars({rating, totalReviews, size = 14}: {
    rating: number,
    totalReviews: number,
    size?: number
}){
    return (
        <div className='flex items-center'>
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={size}
                    className={cn('text-primary bg-transparent transition-all duration-300 ease-in-out', i <= rating ? "fill-primary text-primary" : "fill-muted text-muted")} />
            ))}
            <span>{totalReviews} reviews</span>
        </div>
    )
}