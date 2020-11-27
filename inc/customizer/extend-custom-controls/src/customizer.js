(function ($, api) {
	const $window = $(window),
		$body = $('body');

	const defaultTab = 'general';
	var currentSection = null;
	var currentTab = defaultTab;
	var currentBuilder = null;

	/**
	 * Resize Preview Frame when show / hide Builder.
	 */
	const resizePreviewer = function () {
		var $section = $('.control-section.ahfb-header-builder-active');
		var $footer = $('.control-section.ahfb-footer-builder-active');
		var sidebar_widgets = $('#available-widgets');
		sidebar_widgets.css('bottom', '289px');

		if ($body.hasClass('ahfb-header-builder-is-active') || $body.hasClass('ahfb-footer-builder-is-active')) {
			if ($body.hasClass('ahfb-footer-builder-is-active') && 0 < $footer.length && !$footer.hasClass('ahfb-builder-hide')) {
				api.previewer.container.css('bottom', $footer.outerHeight() + 'px');
			} else if ($body.hasClass('ahfb-header-builder-is-active') && 0 < $section.length && !$section.hasClass('ahfb-builder-hide')) {
				sidebar_widgets.css('bottom', '289px');
				api.previewer.container.css({"bottom": $section.outerHeight() + 'px'});
			} else {
				sidebar_widgets.css('bottom', '46px');
				api.previewer.container.css('bottom', '');
			}
		} else {
			api.previewer.container.css('bottom', '');
		}
	}

	/**
	 * Init Astra Header & Footer Builder
	 */
	const initAstraBuilderPanel = function (panel) {

		let builder = panel.id.includes("-header-") ? 'header' : 'footer';
		var section = api.section('section-' + builder + '-builder');

		const init_control = function (control) {

			if ('resolved' === control.deferred.embedded.state()) {
				return;
			}
			control.renderContent();
			control.deferred.embedded.resolve(); // This triggers control.ready().

			// Fire event after control is initialized.
			control.container.trigger('init');

		}

		if (section) {

			var $section = section.contentContainer,
				section_layout = api.section('section-' + builder + '-builder-layout');

			panel.expanded.bind(function (isExpanded) {

				currentBuilder = section;
				currentSection = section_layout;

				initiate_tabs(currentSection, currentTab);
				initiate_tabs(currentBuilder, currentTab);

				_.each(section.controls(), function (control) {
					init_control(control);
				});
				_.each(section_layout.controls(), function (control) {
					init_control(control);
				});

				if (isExpanded) {
					$body.addClass('ahfb-' + builder + '-builder-is-active');
					$section.addClass('ahfb-' + builder + '-builder-active');
				} else {

					// Setting general context when collapsed.
					api.state('astra-customizer-tab').set(defaultTab);

					$body.removeClass('ahfb-' + builder + '-builder-is-active');
					$section.removeClass('ahfb-' + builder + '-builder-active');
				}

				resizePreviewer();

			});
			$section.on('click', '.ahfb-builder-tab-toggle', function (e) {
				e.preventDefault();
				$section.toggleClass('ahfb-builder-hide');
				resizePreviewer();
			});
		}
	};

	var get_setting = function (settingName) {

		switch (settingName) {
			case 'ast_selected_device':
				return api.previewedDevice.get();
			case 'ast_selected_tab':
				return currentTab;
			default:
				return api(settingName).get();
		}
	}

	var is_displayed = function (rules) {

		let relation = 'AND',
			displayed = true;

		// Each rule iteration
		_.each(rules, function (rule, i) {

			var result = false,
				setting = get_setting(rule['setting']);

			if (undefined !== setting) {
				var operator = rule['operator'],
					comparedValue = rule['value'],
					currentValue = setting;

				if (undefined == operator || '=' == operator) {
					operator = '==';
				}

				switch (operator) {
					case 'in':
						result = 0 <= comparedValue.indexOf(currentValue);
						break;

					default:
						result = comparedValue == currentValue;
						break;
				}
			}

			switch (relation) {
				case 'OR':
					displayed = displayed || result;
					break;

				default:
					displayed = displayed && result;
					break;
			}
		});

		return displayed;
	};

	/**
	 * API for control/section/panel registrations.
	 */
	const AstCustomizerAPI = {

		addPanel: function (id, data) {

			// Return if panel already exists.
			if (api.panel(id)) {
				return;
			}

			var Constructor = api.panelConstructor[data.type] || api.Panel, options;
			options = _.extend({params: data}, data);
			api.panel.add(new Constructor(id, options));

			if ('panel-footer-builder-group' === id || 'panel-header-builder-group' === id) {
				$('#accordion-panel-' + id).find('.accordion-section-title').append("<span class=\'ahfb-highlight\'> New </span>");
			}

			// Scroll to footer.
			if ('panel-footer-builder-group' === id) {
				$('#accordion-panel-' + id).on('click', function () {
					let $iframeBody = $body.find('iframe').contents().find('body');
					$body.find('iframe').contents().find('body, html').animate({
						scrollTop: $iframeBody[0].scrollHeight
					}, 500);
				});
			}

			// Scroll to header.
			if ('panel-header-builder-group' === id) {
				$('#accordion-panel-' + id).on('click', function () {
					$body.find('iframe').contents().find('body, html').animate({
						scrollTop: 0
					}, 500);
				});
			}
		},

		addSection: function (id, data) {

			// Return if section already exists.
			if (api.section(id)) {
				if (id.startsWith("sidebar-widgets-")) {
					api.section(id).panel(data['panel']); // Change panel.
					return;
				}
				api.section.remove(id);
			}

			var Constructor = api.sectionConstructor[data.type] || api.Section, options;
			options = _.extend({params: data}, data);
			api.section.add(new Constructor(id, options));

		},

		addSubControl: function (parent_control_id) {

			if ('undefined' != typeof AstraBuilderCustomizerData) {
				let sub_controls = AstraBuilderCustomizerData.js_configs.sub_controls[parent_control_id] || [];
				if (sub_controls) {
					for (let i = 0; i < sub_controls.length; i++) {
						let config = sub_controls[i];
						AstCustomizerAPI.addControl(config.id, config);
					}
				}
			}
		},

		addControl: function (id, data) {

			// Return if control already exists.
			if (api.control(id)) {
				return;
			}

			var Constructor = api.controlConstructor[data.type] || api.Control, options;
			options = _.extend({params: data}, data);
			api.control.add(new Constructor(id, options));

			// Change description to tooltip.
			change_description_as_tooltip(api.control(id));

			if ('ast-settings-group' === data['type']) {
				this.addSubControl(id);
			}
		},

		registerControlsBySection: function (section) {

			if ('undefined' != typeof AstraBuilderCustomizerData) {
				let controls = AstraBuilderCustomizerData.js_configs.controls[section.id] || [];
				if (controls) {
					for (let i = 0; i < controls.length; i++) {
						let config = controls[i];
						this.addControl(config.id, config);
					}
				}
			}
		},

		setControlVisibilityBySection: function (section) {

			if ('undefined' != typeof AstraBuilderCustomizerData) {
				$.each(section.controls(), function (id, control) {
					let context = AstraBuilderCustomizerData.contexts[control.id];
					if (context) {
						if (is_displayed(context)) {
							api.control(control.id).activate({duration: 0});
						} else {
							api.control(control.id).deactivate({duration: 0});
						}
					} else {
						if (!control.id.startsWith('astra-settings')) { // WP Configs
							if (defaultTab === currentTab) {
								api.control(control.id).activate({duration: 0});
							} else {
								api.control(control.id).deactivate({duration: 0});
							}
						}
					}
				});
			}
		},

		initializeConfigs: function () {

			if ('undefined' != typeof AstraBuilderCustomizerData && AstraBuilderCustomizerData.js_configs) {

				let panels = AstraBuilderCustomizerData.js_configs.panels || [];
				let sections = AstraBuilderCustomizerData.js_configs.sections || [];
				let controls = Object.assign({}, AstraBuilderCustomizerData.js_configs.controls || []);

				for (const [panel_id, config] of Object.entries(panels)) {
					AstCustomizerAPI.addPanel(panel_id, config);
				}

				// Add controls to theme sections.
				for (const [section_id, config] of Object.entries(sections)) {
					AstCustomizerAPI.addSection(section_id, config);
					AstCustomizerAPI.registerControlsBySection(api.section(section_id));
					delete controls[section_id];
				}

				// Add controls to third party sections.
				for (const [section_id, config] of Object.entries(controls)) {

					if ("undefined" === typeof api.section(section_id)) {
						continue;
					}

					AstCustomizerAPI.registerControlsBySection(api.section(section_id));
				}

				api.panel('panel-header-builder-group', initAstraBuilderPanel)
				api.panel('panel-footer-builder-group', initAstraBuilderPanel);

			}
		},

		moveDefaultSection: function () {

			// Updating Section for wp default controls.
			if ('undefined' != typeof AstraBuilderCustomizerData && AstraBuilderCustomizerData.js_configs.wp_defaults) {
				for (const [control, section] of Object.entries(AstraBuilderCustomizerData.js_configs.wp_defaults)) {
					api.control(control).section(section);
				}
			}
		}
	};

	/**
	 * Change description to tooltip.
	 * @param ctrl
	 */
	const change_description_as_tooltip = function (ctrl) {

		var desc = ctrl.container.find(".customize-control-description");
		if (desc.length) {
			var title = ctrl.container.find(".customize-control-title");
			var li_wrapper = desc.closest("li");

			var tooltip = desc.text().replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
				return '&#' + i.charCodeAt(0) + ';';
			});
			desc.remove();
			li_wrapper.append(" <i class=\'ast-control-tooltip dashicons dashicons-editor-help\'title=\'" + tooltip + "\'></i>");
		}
	}

	/**
	 * Highliting the active componenet.
	 * @param customizer_section
	 */
	const highlight_active_component = function (customizer_section) {
		var builder_items = $('.ahfb-builder-drop .ahfb-builder-item');
		$.each(builder_items, function (i, val) {
			var component_section = $(val).attr('data-section');
			if (component_section === customizer_section.id && $('#sub-accordion-section-' + component_section).hasClass('open')) {
				$(val).addClass('active-builder-item');
			} else {
				$(val).removeClass('active-builder-item');
			}
		});
	}

	const initiate_tabs = function (currentSection, currentTab) {

		if (!currentSection) {
			return;
		}

		AstCustomizerAPI.setControlVisibilityBySection(currentSection);
		let $tabs = $('.ahfb-compontent-tabs-button:not(.ahfb-nav-tabs-button)');
		$tabs.removeClass('nav-tab-active').filter('.ahfb-' + currentTab + '-tab').addClass('nav-tab-active');
	}

	/**
	 * Highliting the active row.
	 * @param customizer_section
	 */
	const highlight_active_row = function (customizer_section) {
		// Highlight builder rows.
		var builder_rows = $('.ahfb-builder-items .ahfb-builder-areas');
		$.each(builder_rows, function (i, val) {
			var builder_row = $(val).attr('data-row-section');
			if (builder_row === customizer_section.id && $('#sub-accordion-section-' + builder_row).hasClass('open')) {
				$(val).addClass('active-builder-row');
			} else {
				$(val).removeClass('active-builder-row');
			}
		});
	}

	/**
	 * Set context using URL query params.
	 */
	const set_context_by_url_params = function () {

		let urlParams = new URLSearchParams(window.location.search);
		let tab = urlParams.get("context");

		if (tab) {
			currentTab = tab;
		}
	}

	api.bind('ready', function () {

		api.state.create('astra-customizer-tab');
		api.state('astra-customizer-tab').set(defaultTab);

		// Set handler when custom responsive toggle is clicked.
		$('#customize-theme-controls').on('click', '.ahfb-build-tabs-button:not(.ahfb-nav-tabs-button)', function (e) {
			e.preventDefault();
			api.previewedDevice.set($(this).attr('data-device'));
		});

		// Set handler when custom responsive toggle is clicked.
		$('#customize-theme-controls').on('click', '.ahfb-compontent-tabs-button:not(.ahfb-nav-tabs-button)', function (e) {
			e.preventDefault();
			currentTab = $(this).attr('data-tab');
			initiate_tabs(currentSection, currentTab);

			setTimeout(function () {
				api.state('astra-customizer-tab').set(currentTab);
			}, 50);

		});

		$window.on('resize', resizePreviewer);

		AstCustomizerAPI.initializeConfigs();
		api.section.each(function (section) {
			section.expanded.bind(function (isExpanded) {

				if (!isExpanded) {

					// Setting general context when collapsed.
					setTimeout(function () {
						api.state('astra-customizer-tab').set(defaultTab);
					}, 50);


				} else {

					currentSection = api.section(section.id);

					setTimeout(function () {
						api.state('astra-customizer-tab').set(currentTab);
					}, 50);

					initiate_tabs(currentSection, currentTab);

				}

				set_context_by_url_params();

				_.each(section.controls(), function (control) {
					highlight_active_component(currentSection);
					highlight_active_row(currentSection);
				});

			});
		});

		AstCustomizerAPI.moveDefaultSection();

		api.previewedDevice.bind(function (new_device, old_device) {
			if (old_device) {
				initiate_tabs(currentSection, currentTab);
				initiate_tabs(currentBuilder, currentTab);
			}
		});

	});

})(jQuery, wp.customize);
