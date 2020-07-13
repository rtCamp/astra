import PropTypes from 'prop-types';
import { Component } from '@wordpress/element';
import { ReactSortable } from "react-sortablejs";

class SortableComponent extends Component {
	
	constructor( props ) {

		super( props );

		let value = this.props.control.setting.get()

		this.state = {
			value
		};

		this.onDragEnd = this.onDragEnd.bind(this);
		this.itemOnClick = this.itemOnClick.bind(this);
	}
	
	onDragEnd( items ) {

		let updateState = this.state.value;
		let update = updateState;
		let updateItems = [];
		{ items.length > 0 && (
			items.map( ( item ) => {
				updateItems.push( item.id );
			} )
		) };
		if ( JSON.stringify( update ) !== JSON.stringify( updateItems ) ) {
			update = updateItems;
			updateState = updateItems;
			this.setState( { value: updateState } );
			this.props.control.setting.set( updateState );
		}
	}
	
	itemOnClick( e ) {
		
		let obj = this.state.value;

		e.target.classList.toggle( "dashicons-visibility-faint" )
		e.currentTarget.classList.toggle( "invisible" )
		delete  obj[ e.currentTarget.dataset.value ]
		
		this.setState( { value: obj } );
		this.props.control.setting.set( obj );

	}
	render() {

		let labelHtml = null;
		let descriptionHtml = null;
		let visibleMetaHtml = null;
		let invisibleMetaHtml = null;
		let theItems = [];

		const {
			label,
			description,
			value,
			choices,
			inputAttrs
		} = this.props.control.params
		
		{ this.state.value.map( ( item ) => {
			theItems.push(
				{
					id: item,
				}
			)
		} ) }

		if ( label ) {

			labelHtml = <span className="customize-control-title">{ label }</span>;
		}

		if ( description ) {
			
			descriptionHtml = <span className="description customize-control-description">{ description }</span>;
		}

		visibleMetaHtml = Object.values( this.state.value ).map( ( choiceID ) => {

			if ( choices[ choiceID ] ) { 
				
				var html = ( 
					<li { ...inputAttrs } onClick={ ( e ) => this.itemOnClick( e ) } key={ choiceID } className='ast-sortable-item ui-sortable-handle' data-value={ choiceID } >
						<i className='dashicons dashicons-menu'></i>
						<i className="dashicons dashicons-visibility visibility"></i>
						{ choices[ choiceID ] }
					</li> 
				);
			}

			return html;
		} );

		invisibleMetaHtml = Object.keys( choices ).filter( ( choiceID ) => {

			if ( Array.isArray( value ) && -1 === value.indexOf( choiceID ) ) { 
				
				var html = ( 
					<li { ...inputAttrs } onClick={ this.itemOnClick } key={ choiceID } className='ast-sortable-item ui-sortable-handle invisible' data-value={ choiceID }>
						<i className='dashicons dashicons-menu'></i>
						<i className="dashicons dashicons-visibility visibility"></i>
						{ choices[ choiceID ] }
					</li> 
				);
			}
			
			return html;
			
		} );
		return (
			<label className='ast-sortable'>
				{ labelHtml }
				{ descriptionHtml }
				<ul className="sortable">
					<ReactSortable className="ui-sortable" animation={100}  handle={ '.ui-sortable-handle' } list={ theItems } setList={ ( newState ) => this.onDragEnd( newState ) } >
						{ visibleMetaHtml }
						{/* { invisibleMetaHtml } */}
					</ReactSortable>
				</ul>
			</label>	
		);
	}
}

SortableComponent.propTypes = {
	control: PropTypes.object.isRequired
};

export default SortableComponent;
