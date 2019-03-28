const Readable = require('stream').Readable
const JSONLDParser = require('@rdfjs/parser-jsonld');
const rdf = require('rdf-ext');
const parserJsonld = new JSONLDParser();

module.exports = async (jsonld) => {
    const input = new Readable({
        read: () => {
            input.push(JSON.stringify(jsonld))
            input.push(null)
        }
    })
    const output = parserJsonld.import(input)
    let resourceDefault = await rdf.dataset().import(output)
    return resourceDefault;
}