import fs from "fs-extra"
import path from "path"
import mustache from 'mustache'
import marked from 'marked'
import moment from 'moment'
import { hashHref, guessExtension } from './common.js'

export function build(entries, options) {
    console.log("[ssg] building", options)
    
    const indexTemplate = fs.readFileSync('index.html', 'utf-8')
    const indexView = { entries: [] }

    entries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((entry, index) => {
            index = entries.length - index
            let next = index - 1
            let prev = index + 1
            let date = entry.date ? moment(new Date(entry.date)).format("MMM Do Y") : ""
            let content = marked(entry.content)
            let extension = entry.extension || guessExtension(entry.image)
            let image = entry.image.startsWith("/") ? entry.image : `/media/${hashHref(entry.image)}.${extension}`
            indexView.entries.push({ date, content, index, image, next, prev })
        })

    if(fs.existsSync(options.out)) {
        console.log("[ssg] removing", options.out)
        fs.rmSync(options.out, { recursive: true, force: true})
    }
    fs.mkdirSync(options.out)
    console.log("[ssg] copying media", path.join(options.out, "media"))
    fs.copySync("media", path.join(options.out, "media"))
    console.log("[ssg] copying writing index.html", path.join(options.out, "index.html"))
    fs.writeFileSync(path.join(options.out, "index.html"), mustache.render(indexTemplate, indexView))
}