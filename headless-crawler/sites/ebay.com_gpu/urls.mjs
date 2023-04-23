const urls = {
    list: keywords => `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${keywords.replaceAll(' ', '+')}&LH_ItemCondition=1500%7C2000%7C2500%7C3000&_ipg=240&_sop=15`
}
export {urls};