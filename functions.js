

let searchIndex = undefined
function search() {
    console.log(searchData)
    if (!searchIndex) {
        searchIndex = elasticlunr.Index.load(searchData)
    }

    var searchResultDiv = document.getElementById('searchResults')

    const currentText = document.getElementById('search').value

    const searchResult = searchIndex.search(currentText)
    console.log(searchResult)
    const search = []

    for (const result of searchResult) {
        console.log(JSON.stringify(result))
        const searchRef = searchData.documentStore.docs[result.ref]
        if (searchRef) {
            search.push(` <li class="navLinks">
            <div>
             <a href="./${searchRef.fileName}" target="_blank">
             ${searchRef.title}
            </a>
            </div>
        </li>`)
        }
    }
    searchResultDiv.innerHTML = `
    <ul>
        ${search.join('\n')}
    </ul>`

}


