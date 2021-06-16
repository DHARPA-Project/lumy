import {
  quicktype,
  InputData,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
  JSONSchemaSourceData,
  readFromFileOrURL
} from 'quicktype-core'
import { compile as compileToTs } from 'json-schema-to-typescript'
import { readFile, writeFile, readdir, stat } from 'fs/promises'
import path from 'path'
import prettier from 'prettier'
import { camelCase } from 'quicktype-core/dist/support/Strings'

const isObj = (obj: unknown): obj is { [k: string]: unknown } =>
  typeof obj === 'object' && !(obj instanceof Array)

const isArr = (obj: unknown): obj is unknown[] => obj instanceof Array
const isStr = (obj: unknown): obj is string => typeof obj === 'string'

function camelCaseProps<T>(obj: T, key: string = undefined): T {
  if (isObj(obj)) {
    const processKey = key === 'properties' ? camelCase : (v: string) => v
    return Object.entries(obj).reduce((acc, [k, v]) => {
      return {
        ...acc,
        [processKey(k)]: camelCaseProps(v, k)
      }
    }, {}) as T
  }
  if (isArr(obj)) {
    const processKey = key === 'required' ? camelCase : (v: string) => v
    return (obj.map(v => (isStr(v) ? processKey(v) : v)) as unknown) as T
  }
  return obj
}

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

function getDuplicates<T>(items: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const groupedItems = items.reduce((acc, item) => {
    const key = keyFn(item)
    const group = acc[key] ?? []
    return { ...acc, [key]: group.concat([item]) }
  }, {} as Record<string, T[]>)

  return Object.entries(groupedItems).reduce((acc, [key, value]) => {
    if (value.length > 1) {
      acc[key] = value
    }
    return acc
  }, {} as typeof groupedItems)
}

function uriFromFileName(schemaFileName: string, reversePrefixMapper: Record<string, string>): string {
  const mapping = Object.entries(reversePrefixMapper).find(([, fsBase]) => schemaFileName.startsWith(fsBase))
  if (mapping == null) throw new Error(`Could not find URI mapping for filename: ${schemaFileName}`)

  const [uriBase, fsBase] = mapping

  return schemaFileName.replace(fsBase, uriBase)
}

/**
 * @param prefixMapper - URI Base -> filesystem path prefix
 */
function schemaInputBuilder(prefixMapper: Record<string, string>) {
  return async (schemaFileName: string): Promise<JSONSchemaSourceData> => {
    const content = (await readFile(schemaFileName)).toString()
    const jsonContent = JSON.parse(content)
    const uri = uriFromFileName(schemaFileName, prefixMapper)

    const uriParts = uri.split('/')
    const namespace = uriParts[uriParts.length - 2]
    const context = uriParts[uriParts.length - 3]
    const messageAction = uriParts[uriParts.length - 1].replace('.json', '')

    if (context === 'messages') {
      jsonContent['description'] = `
        Target: "${namespace}"
        Message type: "${messageAction}"
        
        ${jsonContent['description']}
      `
    }

    jsonContent['$id'] = uri
    const schema = JSON.stringify(jsonContent)

    const name = jsonContent['title'] as string

    return {
      name,
      schema,
      uris: [uri]
    }
  }
}

/**
 * @param prefixMapper - URI Base -> filesystem path prefix
 * @param schemasLocation - base folder of the files
 * @param outputFile - where to write code
 */
async function quicktypeJSONSchema(
  targetLanguage: string,
  prefixMapper: Record<string, string>,
  schemasLocation: string,
  outputFile: string
) {
  const schemaInput = new JSONSchemaInput(new MappedPrefixFetchingJSONSchemaStore(prefixMapper))

  const schemaFiles = await getFilesRecursively(schemasLocation)

  const inputBuilder = schemaInputBuilder(prefixMapper)
  const sources = await Promise.all(schemaFiles.map(inputBuilder))

  const inputsWithNoNames = sources.filter(input => input.name == null)

  if (inputsWithNoNames.length > 0) {
    console.error('The following schemas have no name provided in "title":')
    inputsWithNoNames.forEach(input => console.error(`\t${input.uris[0]}`))
    throw new Error('Missing names')
  }

  const inputsWithDuplicateNames = getDuplicates(sources, input => input.name)
  if (Object.keys(inputsWithDuplicateNames).length > 0) {
    console.error('The following schemas have duplicate names provided in "title":')
    Object.entries(inputsWithDuplicateNames).forEach(([name, items]) => {
      console.error(`\t${name}:`)
      items.forEach(item => console.error(`\t\t${item.uris[0]}`))
    })
    throw new Error('Duplicate names')
  }

  sources.forEach(source => schemaInput.addSource(source))

  // await Promise.all(
  //   schemaFiles.map(async filename => {
  //     const typeName = path.basename(filename).replace('.json', '')
  //     const content = (await readFile(filename)).toString()
  //     const uri = JSON.parse(content)['$id']

  //     return schemaInput.addSource({
  //       name: typeName,
  //       schema: content,
  //       uris: [uri]
  //     })
  //   })
  // )

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

const MiddlewareDirectoryParametersPrefix = '--middleware-directory='

function getMiddlewareDirectory(): string {
  const param = process.argv.find(s => s.startsWith(MiddlewareDirectoryParametersPrefix))
  if (param == null) return undefined
  return param.replace(MiddlewareDirectoryParametersPrefix, '')
}

async function main() {
  const middlewareDirectory = getMiddlewareDirectory()
  const schemasLocation = '../schema/json'

  const prefixMapper = {
    'https://dharpa.org/schema': schemasLocation
  }
  const clientCorePath = '../packages/client-core/src/common'

  if (middlewareDirectory != null) {
    console.info(`Generating code for middleware in "${middlewareDirectory}"`)
    await quicktypeJSONSchema(
      'python',
      prefixMapper,
      schemasLocation,
      `${middlewareDirectory}/lumy_middleware/types/generated.py`
    )
  } else {
    console.info(
      `Skipped code geneartion for middleware because middleware directory was not provided in ${MiddlewareDirectoryParametersPrefix}`
    )
  }

  console.info('Generating code for the front end')
  await quicktypeJSONSchema(
    'typescript',
    prefixMapper,
    schemasLocation,
    `${clientCorePath}/types/generated.ts`
  )

  // kiara is treated separately with a different code generator because `quickcode`
  // has bugs that make it fail to generate complex structures.
  const kiaraSchemaUrl = 'https://dharpa.org/kiara/development/entities/modules/PipelineState.json'
  const kiaraSchema = camelCaseProps(JSON.parse(await readFromFileOrURL(kiaraSchemaUrl)))
  const kiaraGeneratedFilename = `${clientCorePath}/types/kiaraGenerated.ts`

  const prettierConfig = await prettier.resolveConfig('../.prettierrc.js')

  compileToTs(kiaraSchema, 'PipelineState').then(ts => {
    const formattedTs = prettier.format(ts, { ...prettierConfig, parser: 'typescript' })
    writeFile(kiaraGeneratedFilename, formattedTs)
  })
}

main().catch(console.error)
