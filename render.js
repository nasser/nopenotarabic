import fs from "fs-extra"
import path from "path"
import mustache from 'mustache'
import marked from 'marked'
import moment from 'moment'
import { hashHref, guessExtension } from './common.js'

export function build(entries, options) {
    const indexTemplate = fs.readFileSync('index.html', 'utf-8')
    const indexView = { entries: [] }

    entries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((entry, index) => {
            let date = entry.date ? moment(new Date(entry.date)).format("MMM Do Y") : ""
            let content = marked(entry.content)
            let extension = entry.extension || guessExtension(entry.image)
            let image = entry.image.startsWith("/") ? entry.image : `/media/${hashHref(entry.image)}.${extension}`
            indexView.entries.push({ date, content, index, image })
        })

    if(fs.existsSync(options.out)) {
        fs.rmdirSync(options.out, { recursive: true, force: true})
    }
    fs.mkdirSync(options.out)
    fs.copySync("media", path.join(options.out, "media"))
    fs.writeFileSync(path.join(options.out, "index.html"), mustache.render(indexTemplate, indexView))
}