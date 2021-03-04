const { compileFromFile } = require('json-schema-to-typescript')
const fs = require('fs')

const options = {
  style: {
    singleQuote: true,
    semi: false
  }
}

// compile from file
compileFromFile('../schema/*.json', options).then(ts => fs.writeFileSync('types.d.ts', ts))
