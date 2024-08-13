export default function betweenWeeks(dateToCheck: Date, betweenDate1: number, betweenDate2:number){
    //define today's date
    const today = new Date();
    //set the upper and lower limit of the date range
    const targetDate1 = new Date(today)
    const targetDate2 = new Date(today)

    //set the target date to the number of days ago
    targetDate1.setDate(targetDate1.getDate() - betweenDate1)
    targetDate2.setDate(targetDate2.getDate() - betweenDate2)

    //check if the date to check is between the target dates
    return dateToCheck >= targetDate1 && dateToCheck <= targetDate2
}