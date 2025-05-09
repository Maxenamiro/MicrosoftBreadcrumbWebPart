import { IReadonlyTheme } from '@microsoft/sp-component-base'
import { Version } from '@microsoft/sp-core-library'
import {
	type IPropertyPaneConfiguration,
	PropertyPaneTextField,
} from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'

import * as strings from 'BreadcrumbWebPartStrings'
import Breadcrumb from './components/Breadcrumb'
import { IBreadcrumbProps } from './components/IBreadcrumbProps'

export interface IBreadcrumbWebPartProps {
	description: string
}

export default class BreadcrumbWebPart extends BaseClientSideWebPart<IBreadcrumbWebPartProps> {
	public render(): void {
		const element: React.ReactElement<IBreadcrumbProps> = React.createElement(
			Breadcrumb,
			{
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				domElement: this.domElement,
			}
		)

		ReactDom.render(element, this.domElement)
	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return
		}

		const { semanticColors } = currentTheme

		if (semanticColors) {
			this.domElement.style.setProperty(
				'--bodyText',
				semanticColors.bodyText || null
			)
			this.domElement.style.setProperty('--link', semanticColors.link || null)
			this.domElement.style.setProperty(
				'--linkHovered',
				semanticColors.linkHovered || null
			)
		}
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement)
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0')
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription,
					},
					groups: [
						{
							groupName: strings.BasicGroupName,
							groupFields: [
								PropertyPaneTextField('description', {
									label: strings.DescriptionFieldLabel,
								}),
							],
						},
					],
				},
			],
		}
	}
}
