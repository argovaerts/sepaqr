/* Based on:
 * - https://github.com/efkann/iban-validator-js
 * - https://github.com/arhs/iban.js
 */

export class IBAN {
    static countryLengths = {
        AD: 24,
        AE: 23,
        AL: 28,
        AT: 20,
        AZ: 28,
        BA: 20,
        BE: 16,
        BG: 22,
        BH: 22,
        BI: 28,
        BR: 29,
        BY: 28,
        CH: 21,
        CR: 22,
        CY: 28,
        CZ: 24,
        DE: 22,
        DK: 18,
        DO: 28,
        EE: 20,
        EG: 29,
        ES: 24,
        LC: 32,
        FI: 18,
        FO: 18,
        FR: 27,
        GB: 22,
        GE: 22,
        GI: 23,
        GL: 18,
        GR: 27,
        GT: 28,
        HR: 21,
        HU: 28,
        IE: 22,
        IL: 23,
        IQ: 23,
        IS: 26,
        IT: 27,
        JO: 30,
        KW: 30,
        KZ: 20,
        LB: 28,
        LI: 21,
        LT: 20,
        LU: 20,
        LV: 21,
        LY: 25,
        MC: 27,
        MD: 24,
        ME: 22,
        MK: 19,
        MR: 27,
        MT: 31,
        MU: 30,
        NL: 18,
        NO: 15,
        PK: 24,
        PL: 28,
        PS: 29,
        PT: 25,
        QA: 29,
        RO: 24,
        RS: 22,
        SA: 24,
        SC: 31,
        SD: 18,
        SE: 24,
        SI: 19,
        SK: 24,
        SM: 27,
        ST: 25,
        SV: 28,
        TL: 23,
        TN: 24,
        TR: 26,
        UA: 29,
        VA: 22,
        VG: 24,
        XK: 20,
    }
    static NON_ALPHANUM = /[^a-zA-Z0-9]/g

    static isValid(input) {
        if (typeof input !== 'string') {
            return false
        }
        const iban = IBAN.electronicFormat(input)
        const countryCode = iban.slice(0, 2)
        if (!Object.keys(IBAN.countryLengths).includes(countryCode)) {
            return false
        }
        if (IBAN.countryLengths[countryCode] !== iban.length) {
            return false
        }

        const ibanMovedInitials = `${iban.slice(4)}${iban.slice(0, 4)}`
        const lettersRegex = /[A-Z]/g
        const onlyDigits = ibanMovedInitials.replace(lettersRegex, (match) =>
            IBAN.letterToTwoDigits(match)
        )
        return IBAN.mod97(onlyDigits) === 1
    }

    static electronicFormat(iban) {
        return iban.replace(IBAN.NON_ALPHANUM, '').toUpperCase()
    }

    static mod97(numStr) {
        if (typeof numStr !== 'string') {
            throw new Error('`numStr` parameter must be a string.')
        }
        let checksum = numStr.slice(0, 2)
        let fragment = ''
        for (let offset = 2; offset < numStr.length; offset += 7) {
            fragment = checksum + numStr.substring(offset, offset + 7)
            checksum = parseInt(fragment, 10) % 97
        }
        return checksum
    }

    static letterToTwoDigits(letter) {
        if (typeof letter !== 'string') {
            throw new Error('`letter` parameter must be a string.')
        }
        return letter.charCodeAt(0) - 55
    }
}