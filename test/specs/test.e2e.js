import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import InventoryPage from '../pageobjects/inventory.page.js'
import CartPage from '../pageobjects/cart.page.js' 
import CheckoutPage from '../pageobjects/checkout.page.js'



describe('Login functionality', () => {

    it('TC-1: should login with valid credentials', async () => {
        await LoginPage.open()

        await LoginPage.login('standard_user', 'secret_sauce')

        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

        await expect($('.inventory_list')).toBeDisplayed()
        await expect($('.shopping_cart_link')).toBeDisplayed()
    })

    it('TC-2: should show error with invalid password', async () => {

    await LoginPage.open()

    await LoginPage.inputUsername.setValue('standard_user')

    await LoginPage.inputPassword.setValue('wrong_password')

    await LoginPage.btnSubmit.click()

    await expect(LoginPage.errorMessage).toBeDisplayed()

    await expect(LoginPage.errorMessage).toHaveText(
        'Epic sadface: Username and password do not match any user in this service'
    )

    await expect(LoginPage.inputUsername).toHaveAttr('class', expect.stringContaining('input_error'))
    await expect(LoginPage.inputPassword).toHaveAttr('class', expect.stringContaining('input_error'))

    const icons = await LoginPage.errorIcons
    await expect(icons).toHaveLength(2)
    for (const icon of icons) {
        await expect(icon).toBeDisplayed()
    }
})

    it('TC-3: should show error for locked user', async () => {

    await LoginPage.open()

    await LoginPage.inputUsername.setValue('locked_out_user')

    await LoginPage.inputPassword.setValue('secret_sauce')

    await LoginPage.btnSubmit.click()

    await expect(LoginPage.errorMessage).toBeDisplayed()

    await expect(LoginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
    )

    await expect(LoginPage.inputUsername).toHaveAttr('class', expect.stringContaining('input_error'))
    await expect(LoginPage.inputPassword).toHaveAttr('class', expect.stringContaining('input_error'))

    const icons = await LoginPage.errorIcons
    await expect(icons).toHaveLength(2)
    for (const icon of icons) {
        await expect(icon).toBeDisplayed()
    }
})

    it('TC-4: should logout successfully', async () => {

    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

    await InventoryPage.burgerMenu.click()

    await expect($('.bm-menu-wrap')).toBeDisplayed()

    await expect($('#inventory_sidebar_link')).toBeDisplayed()
    await expect($('#about_sidebar_link')).toBeDisplayed()
    await expect($('#logout_sidebar_link')).toBeDisplayed()
    await expect($('#reset_sidebar_link')).toBeDisplayed()

    await InventoryPage.logoutButton.click()

    await expect(browser).toHaveUrl('https://www.saucedemo.com/')
    await expect(LoginPage.inputUsername).toHaveValue('')
    await expect(LoginPage.inputPassword).toHaveValue('')
})

   it('TC-5: should save card after logout', async () => {

    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

    const firstItemName = await $('.inventory_item_name').getText()
    await $('button.btn_inventory').click()
    await expect(CartPage.cartBadge).toHaveText('1')

    await InventoryPage.burgerMenu.click()

    await expect($('.bm-menu-wrap')).toBeDisplayed()

    await expect($('#inventory_sidebar_link')).toBeDisplayed()
    await expect($('#about_sidebar_link')).toBeDisplayed()
    await expect($('#logout_sidebar_link')).toBeDisplayed()
    await expect($('#reset_sidebar_link')).toBeDisplayed()

    await InventoryPage.logoutButton.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/')
    await expect(LoginPage.inputUsername).toHaveValue('')
    await expect(LoginPage.inputPassword).toHaveValue('')

    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

    await expect(InventoryPage.inventoryList).toBeDisplayed()
    await expect(InventoryPage.cartIcon).toBeDisplayed()
    
    await CartPage.cartIcon.click()

    const items = await CartPage.cartItems
    await expect(items).toHaveLength(1)
    await expect($('.inventory_item_name')).toHaveText(firstItemName)

})

   it('TC-6: should sort items', async () => {
    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')


    await InventoryPage.sortDropdown.selectByVisibleText('Name (A to Z)')
    const namesAZ = []
    for (const el of await $$('.inventory_item_name')) {
        namesAZ.push(await el.getText())
    }
    await expect(namesAZ).toEqual([...namesAZ].sort())

    await InventoryPage.sortDropdown.selectByVisibleText('Name (Z to A)')
    const namesZA = []
    for (const el of await $$('.inventory_item_name')) {
        namesZA.push(await el.getText())
    }
    await expect(namesZA).toEqual([...namesZA].sort().reverse())

    await InventoryPage.sortDropdown.selectByVisibleText('Price (low to high)')
    const pricesLH = []
    for (const el of await $$('.inventory_item_price')) {
        pricesLH.push(parseFloat((await el.getText()).replace('$', '')))
    }
    await expect(pricesLH).toEqual([...pricesLH].sort((a, b) => a - b))

    await InventoryPage.sortDropdown.selectByVisibleText('Price (high to low)')
    const pricesHL = []
    for (const el of await $$('.inventory_item_price')) {
        pricesHL.push(parseFloat((await el.getText()).replace('$', '')))
    }
    await expect(pricesHL).toEqual([...pricesHL].sort((a, b) => b - a))
})

   it('TC-7: footer social links check', async () => {
    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

     const twitterLink = await $('.social_twitter a')
    await twitterLink.click()

    await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
    const handles = await browser.getWindowHandles()
    await browser.switchToWindow(handles[1])
    await expect(browser).toHaveUrl(expect.stringContaining('x.com'))

    await browser.closeWindow()
    await browser.switchToWindow(handles[0])

    const facebookLink = await $('.social_facebook a')
    await facebookLink.click()
    await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
    const handles2 = await browser.getWindowHandles()
    await browser.switchToWindow(handles2[1])
    await expect(browser).toHaveUrl(expect.stringContaining('facebook.com'))
    await browser.closeWindow()
    await browser.switchToWindow(handles2[0])

    const linkedinLink = await $('.social_linkedin a')
    await linkedinLink.click()
    await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
    const handles3 = await browser.getWindowHandles()
    await browser.switchToWindow(handles3[1])
    await expect(browser).toHaveUrl(expect.stringContaining('linkedin.com'))
    await browser.closeWindow()
    await browser.switchToWindow(handles3[0])
})

    it('TC-8: should complete valid checkout', async () => {
    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')

    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

    await CartPage.cartIcon.click()

    await browser.url('https://www.saucedemo.com/cart.html')
    const removeButtons = await $$('[data-test*="remove"]')
    for (const btn of removeButtons) {
        await btn.click()
    }

    await browser.url('https://www.saucedemo.com/inventory.html')

    const firstItemName = await $('.inventory_item_name').getText()
    const firstItemPrice = await $('.inventory_item_price').getText()
    await $('button.btn_inventory').click()
    await expect(CartPage.cartBadge).toHaveText('1')

    await CartPage.cartIcon.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html')
    await expect($('.inventory_item_name')).toHaveText(firstItemName)

    await CheckoutPage.checkoutButton.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html')
    await expect($('.checkout_info')).toBeDisplayed()

    await CheckoutPage.firstNameInput.setValue('Olga')
    await CheckoutPage.lastNameInput.setValue('Skryp')
    await CheckoutPage.postalCodeInput.setValue('12345')

    await CheckoutPage.continueButton.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html')
    await expect($('.inventory_item_name')).toHaveText(firstItemName)
    await expect($('.inventory_item_price')).toHaveText(firstItemPrice)

    await CheckoutPage.finishButton.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html')
    await expect(CheckoutPage.successMessage).toHaveText('Thank you for your order!')

    await CheckoutPage.backHomeButton.click()
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')
    await expect($('.inventory_list')).toBeDisplayed()
    await expect(CartPage.cartBadge).not.toBeDisplayed()
})

    it('TC-9: check checkout without products', async () => {
    await LoginPage.open()
    await LoginPage.login('standard_user', 'secret_sauce')
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html')

    await CartPage.cartIcon.click()

    await browser.url('https://www.saucedemo.com/cart.html')
    const removeButtons = await $$('[data-test*="remove"]')
    for (const btn of removeButtons) {
        await btn.click()
    }

    const items = await $$('.cart_item')
    await expect(items).toHaveLength(0)
    await CheckoutPage.checkoutButton.click()

    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html')    

    await expect(CartPage.errorMessage).toHaveText('Cart is empty')
    })

})
