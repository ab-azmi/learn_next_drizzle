export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD'
    }).format(price)
}