
function validateDateRange(start, end) {
    if (start > end) {
        throw new Error("Start date must be before end date.");
    }
}


function isWorkingDay(date) {
    return date.getDay() !== 5;
}



function getWorkingDaysInMonth(year, month, start, end) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDaysInMonth = 0;
    let workedDaysInRange = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        if (isWorkingDay(currentDate)) {
            workingDaysInMonth++;
            if (currentDate >= start && currentDate <= end) {
                workedDaysInRange++;
            }
        }
    }

    return { workingDaysInMonth, workedDaysInRange };
}


function calculateMonthlyTarget(workedDays, dailyTarget) {
    return workedDays * dailyTarget;
}


function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    validateDateRange(start, end);

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dailyTarget = totalAnnualTarget / 365; 

    let totalTarget = 0;
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
        const startMonth = year === start.getFullYear() ? start.getMonth() : 0;
        const endMonth = year === end.getFullYear() ? end.getMonth() : 11;

        for (let month = startMonth; month <= endMonth; month++) {
            const { workingDaysInMonth, workedDaysInRange } = getWorkingDaysInMonth(year, month, start, end);
            daysExcludingFridays.push(workingDaysInMonth);
            daysWorkedExcludingFridays.push(workedDaysInRange);

            const monthlyTarget = calculateMonthlyTarget(workedDaysInRange, dailyTarget);
            monthlyTargets.push(monthlyTarget);
            totalTarget += monthlyTarget;
        }
    }

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget,
        averageDailyTarget: calculateAverageDailyTarget(totalTarget, totalDays)
    };
}


function calculateAverageDailyTarget(totalTarget, totalDays) {
    return totalDays > 0 ? totalTarget / totalDays : 0;
}

const result = calculateTotalTarget('2022-07-2', '2024-04-30', 2011);
console.log(result);
