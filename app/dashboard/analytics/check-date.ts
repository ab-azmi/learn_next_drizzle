export default function checkDate(dateToCheck: Date, daysAgo: number){
    //define today's date
    const today = new Date();
    //set hours to 0
    today.setHours(0, 0, 0, 0)

    const targetDate = new Date(today)
    //set the target date to the number of days ago
    targetDate.setDate(targetDate.getDate() - daysAgo)

    return (
        //check if the date to check is the same as the target date
        dateToCheck.getDate() === targetDate.getDate() && 
        dateToCheck.getMonth() ===  targetDate.getMonth() &&
        dateToCheck.getFullYear() === targetDate.getFullYear()
    )
}