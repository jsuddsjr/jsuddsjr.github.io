function testMatchedGroups() {
    const link = "<a href='https://www.sitepoint.com'>Awesome Web Resources</a>"
    return link.replace(/<a href='(.*?)'.*?>(.*?)<\/a>/g, "[$2]($1)");
}

testMatchedGroups.title = "Convert anchor tag into Markdown using matching groups"