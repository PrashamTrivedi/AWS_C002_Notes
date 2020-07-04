const showdown = require('showdown')
const converter = new showdown.Converter({tables: true, strikethrough: true})
const fs = require('fs')

module.exports.exportHtml = () => {
    const currentDir = process.cwd()
    const htmlPath = `${currentDir}/html/`
    fs.readdirSync(currentDir).filter(file => file.endsWith('.md')).forEach(file => {
        const fileData = fs.readFileSync(file).toString()
        const htmlData = converter.makeHtml(fileData)
        if (!fs.existsSync(htmlPath)) {
            fs.mkdirSync(htmlPath)
        }
        fs.writeFileSync(`${htmlPath}/${file.replace('.md', '.html')}`, htmlData)
    })

}

module.exports.exportHtml()