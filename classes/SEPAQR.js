import { IBAN } from "./IBAN.js"

/* Based on:
 * - https://github.com/derhuerst/sepa-payment-qr-code
 */

export class SEPAQR {
    static SERVICE_TAG = 'BCD'
    static VERSION = '002'
    static CHARACTER_SET = 1
    static IDENTIFICATION_CODE = 'SCT'

    static assertNonEmptyString (val, name) {
        if ('string' !== typeof val || !val) {
            throw new Error(name + ' must be a non-empty string.')
        }
    }

    static generate (data) {
        if (!data) throw new Error('data must be an object.')

        // > AT-21 Name of the Beneficiary
        SEPAQR.assertNonEmptyString(data.name, 'data.name')
        if (data.name.length > 70) throw new Error('data.name must have <=70 characters')

        // > AT-23 BIC of the Beneficiary Bank
        if ('bic' in data) {
            SEPAQR.assertNonEmptyString(data.bic, 'data.bic')
            if (data.bic.length > 11) throw new Error('data.bic must have <=11 characters')
            // todo: validate more?
        }

        // > AT-20 Account number of the Beneficiary
        // > Only IBAN is allowed.
        SEPAQR.assertNonEmptyString(data.iban, 'data.iban')
        if (!IBAN.isValid(data.iban)) {
            throw new Error('data.iban must be a valid iban code.')
        }

        // > AT-04 Amount of the Credit Transfer in Euro
        if ('number' !== typeof data.amount) throw new Error('data.amount must be a number.')
        if (data.amount < 0.01 || data.amount > 999999999.99) {
            throw new Error('data.amount must be >=0.01 and <=999999999.99.')
        }

        // > AT-44 Purpose of the Credit Transfer
        if ('purposeCode' in data) {
            SEPAQR.assertNonEmptyString(data.purposeCode, 'data.purposeCode')
            if (data.purposeCode.length > 4) throw new Error('data.purposeCode must have <=4 characters')
            // todo: validate against AT-44
        }

        // > AT-05 Remittance Information (Structured)
        // > Creditor Reference (ISO 11649 RF Creditor Reference may be used)
        if ('structuredReference' in data) {
            SEPAQR.assertNonEmptyString(data.structuredReference, 'data.structuredReference')
            if (data.structuredReference.length > 35) throw new Error('data.structuredReference must have <=35 characters')
            // todo: validate against AT-05
        }
        // > AT-05 Remittance Information (Unstructured)
        if ('unstructuredReference' in data) {
            SEPAQR.assertNonEmptyString(data.unstructuredReference, 'data.unstructuredReference')
            if (data.unstructuredReference.length > 140) throw new Error('data.unstructuredReference must have <=140 characters')
        }
        if (('structuredReference' in data) && ('unstructuredReference' in data)) {
            throw new Error('Use either data.structuredReference or data.unstructuredReference.')
        }

        // > Beneficiary to originator information
        if ('information' in data) {
            SEPAQR.assertNonEmptyString(data.information, 'data.information')
            if (data.information.length > 70) throw new Error('data.information must have <=70 characters')
        }

        return [
            SEPAQR.SERVICE_TAG,
            SEPAQR.VERSION,
            SEPAQR.CHARACTER_SET,
            SEPAQR.IDENTIFICATION_CODE,
            data.bic,
            data.name,
            IBAN.electronicFormat(data.iban),
            'EUR' + data.amount.toFixed(2),
            data.purposeCode || '',
            data.structuredReference || '',
            data.unstructuredReference || '',
            data.information || ''
        ].join('\n')
    }
}