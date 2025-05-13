import * as React from 'react'
import styles from './Breadcrumb.module.scss'
import type { IBreadcrumbProps } from './IBreadcrumbProps'

export default class Breadcrumb extends React.Component<IBreadcrumbProps> {
	private observer: MutationObserver | null = null
	private sectionRef = React.createRef<HTMLElement>()

	private capitalizeFirstLetter(text: string): string {
		if (!text) return ''
		return text.charAt(0).toUpperCase() + text.slice(1)
	}

	private renderBreadcrumbs(): JSX.Element {
		// const origin = window.location.origin
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
				<ol
					style={{
						margin: 0,
						padding: 0,
						listStyle: 'none',
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						fontSize: '14px',
						paddingLeft: '10px',
					}}
				>
					{breadcrumbs.map((crumb, idx) => (
						<React.Fragment key={idx}>
							{idx > 0 && <li style={{ margin: '0 5px' }}>&gt;</li>}
							<li>
								{idx === lastIndex ? (
									<span style={{ fontWeight: 'bold' }}>{crumb.name}</span>
								) : (
									<a
										href={crumb.url}
										style={{ textDecoration: 'none', color: 'blue' }}
									>
										{crumb.name}
									</a>
								)}
							</li>
						</React.Fragment>
					))}
				</ol>
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
		if (this.observer) {
			this.observer.disconnect()
		}
	}

	public render(): React.ReactElement<IBreadcrumbProps> {
		const { hasTeamsContext } = this.props

		return (
			<section
				ref={this.sectionRef}
				className={`${styles.breadcrumb} ${
					hasTeamsContext ? styles.teams : ''
				}`}
			>
				{this.renderBreadcrumbs()}
			</section>
		)
	}
}
