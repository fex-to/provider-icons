import fs from 'fs'
import { createDirectory, readSvgs } from '../../.build/helpers.mjs'
import { buildIcons } from '../../.build/build-icons.mjs'
import { stringify } from 'svgson'

const svgFiles = readSvgs()

const buildSprite = () => {
  let svgContent = ''
  svgFiles.forEach(function(file, i) {
    const svgFileContent = file.contents.replace(/<svg[^>]+>/g, '').replace(/<\/svg>/g, '').replace(/\n+/g, '').replace(/>\s+</g, '><').trim()
    svgContent += `<symbol id="sources-${file.name}" viewBox="0 0 48 48">${svgFileContent}</symbol>`
  })

  let svg = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${svgContent}</defs></svg>`

  fs.writeFileSync('sources-sprite.svg', svg)
}

const buildNodes = () => {
  const iconNodes = svgFiles.reduce((acc, { name, obj }) => {
    acc[name] = obj.children.map(({ name, attributes }) => [name, attributes]);

    return acc;
  }, {});

  const iconNodesStringified = JSON.stringify(iconNodes, null, 2);

  fs.writeFileSync(`./sources-nodes.json`, iconNodesStringified);
}

const componentTemplate = ({
  namePascal,
  svg
}) => `\
export default ${namePascal} => \`${svg.contents}\`;`;

const indexItemTemplate = ({
  name,
  namePascal
}) => `export { default as ${namePascal} } from './icons/${namePascal}';`

const typeDefinitionsTemplate = () => `// Generated icons`

const indexTypeTemplate = ({
  namePascal
}) => `export declare const ${namePascal}: string;`



buildSprite()
buildNodes()
buildIcons({
  name: 'sources-icons',
  componentTemplate,
  indexItemTemplate,
  typeDefinitionsTemplate,
  indexTypeTemplate,
  pretty: false
})