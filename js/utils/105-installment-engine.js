import { calculateInstallmentFee } from "../utils_helpers/calculateInstallmentFee.js";
import { Logger } from "../utils_helpers/logger.js";
import { roundValue } from "../utils_helpers/rounding.js";

export function generateInstallment(LOAN_PARAMETERS, installmentDates, principalAmounts, interestAmounts ) { 

    const numberOfInstallments = LOAN_PARAMETERS.numberOfInstallments;
    const feeApplicationTiming = LOAN_PARAMETERS.feeApplicationTiming;
    const processingFeeAmount = LOAN_PARAMETERS.processingFeeAmount;
    const insuranceFeeAmount = LOAN_PARAMETERS.insuranceFeeAmount;
    const serviceFeeAmount = LOAN_PARAMETERS.serviceFee;
    const otherChargesAmount = LOAN_PARAMETERS.otherCharges;
    const installment = [];

    for (
        let installmentNumber = 1;
        installmentNumber <= numberOfInstallments;
        installmentNumber++
    ) {
        const index = installmentNumber - 1;
        
        const principalComponent = principalAmounts[index].actualPrincipal;
        const interestComponent = interestAmounts[index].roundedInterest;
        const processingFee = calculateInstallmentFee(
            feeApplicationTiming, 
            installmentNumber, 
            processingFeeAmount, 
            numberOfInstallments
        );
        const insuranceFee = calculateInstallmentFee(
            feeApplicationTiming, 
            installmentNumber, 
            insuranceFeeAmount, 
            numberOfInstallments
        );
        const serviceFee = calculateInstallmentFee(
            feeApplicationTiming, 
            installmentNumber, 
            serviceFeeAmount, 
            numberOfInstallments
        );
        const otherCharges = calculateInstallmentFee(
            feeApplicationTiming, 
            installmentNumber, 
            otherChargesAmount, 
            numberOfInstallments
        );
        const taxonFees = LOAN_PARAMETERS.applyTax === "yes" ? (processingFee + insuranceFee + serviceFee + otherCharges) * LOAN_PARAMETERS.taxRate : 0;
        const totalUnrounded = principalComponent + interestComponent + processingFee + insuranceFee + serviceFee + otherCharges + taxonFees;
        const roundingResidual = totalUnrounded - roundValue(totalUnrounded, LOAN_PARAMETERS.roundingRule, LOAN_PARAMETERS.roundingDecimalPlaces);
        const finalInstallment = roundValue(totalUnrounded, LOAN_PARAMETERS.roundingRule, LOAN_PARAMETERS.roundingDecimalPlaces);
        const outstandingBalance = principalAmounts[index].closingPrincipal;

        installment.push({
            installmentNumber,
            principalComponent,
            interestComponent,
            processingFee,
            insuranceFee,
            serviceFee,
            otherCharges,
            taxonFees,
            totalUnrounded,
            roundingResidual,
            finalInstallment,
            outstandingBalance
        });
    }

    Logger.info("105-installment-engine.js","generateInstallment", installment);
    return installment;

}