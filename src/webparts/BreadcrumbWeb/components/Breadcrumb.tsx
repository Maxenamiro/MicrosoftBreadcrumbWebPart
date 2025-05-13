import * as React from 'react'
import type { IBreadcrumbProps } from './IBreadcrumbProps'

export default class Breadcrumb extends React.Component<IBreadcrumbProps> {
	private observer: MutationObserver | null = null
	private sectionRef = React.createRef<HTMLElement>()

	private capitalizeFirstLetter(text: string): string {
		if (!text) return ''
		return text.charAt(0).toUpperCase() + text.slice(1)
	}

	private renderBreadcrumbs(): JSX.Element {
		const pathParts = window.location.pathname
			.split('/')
			.filter(
				(part) =>
					part &&
					part.toLowerCase() !== 'sites' &&
					part.toLowerCase() !== 'sitepages' &&
					part.toLowerCase() !== '_layouts' &&
					part !== '15'
			)

		let breadcrumbs: { name: string; url: string }[] = []
		let currentPath = '/'

		pathParts.forEach((part, index) => {
			const cleanPart = part.replace('.aspx', '')
			const isSiteName = index === 0

			if (isSiteName) {
				currentPath += `sites/${cleanPart}`
			} else {
				currentPath += `/SitePages/${cleanPart}`
			}

			const decodedName = decodeURIComponent(cleanPart)
			breadcrumbs.push({
				name: this.capitalizeFirstLetter(decodedName),
				url: currentPath,
			})
		})

		const lastIndex = breadcrumbs.length - 1

		return (
			<nav aria-label='breadcrumb'>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						fontSize: '14px',
						gap: '5px',
						paddingLeft: '10px',
						color: 'inherit',
					}}
				>
					{breadcrumbs.map((crumb, idx) => (
						<span key={idx}>
							{idx > 0 && <span> &gt; </span>}
							{idx === lastIndex ? (
								<strong>{crumb.name}</strong>
							) : (
								<a
									href={crumb.url}
									style={{ color: 'inherit', textDecoration: 'none' }}
								>
									{crumb.name}
								</a>
							)}
						</span>
					))}
				</div>
			</nav>
		)
	}

	componentDidMount() {
		const section = this.sectionRef.current
		const wrapper = section?.parentElement as HTMLElement
		if (!wrapper) return

		this.observer = new MutationObserver(() => {
			wrapper.style.color = 'inherit'
		})

		this.observer.observe(wrapper, {
			attributes: true,
			childList: false,
			subtree: false,
		})
	}

	componentWillUnmount() {
		this.observer?.disconnect()
	}

	public render(): React.ReactElement<IBreadcrumbProps> {
		return (
			<section ref={this.sectionRef} style={{ marginBottom: '1em' }}>
				{this.renderBreadcrumbs()}
			</section>
		)
	}
}
