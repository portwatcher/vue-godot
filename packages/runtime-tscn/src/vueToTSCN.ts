import { createApp } from './index'
import { parse } from '@vue/compiler-sfc'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface CompileOptions {
  outDir?: string
  outFile?: string
  appId?: string
  rootNodeType?: string
}

/**
 * Compile a Vue SFC file to Godot TSCN format
 * @param vueFilePath Path to the .vue file
 * @param options Compilation options
 * @returns The generated TSCN content
 */
export function compileVueToTSCN(
  vueFilePath: string,
  options: CompileOptions = {},
): string {
  // Read the .vue file
  const fileContent = readFileSync(vueFilePath, 'utf-8')

  // Parse the SFC
  const { descriptor } = parse(fileContent, {
    filename: vueFilePath,
    sourceMap: false,
  })

  // Extract template, script, and styles
  const { template, script, styles } = descriptor

  if (!template) {
    throw new Error('No template found in Vue component')
  }

  // Create a virtual root node that will represent our Godot scene
  const rootNode = {
    id: options.appId || 'VueApp',
    type: options.rootNodeType || 'Node2D',
    props: {},
  }

  // Create a Vue app with the component
  const scriptContent = script?.content || 'export default {}'
  const templateContent = template.content

  // Generate a temporary component
  const component = {
    template: templateContent,
    ...evaluateScript(scriptContent),
  }

  // Create a Vue app with the component and mount it to our virtual root
  const app = createApp(component)

  let tscnContent = ''

  // Mock the console.log to capture the TSCN output
  const originalConsoleLog = console.log
  console.log = (message: string, ...args: any[]) => {
    if (message === 'Generated TSCN:') {
      tscnContent = args[0] || ''
    }
    originalConsoleLog(message, ...args)
  }

  // Mount the app to our virtual root
  // @ts-ignore
  app.mount(rootNode)

  // Restore console.log
  console.log = originalConsoleLog

  // Process styles if needed (for Godot themes)
  if (styles.length > 0) {
    tscnContent = processTSCNWithStyles(tscnContent, styles)
  }

  // Write to file if outFile is specified
  if (options.outFile) {
    const outPath = options.outDir
      ? resolve(options.outDir, options.outFile)
      : options.outFile

    writeFileSync(outPath, tscnContent, 'utf-8')
  }

  return tscnContent
}

/**
 * Process TSCN content with Vue component styles
 * This would transform CSS styles to Godot theme properties
 */
function processTSCNWithStyles(tscnContent: string, styles: any[]): string {
  // This would be a complex implementation to convert CSS to Godot themes
  // For now, just add a comment about the styles
  let styleComment =
    '\n# The following styles were defined in the Vue component:\n'

  styles.forEach((style, index) => {
    styleComment += `# Style block ${index + 1}:\n`
    styleComment += `# ${style.content.replace(/\n/g, '\n# ')}\n`
  })

  return tscnContent + styleComment
}

/**
 * Safely evaluate the script part of a Vue component
 * In a real implementation, this would use proper module evaluation
 */
function evaluateScript(scriptContent: string): any {
  // This is a simplified implementation - in reality, you'd want to use
  // a proper module evaluation system with sandbox
  try {
    // Extract the exported object from script content
    const match = scriptContent.match(/export\s+default\s+({[\s\S]*})/)
    if (match && match[1]) {
      // Very basic evaluation - this is not safe for production!
      return JSON.parse(
        match[1].replace(/(\w+):/g, '"$1":').replace(/,\s*}/g, '}'),
      )
    }
    return {}
  } catch (err) {
    console.error('Failed to evaluate component script:', err)
    return {}
  }
}

/**
 * CLI utility to convert Vue files to TSCN
 */
export function cli() {
  const args = process.argv.slice(2)

  if (args.length < 1) {
    console.log('Usage: vue-to-tscn <input.vue> [output.tscn]')
    process.exit(1)
  }

  const inputFile = args[0]
  const outputFile = args[1] || inputFile.replace(/\.vue$/, '.tscn')

  try {
    const tscnContent = compileVueToTSCN(inputFile, { outFile: outputFile })
    console.log(`Successfully compiled ${inputFile} to ${outputFile}`)
  } catch (err) {
    console.error('Error compiling Vue to TSCN:', err)
    process.exit(1)
  }
}
