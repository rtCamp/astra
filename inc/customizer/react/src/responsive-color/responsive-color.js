import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';

class ResponsiveColorComponent extends Component {

	constructor(props) {

		super( props );

		let value = this.props.control.setting.get();

		this.state = {
			value
		};

		this.onColorChange = this.onColorChange.bind(this);
	}

	onColorChange( key ) {
		const obj = {
			...this.state.value, 
		};
		obj[ key ] = event.target.value
		this.setState( { value : obj } )
		this.props.control.setting.set( obj );
	}
	render() {
		
		const {
			defaultValue,
			label,
			description,
			responsive,
			value,
			rgba,
			name
		} = this.props.control.params

		let defaultVal = '#RRGGBB';
		let defaultValueAttr = '';
		let labelHtml = null;
		let responsiveHtml = null;
		let inputHtml = null;
		let value_desktop = '';
		let value_tablet  = '';
		let value_mobile  = '';


		if ( defaultValue ) {

			if ( '#' !== defaultValue.substring( 0, 1 ) ) {
				defaultVal = '#' + defaultValue;
			} else {
				defaultVal = defaultValue;
			}

			defaultValueAttr = ' data-default-color=' + defaultVal; // Quotes added automatically.
		}

		if ( label ) { 

			labelHtml = <span className="customize-control-title">{ label }</span>
		} 

		if ( description ) { 

			labelHtml = <span className="description customize-control-description">{ description }</span>
		}

		if ( value['desktop'] ) { 

			value_desktop = this.state.value.desktop;
		} 

		if ( value['tablet'] ) { 

			value_tablet = this.state.value.tablet;
		} 

		if ( value['mobile'] ) { 

			value_mobile = this.state.value.mobile;
		} 

		if ( responsive ) {

			responsiveHtml = (
				<ul className="ast-responsive-btns">
					<li className="desktop active">
						<button type="button" className="preview-desktop" data-device="desktop">
							<i className="dashicons dashicons-desktop"></i>
						</button>
					</li>
					<li className="tablet">
						<button type="button" className="preview-tablet" data-device="tablet">
							<i className="dashicons dashicons-tablet"></i>
						</button>
					</li>
					<li className="mobile">
						<button type="button" className="preview-mobile" data-device="mobile">
							<i className="dashicons dashicons-smartphone"></i>
						</button>
					</li>
				</ul>
			)
			
			inputHtml = (
				<>
					<input className="ast-color-picker-alpha color-picker-hex ast-responsive-color desktop active" type="text" data-name={ name } data-alpha={ rgba } data-id='desktop' placeholder={ defaultValue } { ...defaultValueAttr } value={ value_desktop } onChange={ () => this.onColorChange( 'desktop' ) } />

					<input className="ast-color-picker-alpha color-picker-hex ast-responsive-color tablet" type="text" data-name={ name } data-alpha={ rgba } data-id='tablet' placeholder={ defaultValue } { ...defaultValueAttr } value={ value_tablet } onChange={ () => this.onColorChange( 'tablet' ) } />

					<input className="ast-color-picker-alpha color-picker-hex ast-responsive-color mobile" type="text" data-name={ name } data-alpha={ rgba } data-id='mobile' placeholder={ defaultValue } { ...defaultValueAttr } value={ value_mobile } onChange={ () => this.onColorChange( 'mobile' ) } />
				</>
			)
		}

		return (
			<>
				<label>
					{ labelHtml }
				</label>

				{ responsiveHtml }

				<div className="customize-control-content">
					{ inputHtml }
				</div>
			</>
		);
	}
}

ResponsiveColorComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default ResponsiveColorComponent;
