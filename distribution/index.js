'use strict';

var PropTypes = require('prop-types');
/**
 * react-bootstrap-daterangepicker.js
 *
 * A slightly modified version of bootstrap-daterangepicker.js for use in react and npm.
 * Original copyright in: ./lib/daterangepicker.js
 */
var React = require('react');
var createReactClass = require('create-react-class');
var $ = require('jquery');
var objectAssign = require('object-assign');
var DateRangePicker = require('bootstrap-daterangepicker');
var getOptions = require('./get-options.js');

/* this is our export React class */
module.exports = createReactClass({
	displayName: 'exports',

	$picker: null,
	options: getOptions(),
	makeEventHandler: function makeEventHandler(eventType) {
		return function (event, picker) {
			if (typeof this.props.onEvent === 'function') {
				this.props.onEvent(event, picker);
			}
			if (typeof this.props[eventType] === 'function') {
				this.props[eventType](event, picker);
			}
		}.bind(this);
	},
	getOptionsFromProps: function getOptionsFromProps(props) {
		var options;
		props = props || this.props;
		this.options.forEach(function (option) {
			if (props.hasOwnProperty(option)) {
				options = options || {};
				options[option] = props[option];
			}
		});
		return options || {};
	},
	setOptionsFromProps: function setOptionsFromProps(currentOptions) {
		var keys = Object.keys(currentOptions);
		var $this = this;
		if ($this.$picker) {
			if (currentOptions) {
				keys.forEach(function (key) {
					if (key === 'startDate') {
						$this.$picker.data('daterangepicker').setStartDate(currentOptions[key]);
					} else if (key === 'endDate') {
						$this.$picker.data('daterangepicker').setEndDate(currentOptions[key]);
					} else if (key === 'locale') {
						$.extend($this.$picker.data('daterangepicker')[key], currentOptions[key]);
					} else {
						$this.$picker.data('daterangepicker')[key] = currentOptions[key];
					}
				});
			}
		}
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var $this = this;
		if ($this.$picker) {
			var currentOptions = $this.getOptionsFromProps();
			var nextOptions = $this.getOptionsFromProps(nextProps);
			var changedOptions = {};
			$this.options.forEach(function (option) {
				if (currentOptions[option] !== nextOptions[option]) {
					changedOptions[option] = nextOptions[option];
				}
			});
			$this.setOptionsFromProps(changedOptions);
		}
	},
	componentDidMount: function componentDidMount() {
		this.initializeDateRangePicker();
	},
	componentWillUnmount: function componentWillUnmount() {
		this.removeDateRangePicker();
	},
	removeDateRangePicker: function removeDateRangePicker() {
		this.$picker.data('daterangepicker').remove();
	},
	initializeDateRangePicker: function initializeDateRangePicker() {
		var $this = this;
		$ = window.jQuery && window.jQuery.fn.daterangepicker ? window.jQuery : $;
		$this.$picker = $(this.refs.picker);
		// initialize
		$this.$picker.daterangepicker(this.getOptionsFromProps());
		// attach event listeners
		['Show', 'Hide', 'ShowCalendar', 'HideCalendar', 'Apply', 'Cancel'].forEach(function (event) {
			var lcase = event.toLowerCase();
			$this.$picker.on(lcase + '.daterangepicker', $this.makeEventHandler('on' + event));
		});
	},
	propTypes: {
		"<input>": PropTypes.any,
		alwaysShowCalendars: PropTypes.bool,
		applyClass: PropTypes.string,
		autoApply: PropTypes.bool,
		autoUpdateInput: PropTypes.bool,
		buttonClasses: PropTypes.array,
		cancelClass: PropTypes.string,
		dateLimit: PropTypes.object,
		drops: PropTypes.oneOf(['down', 'up']),
		endDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		isCustomDate: PropTypes.bool,
		isInvalidDate: PropTypes.func,
		linkedCalendars: PropTypes.bool,
		locale: PropTypes.object,
		maxDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		minDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		onApply: PropTypes.func,
		onCancel: PropTypes.func,
		onEvent: PropTypes.func,
		onHide: PropTypes.func,
		onHideCalendar: PropTypes.func,
		onShow: PropTypes.func,
		onShowCalendar: PropTypes.func,
		opens: PropTypes.oneOf(['left', 'right', 'center']),
		parentEl: PropTypes.any,
		ranges: PropTypes.object,
		showCustomRangeLabel: PropTypes.bool,
		showDropdowns: PropTypes.bool,
		showISOWeekNumbers: PropTypes.bool,
		showWeekNumbers: PropTypes.bool,
		singleDatePicker: PropTypes.bool,
		startDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		template: PropTypes.any,
		timePicker: PropTypes.bool,
		timePickerIncrement: PropTypes.number,
		timePicker24Hour: PropTypes.bool,
		timePickerSeconds: PropTypes.bool
	},
	render: function render() {
		var props = objectAssign({ ref: 'picker' }, this.props);

		Object.keys(this.constructor.propTypes).forEach(function (key) {
			delete props[key];
		});

		return React.createElement('div', props, this.props.children);
	}
});