import Page from './page.js'

class InventoryPage extends Page {

    get burgerMenu () {
        return $('#react-burger-menu-btn')
    }

    get logoutButton () {
        return $('#logout_sidebar_link')
    }

    get sidebarMenu () {
        return $('.bm-menu-wrap')
    }

    get sidebarInventoryLink () {
        return $('#inventory_sidebar_link')
    }

    get sidebarAboutLink () {
        return $('#about_sidebar_link')
    }

    get sidebarResetLink () {
        return $('#reset_sidebar_link')
    }

    get inventoryList () {
        return $('.inventory_list')
    }

    get cartIcon () {
        return $('.shopping_cart_link')
    }

    get cartBadge () {
        return $('.shopping_cart_badge')
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

    get firstItemName () {
        return $('.inventory_item_name')
    }

    get firstAddToCartButton () {
        return $('button.btn_inventory')
    }

    get twitterLink () {
        return $('.social_twitter a')
    }

    get facebookLink () {
        return $('.social_facebook a')
    }

    get linkedinLink () {
        return $('.social_linkedin a')
    }

    open () {
        return super.open('inventory.html')
    }
}

export default new InventoryPage()