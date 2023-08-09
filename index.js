//import { QRCode } from './node_modules/davidshimjs-qrcodejs/qrcode.js'

import { SEPAQR } from "./classes/SEPAQR.js"

document.addEventListener('DOMContentLoaded', e => {
    if (localStorage.getItem('org_name') && localStorage.getItem('org_iban')) {
        const display = part => {
            switch (part) {
                case 'payconiq_result':
                    document.getElementById('sepa_form_section').classList.add('hidden')
                    document.getElementById('sepa_qrcode_section').classList.add('hidden')
                    document.getElementById('payconiq_qrcode_section').classList.remove('hidden')
                    document.getElementById('payconiq_button_section').classList.add('hidden')
                    document.getElementById('sepa_button_section').classList.remove('hidden')
                    document.getElementById('reset_button_section').classList.remove('hidden')
                    break
                case 'sepa_result':
                    document.getElementById('sepa_form_section').classList.add('hidden')
                    document.getElementById('sepa_qrcode_section').classList.remove('hidden')
                    document.getElementById('payconiq_qrcode_section').classList.add('hidden')

                    if (localStorage.getItem('org_payconiq_product_id')) {
                        document.getElementById('payconiq_button_section').classList.remove('hidden')
                    }
                    
                    document.getElementById('sepa_button_section').classList.add('hidden')
                    document.getElementById('reset_button_section').classList.remove('hidden')
                    break
                default:
                    document.getElementById('sepa_form_section').classList.remove('hidden')
                    document.getElementById('sepa_qrcode_section').classList.add('hidden')
                    document.getElementById('payconiq_qrcode_section').classList.add('hidden')
                    document.getElementById('payconiq_button_section').classList.add('hidden')
                    document.getElementById('sepa_button_section').classList.add('hidden')
                    document.getElementById('reset_button_section').classList.add('hidden')
                    break
            }
        }

        document.getElementById('sepa_form')
            .addEventListener('submit', e => {
                e.preventDefault()

                const fd = new FormData(e.target)

                const qr_data = SEPAQR.generate({
                    name: localStorage.getItem('org_name'),
                    iban: localStorage.getItem('org_iban'),
                    amount: parseFloat(fd.get('amount')),
                    unstructuredReference: new Date().toJSON()
                })

                const sepa_qrcode_section = document.getElementById('sepa_qrcode_section')
                const sepa_qrcode_aside = document.createElement('aside')
                new QRCode(sepa_qrcode_aside, qr_data)
                sepa_qrcode_section.innerHTML = '<header><h1>SEPA <mark>QR</mark></h1></header>'
                sepa_qrcode_section.appendChild(sepa_qrcode_aside)

                display('sepa_result')
            })

        document.getElementById('payconiq_button')
            .addEventListener('click', e => {
                const payconiq_qrcode_section = document.getElementById('payconiq_qrcode_section')
                const payconiq_qrcode_aside = document.createElement('aside')
                
                new QRCode(payconiq_qrcode_aside, 'https://payconiq.com/merchant/1/' + localStorage.getItem('org_payconiq_product_id'))
                payconiq_qrcode_section.innerHTML = '<header><h1>Pay<mark>coniq</mark></h1></header>'
                payconiq_qrcode_section.appendChild(payconiq_qrcode_aside)

                display('payconiq_result')
            })

        document.getElementById('sepa_button')
            .addEventListener('click', e => {
                display('sepa_result')
            })

        document.getElementById('reset_button')
            .addEventListener('click', e => {
                display('sepa_form')
            })
    } else {
        window.location.replace('instellen.html');
    }
})