import loginPage from '../pageobjects/login.page.js'
import inventoryPage from '../pageobjects/inventory.page.js'
import cartPage from '../pageobjects/cart.page.js' 
import checkoutPage from '../pageobjects/checkout.page.js'
import { faker } from '@faker-js/faker'

const validUser = process.env.VALID_USERNAME
const validPass = process.env.VALID_PASSWORD
const lockedUser = process.env.LOCKED_USERNAME
const baseUrl = process.env.BASE_URL

describe('Login functionality', () => {

    beforeEach(async () => {
        await loginPage.open()
    })

    it('TC-1: should login with valid credentials', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
        await expect(inventoryPage.inventoryList).toBeDisplayed()
        await expect(inventoryPage.cartIcon).toBeDisplayed()
    })

    it('TC-2: should show error with invalid password', async () => {
        await loginPage.login(validUser, faker.internet.password())
        await expect(loginPage.errorMessage).toBeDisplayed()

        await expect(loginPage.errorMessage).toHaveText(
        'Epic sadface: Username and password do not match any user in this service'
        )

        await expect(loginPage.inputUsername).toHaveAttr('class', expect.stringContaining('input_error'))
        await expect(loginPage.inputPassword).toHaveAttr('class', expect.stringContaining('input_error'))

        const icons = await loginPage.errorIcons
        await expect(icons).toHaveLength(2)
        for (const icon of icons) {
        await expect(icon).toBeDisplayed()
        }
    })

    it('TC-3: should show error for locked user', async () => {
        await loginPage.login(lockedUser, validPass)
        await expect(loginPage.errorMessage).toBeDisplayed()

        await expect(loginPage.errorMessage).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
        )

        await expect(loginPage.inputUsername).toHaveAttr('class', expect.stringContaining('input_error'))
        await expect(loginPage.inputPassword).toHaveAttr('class', expect.stringContaining('input_error'))

        const icons = await loginPage.errorIcons
        await expect(icons).toHaveLength(2)
        for (const icon of icons) {
        await expect(icon).toBeDisplayed()
        }
    })

    it('TC-4: should logout successfully', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
        await inventoryPage.burgerMenu.click()

        await expect(inventoryPage.sidebarMenu).toBeDisplayed()
        await expect(inventoryPage.sidebarInventoryLink).toBeDisplayed()
        await expect(inventoryPage.sidebarAboutLink).toBeDisplayed()
        await expect(inventoryPage.logoutButton).toBeDisplayed()
        await expect(inventoryPage.sidebarResetLink).toBeDisplayed()

        await inventoryPage.logoutButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/`)
        await expect(loginPage.inputUsername).toHaveValue('')
        await expect(loginPage.inputPassword).toHaveValue('')
    })

   it('TC-5: should save card after logout', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
        const firstItemName = await inventoryPage.firstItemName.getText()
        await inventoryPage.firstAddToCartButton.click()
        await inventoryPage.burgerMenu.click()
        await expect(inventoryPage.cartBadge).toHaveText('1')

        await expect(inventoryPage.sidebarMenu).toBeDisplayed()
        await expect(inventoryPage.sidebarInventoryLink).toBeDisplayed()
        await expect(inventoryPage.sidebarAboutLink).toBeDisplayed()
        await expect(inventoryPage.logoutButton).toBeDisplayed()
        await expect(inventoryPage.sidebarResetLink).toBeDisplayed()

        await inventoryPage.logoutButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/`)
        await expect(loginPage.inputUsername).toHaveValue('')
        await expect(loginPage.inputPassword).toHaveValue('')

        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)

        await expect(inventoryPage.inventoryList).toBeDisplayed()
        await cartPage.cartIcon.click()

        const items = await cartPage.cartItems
        await expect(items).toHaveLength(1)
        await expect(cartPage.cartItemName).toHaveText(firstItemName)
    })

   it('TC-6: should sort items', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)

        await inventoryPage.sortDropdown.selectByVisibleText('Name (A to Z)')
        const namesAZ = []
        for (const el of await inventoryPage.itemNames) {
        namesAZ.push(await el.getText())
        }
        await expect(namesAZ).toEqual([...namesAZ].sort())

        await inventoryPage.sortDropdown.selectByVisibleText('Name (Z to A)')
        const namesZA = []
        for (const el of await inventoryPage.itemNames) {
        namesZA.push(await el.getText())
        }
        await expect(namesZA).toEqual([...namesZA].sort().reverse())

        await inventoryPage.sortDropdown.selectByVisibleText('Price (low to high)')
        const pricesLH = []
        for (const el of await inventoryPage.itemPrices) {
        pricesLH.push(parseFloat((await el.getText()).replace('$', '')))
        }
        await expect(pricesLH).toEqual([...pricesLH].sort((a, b) => a - b))

        await inventoryPage.sortDropdown.selectByVisibleText('Price (high to low)')
        const pricesHL = []
        for (const el of await inventoryPage.itemPrices) {
        pricesHL.push(parseFloat((await el.getText()).replace('$', '')))
        }
        await expect(pricesHL).toEqual([...pricesHL].sort((a, b) => b - a))
    })

   it('TC-7: footer social links check', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
    
        await inventoryPage.twitterLink.click()
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[1])
        await expect(browser).toHaveUrl(expect.stringContaining('x.com'))
        await browser.closeWindow()
        await browser.switchToWindow(handles[0])
    
        await inventoryPage.facebookLink.click()
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
        const handles2 = await browser.getWindowHandles()
        await browser.switchToWindow(handles2[1])
        await expect(browser).toHaveUrl(expect.stringContaining('facebook.com'))
        await browser.closeWindow()
        await browser.switchToWindow(handles2[0])
    
        await inventoryPage.linkedinLink.click()
        await browser.waitUntil(async () => (await browser.getWindowHandles()).length === 2)
        const handles3 = await browser.getWindowHandles()
        await browser.switchToWindow(handles3[1])
        await expect(browser).toHaveUrl(expect.stringContaining('linkedin.com'))
        await browser.closeWindow()
        await browser.switchToWindow(handles3[0])
    })

    it('TC-8: should complete valid checkout', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
        await cartPage.cartIcon.click()

        await browser.url(`${baseUrl}/cart.html`)
        const removeButtons = await cartPage.removeButtons
        for (const btn of removeButtons) {
        await btn.click()
        }

        await inventoryPage.open()

        const firstItemName = await inventoryPage.firstItemName.getText()
        const firstItemPrice = await (await inventoryPage.itemPrices[0]).getText()
        await inventoryPage.firstAddToCartButton.click()
        await expect(inventoryPage.cartBadge).toHaveText('1')

        await cartPage.cartIcon.click()
        await expect(browser).toHaveUrl(`${baseUrl}/cart.html`)
        await expect(cartPage.cartItemName).toHaveText(firstItemName)

        await checkoutPage.checkoutButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/checkout-step-one.html`)
        await expect(checkoutPage.checkoutInfo).toBeDisplayed()

        await checkoutPage.firstNameInput.setValue(faker.person.firstName())
        await checkoutPage.lastNameInput.setValue(faker.person.lastName())
        await checkoutPage.postalCodeInput.setValue(faker.location.zipCode())

        await checkoutPage.continueButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/checkout-step-two.html`)
        await expect(checkoutPage.cartItemName).toHaveText(firstItemName)
        await expect(checkoutPage.cartItemPrice).toHaveText(firstItemPrice)

        await checkoutPage.finishButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/checkout-complete.html`)
        await expect(checkoutPage.successMessage).toHaveText('Thank you for your order!')

        await checkoutPage.backHomeButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)
        await expect(inventoryPage.inventoryList).toBeDisplayed()
        await expect(inventoryPage.cartBadge).not.toBeDisplayed()
    })

    it('TC-9: check checkout without products', async () => {
        await loginPage.login(validUser, validPass)
        await expect(browser).toHaveUrl(`${baseUrl}/inventory.html`)

        await cartPage.cartIcon.click()
        const removeButtons = await cartPage.removeButtons
        for (const btn of removeButtons) {
        await btn.click()
        }

        const items = await cartPage.cartItems
        await expect(items).toHaveLength(0)
        await checkoutPage.checkoutButton.click()
        await expect(browser).toHaveUrl(`${baseUrl}/cart.html`)
        await expect(cartPage.errorMessage).toHaveText('Cart is empty')
        })

    })
