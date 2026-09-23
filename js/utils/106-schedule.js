import { formatDate } from "../utils_helpers/formatDate.js";
import { Logger } from "../utils_helpers/logger.js";

export function  generateSchedule(LOAN_PARAMETERS, installmentDates, principalAmounts, interestAmounts, installment){

    const numberOfInstallments = LOAN_PARAMETERS.numberOfInstallments;
    const schedule = [];

    for (
        let installmentNumber = 1;
        installmentNumber <= numberOfInstallments;
        installmentNumber++
    ){
        const index = installmentNumber - 1;

        const finalDueDateAdjusted = formatDate(installmentDates[index].finalDueDateAdjusted);
        const principalComponent = principalAmounts[index].actualPrincipal;
        const interestComponent = interestAmounts[index].roundedInterest;
        const feesCharges = 
            installment[index].processingFee +
            installment[index].insuranceFee +
            installment[index].serviceFee +
            installment[index].otherCharges +
            installment[index].taxonFees;
        const finalInstallment = installment[index].finalInstallment;
        const closingPrincipal = principalAmounts[index].closingPrincipal;

        schedule.push({
            installmentNumber,
            finalDueDateAdjusted,
            principalComponent,
            interestComponent,
            feesCharges,
            finalInstallment,
            closingPrincipal
        })

    }

    Logger.info("106-schedule.js","generateSchedule", schedule);
    return schedule;

}