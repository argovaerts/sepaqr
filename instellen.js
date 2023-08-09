document.addEventListener('DOMContentLoaded', e => {
    const org_name = localStorage.getItem('org_name') 
    if (org_name) {
        document.getElementById('org_name').value = org_name
    }

    const org_iban = localStorage.getItem('org_iban') 
    if (org_iban) {
        document.getElementById('org_iban').value = org_iban
    }

    const org_payconiq_product_id = localStorage.getItem('org_payconiq_product_id') 
    if (org_payconiq_product_id) {
        document.getElementById('org_payconiq_product_id').value = org_payconiq_product_id
    }

    document.getElementById('org_settings_form')
    .addEventListener('submit', e => {
        e.preventDefault()

        const fd = new FormData(e.target)

        fd.forEach((value, key) => {
            localStorage.setItem(key,value)
        })

        document.getElementById('org_settings_form_success').classList.remove('hidden')

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500)
    })
})