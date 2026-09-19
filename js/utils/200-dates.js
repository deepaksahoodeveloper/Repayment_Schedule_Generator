function getDates(LOAN_PARAMETERS) {
    const dates = [];

    for (let i = 0; i < LOAN_PARAMETERS.numberOfInstallments; i++) {
        dates.push({
            inst: i + 1,
            expectedDueDateUnadjusted: getExpectedDueDate(
                LOAN_PARAMETERS.repaymentFrequency,
                LOAN_PARAMETERS.firstRepaymentDate,
                i + 1
            ),
            finalDueDate: getFinalAdjustedDueDate(
                expectedDueDateUnadjusted,
                LOAN_PARAMETERS.weekendHolidayHandling,
                LOAN_PARAMETERS.holidayList
            ),
        });
    }

    return dates;
}

const data = getDates(LOAN_PARAMETERS);

console.log(data);
