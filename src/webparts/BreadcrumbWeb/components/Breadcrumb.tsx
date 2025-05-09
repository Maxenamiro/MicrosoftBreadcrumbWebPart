import * as React from 'react'
import styles from './Breadcrumb.module.scss'
import type { IBreadcrumbProps } from './IBreadcrumbProps'

export default class Breadcrumb extends React.Component<IBreadcrumbProps> {
	private observer: MutationObserver | null = null
	private sectionRef = React.createRef<HTMLElement>()

	private renderBreadcrumbs(): JSX.Element {
		const origin = window.location.origin
		const path = window.location.pathname

		const breadcrumbs = path
			.split('/')
			.filter(Boolean)
			.filter((part) => part !== '_layouts' && part !== '15')
			.reduce<{ name: string; url: string }[]>(
				(acc, part, index, array) => {
					const name = decodeURIComponent(part)

					if (name === 'sites') return acc

					if (name === 'SitePages' && index + 1 < array.length) {
						const pageName = array[index + 1].replace('.aspx', '')
						acc.push({
							name: decodeURIComponent(pageName),
							url: origin + '/' + array.slice(0, index + 2).join('/'),
						})
						return acc
					}

					if (name === 'SitePages' || name.endsWith('.aspx')) return acc

					const url = origin + '/' + array.slice(0, index + 1).join('/')
					if (part !== 'SitePages') {
						acc.push({ name, url })
					}

					return acc
				},
				[{ name: 'Home', url: origin }]
			)

		return (
			<nav aria-label='breadcrumb' className={styles.breadcrumb}>
				<ul style={{ listStyle: 'none', padding: 0, display: 'flex' }}>
					{breadcrumbs.map((crumb, idx) => (
						<li key={idx}>
							<a
								href={crumb.url}
								style={{ textDecoration: 'none', color: 'black' }}
							>
								{crumb.name}
							</a>
							{idx < breadcrumbs.length - 1 && (
								<span style={{ margin: '0 4px' }}>&gt;</span>
							)}
						</li>
					))}
				</ul>
			</nav>
		)
	}

	componentDidMount() {
		const section = this.sectionRef.current
		const wrapper = section?.parentElement as HTMLElement
		if (!wrapper) return

		const applyStyles = () => {
			// wrapper.style.display = 'flex'
			// wrapper.style.justifyContent = 'center'
			// wrapper.style.textAlign = 'center'
			wrapper.style.color = 'black'
		}

		applyStyles()

		this.observer = new MutationObserver(() => {
			applyStyles()
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
				className={`${styles.breadcrumb} ${hasTeamsContext ? styles.teams : ''}`}
			>
				{this.renderBreadcrumbs()}
			</section>
		)
	}
}
