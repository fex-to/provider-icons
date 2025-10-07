#!/usr/bin/env node

import { buildIcons } from '../../.build/build-icons.mjs'

const componentTemplate = ({
  name,
  namePascal,
  children
}) => `\
import createReactComponent from '../createReactComponent';
export default createReactComponent('${name}', '${namePascal}', ${JSON.stringify(children)});`;

const indexItemTemplate = ({
  name,
  namePascal
}) => `export { default as ${namePascal} } from './icons/${namePascal}';`

const typeDefinitionsTemplate = () => `/// <reference types="react" />
import { SVGAttributes } from 'react'

declare module '@fex.to/provider-icons-react'

// Create interface extending SVGProps
export interface ProviderIconsProps extends Partial<React.SVGProps<SVGSVGElement>> {
    size?: string | number
    color?: string
}

export declare const createReactComponent: (iconName: string, iconNamePascal: string, iconNode: any[]) => (props: ProviderIconsProps) => JSX.Element;

export type Icon = React.FC<ProviderIconsProps>;

// Generated icons`

const indexTypeTemplate = ({
  namePascal
}) => `export declare const ${namePascal}: (props: ProviderIconsProps) => JSX.Element;`


await buildIcons({
  name: 'icons-react',
  componentTemplate,
  indexItemTemplate,
  typeDefinitionsTemplate,
  indexTypeTemplate,
  pascalCase: true
})