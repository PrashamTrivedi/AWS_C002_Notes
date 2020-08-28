const showdown = require('showdown')


const plugin = {
    type: 'output',
    regex: new RegExp(`<h(.*) id="(.*)">(.*)</h(.*)>`, 'g'),
    replace: `<h$1 id=$2><a href='#$2' class="refLink">$3</a></h$4>`
}
const converter = new showdown.Converter({tables: true, strikethrough: true, openLinksInNewWindow: true, metadata: true, extensions: [plugin]})
const fs = require('fs')


module.exports.exportHtml = () => {
    const currentDir = process.cwd()
    const htmlPath = `${currentDir}/html/`
    const filesArr = []

    fs.readdirSync(currentDir).filter(file => file.endsWith('.md') && !file.startsWith('readme')).forEach(file => {
        const fileData = fs.readFileSync(file).toString()


        let htmlData = converter.makeHtml(fileData)
        htmlData = htmlData.split(".md").join(".html")
        const metadata = converter.getMetadata()
        const title = metadata.title
        if (!fs.existsSync(htmlPath)) {
            fs.mkdirSync(htmlPath)
        }
        fs.copyFileSync('./style.css', `${htmlPath}/style.css`)
        fs.copyFileSync('./functions.js', `${htmlPath}/functions.js`)
        const fileName = `${file.replace('.md', '.html')}`
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
    const index = `
    <html>
        <head>
         <meta name="HandheldFriendly" content="True">
        <meta name="MobileOptimized" content="320">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="referrer" content="no-referrer">
            <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Roboto+Condensed&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="style.css">
            <script src="functions.js"></script>
        </head>
        <body> 
            <h1>Welcome to Prasham's notes.</h1>
            <ul>
                ${filesArr.join(`\n`)}
            </ul>
        </body>
    </html>
    `
    fs.writeFileSync(`${htmlPath}/index.html`, index)

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