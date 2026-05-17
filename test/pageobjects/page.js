export default class Page {
    open (path) {
        return browser.url(`${process.env.BASE_URL}/${path}`)
    }
}
