import { $ } from '@wdio/globals'
import Page from './page.js'

class InventoryPage extends Page {

    get burgerMenu () {
        return $('#react-burger-menu-btn')
    }

    // Кнопка Logout в меню
    get logoutButton () {
        return $('#logout_sidebar_link')
    }

    get inventoryList () {
        return $('.inventory_list')
    }

    get cartIcon () {
        return $('.shopping_cart_link')
    }

    get sortDropdown () {
    return $('.product_sort_container')
    }

    get itemNames () {
    return $$('.inventory_item_name')
    }

    get itemPrices () {
    return $$('.inventory_item_price')
    }

    get cartBadge () {
        return $('.shopping_cart_badge')
    }

    open () {
        return super.open('inventory.html')
    }
}

export default new InventoryPage()