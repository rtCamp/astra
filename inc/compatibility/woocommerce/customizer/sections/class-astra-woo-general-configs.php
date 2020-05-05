<?php
/**
 * Woo-Cart Content Options for our theme.
 *
 * @package     Astra
 * @author      Brainstorm Force
 * @copyright   Copyright (c) 2020, Brainstorm Force
 * @link        https://www.brainstormforce.com
 * @since       x.x.x
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Woo_General_Configs' ) ) {

	/**
	 * Customizer Sanitizes Initial setup
	 */
	class Astra_Woo_General_Configs extends Astra_Customizer_Config_Base {

		/**
		 * Register Astra-WooCommerce Shop Sidebar Configurations.
		 *
		 * @param Array                $configurations Astra Customizer Configurations.
		 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
		 * @since 1.4.3
		 * @return Array Astra Customizer Configurations with updated configurations.
		 */
		public function register_configuration( $configurations, $wp_customize ) {

			$_configs = array(

				array(
					'name'     => ASTRA_THEME_SETTINGS . '[primary-menu-woo-cart-divider]',
					'section'  => 'section-woo-general',
					'type'     => 'control',
					'control'  => 'ast-heading',
					'required' => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'    => __( 'WooCommerce Cart', 'astra' ),
					'priority' => 60,
					'settings' => array(),
				),

				/**
				 * Option: Hide Last item WooCommerce cart if cart is empty
				 */
				array(
					'name'     => ASTRA_THEME_SETTINGS . '[hide-woo-cart-if-empty]',
					'default'  => astra_get_option( 'hide-woo-cart-if-empty' ),
					'type'     => 'control',
					'control'  => 'checkbox',
					'required' => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '==', 'woocommerce' ),
					'section'  => 'section-woo-general',
					'title'    => __( 'Hide Cart If It\'s Empty', 'astra' ),
					'priority' => 62,
				),

				// Cart general colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[primary-woo-cart-colors]',
					'default'   => astra_get_option( 'primary-woo-cart-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'required'  => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'     => __( 'General', 'astra' ),
					'section'   => 'section-woo-general',
					'transport' => 'postMessage',
					'priority'  => 65,
				),

				// Option: Cart Link / Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-cart-text-color',
					'default'    => astra_get_option( 'primary-woo-cart-text-color' ),
					'title'      => __( 'Link / Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
				),

				// Option: Cart Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-colors]',
					'section'    => 'section-woo-general',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-cart-background-color',
					'default'    => astra_get_option( 'primary-woo-cart-background-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
				),

				// Option: Cart Link Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'name'       => 'primary-woo-cart-link-hover-color',
					'default'    => astra_get_option( 'primary-woo-cart-link-hover-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Link Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 65,
				),

				// Cart Button colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[primary-woo-cart-button-colors]',
					'default'   => astra_get_option( 'primary-woo-cart-button-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'required'  => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'     => __( 'View Cart Button', 'astra' ),
					'section'   => 'section-woo-general',
					'transport' => 'postMessage',
					'priority'  => 70,
				),

				// Option: Cart Button Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-button-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-cart-btn-text-color',
					'default'    => astra_get_option( 'primary-woo-cart-btn-text-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
				),

				// Option: Cart Button Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-button-colors]',
					'section'    => 'section-woo-general',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-cart-btn-background-color',
					'default'    => astra_get_option( 'primary-woo-cart-btn-background-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
				),

				// Option: Cart Button Hover Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-button-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'name'       => 'primary-woo-cart-btn-text-hover-color',
					'default'    => astra_get_option( 'primary-woo-cart-btn-text-hover-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
				),

				// Option: Cart Button Hover Background Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-cart-button-colors]',
					'section'    => 'section-woo-general',
					'tab'        => __( 'Hover', 'astra' ),
					'name'       => 'primary-woo-cart-btn-bg-hover-color',
					'default'    => astra_get_option( 'primary-woo-cart-btn-bg-hover-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 70,
				),

				// Checkout Button colors.
				array(
					'name'      => ASTRA_THEME_SETTINGS . '[primary-woo-checkout-button-colors]',
					'default'   => astra_get_option( 'primary-woo-checkout-button-colors' ),
					'type'      => 'control',
					'control'   => 'ast-settings-group',
					'required'  => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'     => __( 'Checkout Button', 'astra' ),
					'section'   => 'section-woo-general',
					'transport' => 'postMessage',
					'priority'  => 75,
				),

				// Option: Checkout Button Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-checkout-button-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-checkout-btn-text-color',
					'default'    => astra_get_option( 'primary-woo-checkout-btn-text-color' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
				),

				// Option: Checkout Button Background Color.
				array(
					'type'       => 'sub-control',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-checkout-button-colors]',
					'section'    => 'section-woo-general',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'tab'        => __( 'Normal', 'astra' ),
					'name'       => 'primary-woo-checkout-btn-background-color',
					'default'    => astra_get_option( 'primary-woo-checkout-btn-background-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
				),

				// Option: Checkout Button Hover Text Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'tab'        => __( 'Hover', 'astra' ),
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-checkout-button-colors]',
					'section'    => 'section-woo-general',
					'transport'  => 'postMessage',
					'name'       => 'primary-woo-checkout-btn-text-hover-color',
					'default'    => astra_get_option( 'primary-woo-checkout-btn-text-hover-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Text Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
				),

				// Option: Checkout Button Hover Background Color.
				array(
					'type'       => 'sub-control',
					'control'    => 'ast-color',
					'transport'  => 'postMessage',
					'parent'     => ASTRA_THEME_SETTINGS . '[primary-woo-checkout-button-colors]',
					'section'    => 'section-woo-general',
					'tab'        => __( 'Hover', 'astra' ),
					'name'       => 'primary-woo-checkout-btn-bg-hover-color',
					'default'    => astra_get_option( 'primary-woo-checkout-btn-bg-hover-color' ),
					'required'   => array( ASTRA_THEME_SETTINGS . '[header-main-rt-section]', '===', 'woocommerce' ),
					'title'      => __( 'Background Color', 'astra' ),
					'responsive' => true,
					'rgba'       => true,
					'priority'   => 75,
				),
			);

			return array_merge( $configurations, $_configs );

		}
	}
}

new Astra_Woo_General_Configs();



