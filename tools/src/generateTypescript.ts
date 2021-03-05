import { compileFromFile } from 'json-schema-to-typescript'
import fs from 'fs'

const options = {
  style: {
    singleQuote: true,
    semi: false
  }
}

// compile from file
compileFromFile('../schema/*.json', options).then(ts => fs.writeFileSync('types.d.ts', ts))
