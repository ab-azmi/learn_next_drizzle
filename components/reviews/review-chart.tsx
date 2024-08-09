'use client'

import { ReviewWithUser } from "@/lib/infer-types"
import { Card, CardDescription, CardTitle } from "../ui/card"
import Stars from "./stars"
import { getReviewAverage } from "@/lib/review-average"
import { useMemo } from "react"
import { Progress } from "../ui/progress"

export default function ReviewChart({ reviews }: { reviews: ReviewWithUser[] }) {
    const totalRating = getReviewAverage(reviews.map((review) => review.rating))
    const getRatingByStars = useMemo(() => {
        const ratingValues = Array.from({ length: 5 }, () => 0);
        const totalReviews = reviews.length;

        reviews.forEach(review => {
            const starIndex = review.rating -1;
            if (starIndex >= 0 && starIndex < 5) {
                ratingValues[starIndex] += 1;
            }
        })
        return ratingValues.map((rating) => (rating / totalReviews) * 100);

    }, [reviews])

    return (
        <Card className="flex flex-col p-8 gap-4">
            <div className="flex flex-col gap-2">
                <CardTitle>Product Rating:</CardTitle>
                <Stars rating={totalRating} size={18} totalReviews={reviews.length} />
                <CardDescription>
                    {(totalRating)} out of 5
                </CardDescription>
            </div>
            {getRatingByStars.map((rating, index) => (
                <div key={index} className="flex gap-2 justify-between items-center">
                    <p className="text-xs font-medium flex gap-1">
                        {index+1}
                    </p>
                    <Progress value={rating} />
                </div>
            ))}
        </Card>
    )
}