export const getReviewAverage = (reviews: number[]) => {
    if(reviews.length === 0) return 0
    return reviews.reduce((acc, curr) => acc + curr, 0) / reviews.length
}