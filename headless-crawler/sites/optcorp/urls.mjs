const urls = {
    list: name => `https://optcorp.com/collections/${name}`,
    item: (category, name) => `https://optcorp.com/collections/${category}/products/${name}`
}
export {urls};