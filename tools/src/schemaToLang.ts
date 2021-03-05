import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import prettier from 'prettier'

class MappedPrefixFetchingJSONSchemaStore extends FetchingJSONSchemaStore {
  private mappings: Record<string, string> = {}

  constructor(mappings: Record<string, string> = {}) {
    super()
    this.mappings = mappings
  }

  withPrefixReplacement(address: string) {
    const prefix = Object.keys(this.mappings).find(prefix => address.startsWith(prefix))
    if (prefix != null) {
      return address.replace(prefix, this.mappings[prefix])
    }
    return address
  }

  fetch(address: string) {
    const updatedAddress = this.withPrefixReplacement(address)
    return super.fetch(updatedAddress)
  }
}

// Convert any to unknown. Related:
// See: https://github.com/quicktype/quicktype/issues/1619
const fixTypescriptAny = (line: string) => line.replace(/([ <,])any\b/g, '$1unknown')

async function quicktypeJSONSchema(
  targetLanguage: string,
  prefixMapper: Record<string, string>,
  schemasLocation: string,
  outputFile: string
) {
  const schemaInput = new JSONSchemaInput(new MappedPrefixFetchingJSONSchemaStore(prefixMapper))

  const schemaFiles = readdirSync(schemasLocation)

  await Promise.all(
    schemaFiles.map(filename => {
      const typeName = filename.replace('.json', '')
      return schemaInput.addSource({
        name: typeName,
        schema: readFileSync(`${schemasLocation}/${filename}`).toString()
      })
    })
  )

  const inputData = new InputData()
  inputData.addInput(schemaInput)

  const result = await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      'just-types': 'true',
      'python-version': '3.7'
    }
    // debugPrintSchemaResolving: true
  })

  const prettierConfig = await prettier.resolveConfig('../.prettierrc.js')

  const fixer = targetLanguage === 'typescript' ? fixTypescriptAny : (x: string) => x
  const formatCode =
    targetLanguage === 'typescript'
      ? (x: string) => prettier.format(x, { ...prettierConfig, parser: 'typescript' })
      : (x: string) => x

  const content = formatCode(result.lines.map(fixer).join('\n'))

  return writeFileSync(outputFile, content)
}

async function main() {
  const prefixMapper = {
    'https://dharpa.org/schema/': './schema/'
  }
  const schemasLocation = './schema/'
  const jupyterMiddlewarePath = '../backend/jupyter-middleware'
  const clientCorePath = '../packages/client-core/src/common'

  await quicktypeJSONSchema(
    'python',
    prefixMapper,
    `${schemasLocation}/messages`,
    `${jupyterMiddlewarePath}/dharpa/vre/jupyter/messages.py`
  )

  await quicktypeJSONSchema(
    'typescript',
    prefixMapper,
    `${schemasLocation}/messages`,
    `${clientCorePath}/messages.ts`
  )
}

main()
