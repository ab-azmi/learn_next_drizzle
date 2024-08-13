import checkDate from "./check-date"

export const weeklyChart = (chartItems: {date: Date, revenue: number}[]) => {
    return [
        {
            date: '6 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 6))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: '5 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 5))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: '4 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 4))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: '3 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 3))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: '2 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 2))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: '1 dasy ago',
            revenue: chartItems.filter((order) => checkDate(order.date, 1))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
        {
            date: 'today',
            revenue: chartItems.filter((order) => checkDate(order.date, 0))
                .reduce((acc, price) => acc + price.revenue, 0)
        },
    ]
}