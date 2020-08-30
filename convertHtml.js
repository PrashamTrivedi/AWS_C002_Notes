const showdown = require('showdown')
const elasticlunr = require('elasticlunr')

const plugin = {
    type: 'output',
    regex: new RegExp(`<h(.*) id="(.*)">(.*)</h(.*)>`, 'g'),
    replace: `<h$1 id=$2><a href='#$2' class="refLink">$3</a></h$4>`
}
const converter = new showdown.Converter({tables: true, strikethrough: true, openLinksInNewWindow: true, metadata: true, extensions: [plugin]})
const fs = require('fs')
const index = elasticlunr(function () {
    this.addField('title')
    this.addField('body')
    this.addField('fileName')
})

module.exports.exportHtml = () => {
    const currentDir = process.cwd()
    const htmlPath = `${currentDir}/html/`
    const filesArr = []

    let currentId = 0
    fs.readdirSync(currentDir).filter(file => file.endsWith('.md') && !file.startsWith('readme')).forEach(file => {
        const fileData = fs.readFileSync(file).toString()

        let htmlData = converter.makeHtml(fileData)
        htmlData = htmlData.split(".md").join(".html")
        const metadata = converter.getMetadata()
        const title = metadata.title

        if (!fs.existsSync(htmlPath)) {
            fs.mkdirSync(htmlPath)
        }

        const fileName = `${file.replace('.md', '.html')}`
        const doc = {
            id: currentId,
            title,
            body: htmlData,
            fileName
        }
        index.addDoc(doc)
        currentId = currentId + 1
        filesArr.push(`
        <li class="navLinks">
            <div>
            <a href="./${fileName}" target="_blank">${title}</a>
            </div>
        </li>
        `)
        const post = `
                        <html>
                            <head>
                                <title>
                                ${title}
                                </title>
                                <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
                                <meta content="utf-8" http-equiv="encoding">
                                <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed&display=swap" rel="stylesheet">
                                <link rel="stylesheet" href="style.css">
                                <script src="functions.js"></script>
                                
                            </head>
                            <body>
                                <div id="links">
                                    <a class="navLinks" href="./index.html">Home</a>
                                    <a class="navLinks" href="https://prashamhtrivedi.in">Parent Site</a>
                                    <a class="navLinks" href="https://github.com/PrashamTrivedi/AWS_C002_Notes">Repository and Original Notes in Markdown</a>
                                </div>
                                <div class="post">
                                    ${htmlData}
                                </div>
                            </body>
                        </html>
                    `
        fs.writeFileSync(`${htmlPath}/${fileName}`, post)
    })
    fs.copyFileSync('./style.css', `${htmlPath}/style.css`)
    fs.copyFileSync('./functions.js', `${htmlPath}/functions.js`)
    fs.copyFileSync('./node_modules/elasticlunr/elasticlunr.min.js', `${htmlPath}/elasticlunr.min.js`)

    const indexFile = `
    <html>
        <head>
         <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="referrer" content="no-referrer">
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <meta content="utf-8" http-equiv="encoding">
        <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
        <script src="functions.js"></script>
        <script src="elasticlunr.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <script type="text/javascript" src="search.js"></script>
        </head>
        <body> 
        <h1>Welcome to Prasham's notes.</h1>
       <div class="searchBox">
            <input type="text" id="search" placeholder="Search.." name="search">
            <button type="submit" onClick=search()><i class="fa fa-search"></i></button>
            <div id="searchResults" class="searchResults">
            </div> 
       </div>
            <ul>
                ${filesArr.join(`\n`)}
            </ul>
        </body>
    </html>
    `
    fs.writeFileSync(`${htmlPath}/index.html`, indexFile)

    fs.writeFileSync(`${htmlPath}/search.js`, `searchData = ${JSON.stringify(index)}`)

    const error = `
    <html>
     <head>
     <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed&display=swap" rel="stylesheet">
             <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <h1>Something has gone wrong. If you are not sure where to go, there is already an <a href='./index.html'>Index Page</a>.</h1>
           
        </body>
    </html>
    `
    fs.writeFileSync(`${htmlPath}/error.html`, error)

}

module.exports.exportHtml()