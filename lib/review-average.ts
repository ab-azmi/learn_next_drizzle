export const getReviewAverage = (reviews: number[]) => {
    console.log(reviews)
    if(reviews.length === 0) return 0
    return reviews.reduce((acc, curr) => acc + curr, 0) / reviews.length
}