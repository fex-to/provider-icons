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

declare module '@cr.today/sources-icons-react'

// Create interface extending SVGProps
export interface SourcesIconsProps extends Partial<Omit<React.SVGProps<SVGSVGElement>, 'stroke'>> {
    size?: string | number
}

export declare const createReactComponent: (iconName: string, iconNamePascal: string, iconNode: any[]) => (props: SourcesIconsProps) => JSX.Element;

export type Icon = React.FC<SourcesIconsProps>;

// Generated icons`

const indexTypeTemplate = ({
  namePascal
}) => `export declare const ${namePascal}: (props: SourcesIconsProps) => JSX.Element;`


buildIcons({
  name: 'sources-icons-react',
  componentTemplate,
  indexItemTemplate,
  typeDefinitionsTemplate,
  indexTypeTemplate,
  pascalCase: true
})