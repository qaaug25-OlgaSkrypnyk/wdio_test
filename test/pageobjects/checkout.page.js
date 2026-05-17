import Page from './page.js'

class CheckoutPage extends Page {

    get checkoutButton ()  { return $('[data-test="checkout"]') }
    get firstNameInput ()  { return $('[data-test="firstName"]') }
    get lastNameInput ()   { return $('[data-test="lastName"]') }
    get postalCodeInput () { return $('[data-test="postalCode"]') }
    get continueButton ()  { return $('[data-test="continue"]') }
    get finishButton ()    { return $('[data-test="finish"]') }
    get backHomeButton ()  { return $('[data-test="back-to-products"]') }
    get successMessage ()  { return $('[data-test="complete-header"]') }
    get summaryTotal ()    { return $('[data-test="total-label"]') }
    get checkoutInfo ()    { return $('.checkout_info') }
    get cartItemName ()    { return $('.inventory_item_name') }
    get cartItemPrice ()   { return $('.inventory_item_price') }

    open () { return super.open('checkout-step-one.html') }
}

export default new CheckoutPage()