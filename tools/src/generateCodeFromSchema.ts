import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core'
import { readFile, writeFile, readdir, stat } from 'fs/promises'
import path from 'path'
import prettier from 'prettier'

async function getFilesRecursively(dir: string): Promise<string[]> {
  const files = await Promise.all(
    (await readdir(dir)).flatMap(async file => {
      const filePath = path.join(dir, file)
      const stats = await stat(filePath)
      if (stats.isDirectory()) return getFilesRecursively(filePath)
      else if (stats.isFile()) return [filePath]
    })
  )

  return files.reduce((all, folderContents) => all.concat(folderContents), [])
}

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

  const schemaFiles = await getFilesRecursively(schemasLocation)

  await Promise.all(
    schemaFiles.map(async filename => {
      const typeName = path.basename(filename).replace('.json', '')
      const content = (await readFile(filename)).toString()
      const uri = JSON.parse(content)['$id']

      return schemaInput.addSource({
        name: typeName,
        schema: content,
        uris: [uri]
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
  const addHeader = targetLanguage === 'python' ? (x: string) => `# flake8: noqa\n${x}` : (x: string) => x

  const content = [result.lines.map(fixer).join('\n')].map(formatCode).map(addHeader)[0]

  return writeFile(outputFile, content)
}

async function main() {
  const schemasLocation = '../schema/json'

  const prefixMapper = {
    'https://dharpa.org/schema': schemasLocation
  }
  const jupyterMiddlewarePath = '../backend/jupyter-middleware'
  const clientCorePath = '../packages/client-core/src/common'

  await quicktypeJSONSchema(
    'python',
    prefixMapper,
    schemasLocation,
    `${jupyterMiddlewarePath}/dharpa/vre/types/generated.py`
  )

  await quicktypeJSONSchema(
    'typescript',
    prefixMapper,
    schemasLocation,
    `${clientCorePath}/types/generated.ts`
  )
}

main().catch(console.error)
