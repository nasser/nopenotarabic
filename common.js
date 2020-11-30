import hashString from 'hash-string'

export function hashHref(v) {
    return hashString(v).toString(36)
}

const extensions = ["jpg", "jpeg", "png"];

export  function guessExtension(s) {
    let lower = s.toLowerCase()
    for (const ext of extensions)
        if (lower.includes(ext))
            return ext

    return null
}