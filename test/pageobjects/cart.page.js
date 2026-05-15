import { $ } from '@wdio/globals'
import Page from './page.js'

class CartPage extends Page {

    get cartIcon () {
        return $('.shopping_cart_link')
    }

    get cartBadge () {
        return $('.shopping_cart_badge')
    }

    get cartItems () {
        return $$('.cart_item')
    }

    get errorMessage () {
    return $('[data-test="error"]');
    }

    open () {
        return super.open('cart.html')
    }
}

export default new CartPage()