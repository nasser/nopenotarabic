import fs from "fs"
import path from "path"
import YAML from "yaml"
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import hashString from 'hash-string'
import http from 'http'
import https from 'https'
import mustache from 'mustache'
import marked from 'marked'
import moment from 'moment'
import { downloadImages } from './download.js'
import { build } from './render.js'

const argv = yargs(hideBin(process.argv))
    .default('entries', 'entries.yaml')
    .default('out', 'out')
    .default('media', 'media')
    .command('download', "downloads images into media folder")
    .command('build', "builds site")
    .argv

const entries = YAML.parse(fs.readFileSync(argv.entries, 'utf-8'))

if(argv._[0] == 'download') {
    downloadImages(entries, argv)
} else if(argv._[0] == 'build') {
    build(entries, argv)
}

// function hashHref(v) {
//     return hashString(v).toString(36)
// }

// const extensions = ["jpg", "jpeg", "png"];

// function guessExtension(s) {
//     let lower = s.toLowerCase()
//     for (const ext of extensions) {
//         if(lower.includes(ext)) {
//             return ext
//         }
//     }

//     return null
// }

// function downloadImage(href, fileName, dir, cb) {
//     const url = new URL(href)
//     const opts = { method: 'HEAD', host: url.host, path: `${url.pathname}${url.search}` }
//     const proto = url.protocol == 'http' ? http : https;
//     proto.request(opts,
//         res => {
//             if (res.statusCode != 200)
//                 return
//             const finalPath = path.join(dir, fileName)
//             cb({ href, finalPath })
//             if (fs.existsSync(finalPath)) return
//             const file = fs.createWriteStream(finalPath);
//             proto.get(url.toString(), response => response.pipe(file)).end()
//         }
//     ).end()
// }


const indexTemplate = fs.readFileSync('index.html', 'utf-8')
const indexView = { entries: [] }

// entries
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .forEach((entry, i) => {
//     let date = entry.date ? moment(new Date(entry.date)).format("MMM Do Y") : ""
//     let content = marked(entry.content)
//     let extension = entry.extension || guessExtension(entry.image)
//     let hashedName = `${hashHref(entry.image)}.${extension}`
//     if (!entry.image.startsWith("/")) {
//         if(!fs.existsSync(path.join("public", "media", hashedName)))
//             downloadImage(entry.image, hashedName, "public/media", ({href, finalPath}) => {
//                 console.log(`${href} -> ${finalPath}`);
//             })
//         indexView.entries.push({ date, content, index:i, href: `/${i}`, image: `/media/${hashedName}` })
//     } else {
//         indexView.entries.push({ date, content, index:i, href: `/${i}`, image: entry.image })
//     }
// })

// fs.writeFileSync("public/index.html", mustache.render(indexTemplate, indexView))