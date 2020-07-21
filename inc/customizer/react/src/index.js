import { BaseControl } from './base/control';
import { headingControl } from './heading/control';
import { hiddenControl } from './hidden/control';
import { descriptionControl } from './description/control';
import { settingsGroupControl } from './settings-group/control';
import { colorControl } from './color/control.js';
import { responsiveBackgroundControl } from './responsive-background/control';

wp.customize.controlConstructor['ast-heading'] = headingControl;
wp.customize.controlConstructor['ast-hidden'] = hiddenControl;
wp.customize.controlConstructor['ast-description'] = descriptionControl;
wp.customize.controlConstructor['ast-settings-group'] = settingsGroupControl;
wp.customize.controlConstructor['ast-color'] = colorControl;
wp.customize.controlConstructor['ast-responsive-background'] = responsiveBackgroundControl;

window.addEventListener( 'load', () => {
    console.log('Testing Console.');
} );