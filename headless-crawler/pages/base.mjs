const shortTitle = async page => globalThis.site.titleReplacer(await page.title())
const shortUrl = original => {
    const url = new URL(original)
    return `${url.pathname}${url.search}`
}

export {shortTitle, shortUrl}
