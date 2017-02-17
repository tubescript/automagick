/**
 * @class Spinner Control Widget
 *
 * @author Ken Snyder (kendsnyder at gmail dot com)
 * @date 2007-07-15
 * @version 1.0
 * @license Creative Commons Attribution 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @requires Prototype version 1.5.0 or newer
 * @tested in FF2, IE7, Safari 3, Opera 9
 */
var SpinnerControl = Class.create();

SpinnerControl.prototype = {
  /**
   * @constructor  Create the spinner using an input, an up button, and a down button
   *
   * @param string/Element  inputElement
   * @param string/Element  upElement
   * @param string/Element  downElement
   * @param object          options
   * Available Options:
   *   interval     The amount to increment (default=1)
   *   round        The number of decimal points to which to round (default=0)
   *   min          The lowest allowed value, false for no min (default=false)
   *   max          The highest allowed value, false for no max (default=false)
   *   prefix       String to prepend when updating (default='')
   *   suffix       String to append when updating (default='')
   *   data         An array giving a list of items through which to iterate (default=false)
   *   onIncrement  Function to call after incrementing
   *   onDecrement  Function to call after decrementing
   *   afterUpdate  Function to call after update of the value
   *   onStop       Function to call on click or mouseup
   * @return void
   */
  
  observed:false,
  keyStartBind:null,
  blurBind:null,
  clickStart:null,
  clickStart2:null,
  
  initialize: function(inputElement, upElement, downElement, options) {
    // store the elements
    this.inputElement = $(inputElement);
    this.upElement = $(upElement);
    this.downElement = $(downElement);
    // store the options
    this.options = Object.extend({
      interval: 1,
      round: 0,
      min: false,
      max: false,
      prefix: '',
      suffix: '',
      data: false,
      onIncrement: Prototype.emptyFunction,      
      onDecrement: Prototype.emptyFunction,      
      afterUpdate: '',
      onStop: Prototype.emptyFunction      
    }, options);
    // set initial values
    this.reset();
    // build our update function
    this.buildUpdateFunction();
    // define the rate of increasing speed
    if (Prototype.Browser.IE) {
      this.speedHash = {5: 300, 10: 175, 20: 90, 30: 17};
    } else {
      this.speedHash = {5: 250, 10: 85, 20: 35, 30: 10};
    }
    // attach listeners
    this.observe();
  },
  /**
   * Helper function to define the update function
   *
   * @return void
   */
  buildUpdateFunction: function() {
    // do we have a data list?
    if (this.options.data == false) {
      // no, we are an integer or decimal
      this.updateValue = function(multiplier) {
        // parse the value ignoring the substring
        var value = parseFloat(this.inputElement.value.replace(/^(.*?)([\-\d\.]+)(.*)$/, '$2'));
        if (isNaN(value)) value = this.options.min || 0;
        // what are we adding
        if (multiplier == 1) {
          value = (value + this.options.interval).toFixed(this.options.round);
        } else if (multiplier == -1) {
          value = (value - this.options.interval).toFixed(this.options.round);
        }
        // ensure value falls between the min and max
        if (this.options.min !== false)
          value = Math.max(this.options.min, value);
        if (this.options.max !== false)
          value = Math.min(this.options.max, value);            
        this.setValue(value);
        // call our afterUpdate function
        eval(this.options.afterUpdate);
      }.bind(this);
      // set an initial value if not given
      if (this.inputElement.value === '') {
        this.inputElement.value = this.options.min || 0;
      }
    } else if (this.options.data.constructor == Array && this.options.data.length) {
      // we have a data list
      // set the position pointer to the current or first element
      var current = this.options.data.indexOf(this.inputElement.value);
      this.pos = current == -1 ? 0 : current;
      // define our function
      this.updateValue = function(multiplier) {
        // advance the pointer forward or backward, wrapping between the last and first item
        this.pos = this.pos + multiplier;
        this.pos = this.pos < 0 ? this.options.data.length -1 : (
          this.pos > this.options.data.length - 1 ? 0 : this.pos
        );
        // update the value to the prefix, plus the rounded number, plus the suffix
        this.setValue(this.options.data[this.pos]);
        // call our afterUpdate function
        eval(this.options.afterUpdate);
      }.bind(this);
      // set an initial value if not given
      if (this.inputElement.value === '') {
        this.inputElement.value = this.options.data[0];
      }
    } else {
      // we have an invalid data option
      throw new Error('SpinnerControl.initialize(): invlalid value for options.data');
    }  
  },
  setValue: function(value) {
    this.inputElement.value = this.options.prefix + value + this.options.suffix;  
  },
  /**
   * Helper function to attach listeners
   */
  observe: function() {
    // define a pre-bound stop function
    var stop = this.stop.bind(this);
    // observe the input

    this.keyStartBind=this.keyStart.bindAsEventListener(this);
    this.blurBind=this.updateValue.bind(this, 0);
    this.clickStart=this.clickStart.bind(this, 1);
    this.clickStart2=this.clickStart2.bind(this, -1);
    
    this.inputElement
      // begin incrementing at start of a keypress
      .observe('keydown', this.keyStartBind)
      // stop incrementing at the end of a keypress
      .observe('keyup', stop)
      // reformat and enforce min-max for typed values
      .observe('blur', this.blurBind);
    // observe the up element
    this.upElement
      // begin incrementing at start of click
      .observe('mousedown',this.clickStart)
      // stop incrementing at end of click
      .observe('mouseup', stop)
      // in the case of a click and drag, also stop
      .observe('mouseout', stop);
    // observe the down element
    this.downElement
      // begin decrementing at start of click
      .observe('mousedown', this.clickStart2)
      // stop decrementing at end of click
      .observe('mouseup', stop)
      // in the case of a click and drag, also stop
      .observe('mouseout', stop);
      
    this.observed=true;
  },
  
  /**
   * Helper function to dettach listeners
   */
  stopObserving: function(){
  	// define a pre-bound stop function
    var stop = this.stop.bind(this);
    // observe the input
    this.inputElement
      // begin incrementing at start of a keypress
      .stopObserving('keydown', this.keyStartBind)
      // stop incrementing at the end of a keypress
      .stopObserving('keyup', stop)
      // reformat and enforce min-max for typed values
      .stopObserving('blur', this.blurBind);
    // stopObserving the up element
    this.upElement
      // begin incrementing at start of click
      .stopObserving('mousedown', this.clickStart)
      // stop incrementing at end of click
      .stopObserving('mouseup', stop)
      // in the case of a click and drag, also stop
      .stopObserving('mouseout', stop);
    // stopObserving the down element
    this.downElement
      // begin decrementing at start of click
      .stopObserving('mousedown', this.clickStart2)
      // stop decrementing at end of click
      .stopObserving('mouseup', stop)
      // in the case of a click and drag, also stop
      .stopObserving('mouseout', stop);
      
    this.observed=false;
  },
  
  /**
   * Start incrementing or decrementing based on a pressed key
   *
   * @event keydown on this.inputElement
   * @param object evt
   * @return void
   */
  keyStart: function(evt) {
    if (this.running == false) {
      if (evt.keyCode == Event.KEY_UP) {
        this.running = 'key';
        this.increment();
      } else if (evt.keyCode == Event.KEY_DOWN) {
        this.running = 'key';
        this.decrement();
      }
    }
  },
  /**
   * Start incrementing or decrementing based on a mousedown action
   *
   * @param boolean multiplier  If multipler is 1, increment
   * @return void
   */  
  clickStart: function(multiplier) {
    this.running = 'mouse';
    if (multiplier == 1) {
      this.increment();
    } else {
      this.decrement();
    }
  },
  
  clickStart2: function(multiplier) {
    this.running = 'mouse';
    this.decrement();
  },
  /**
   * Set to resting state
   *
   * return @void
   */
  reset: function() {
    // blur the up/down buttons if we got started by clicking
    if (this.running == 'mouse') {
      this.upElement.blur();
      this.downElement.blur();      
    }
    this.running = false;
    this.iterations = 0;
  },
  /**
   * Reset and clear timeout
   *
   * @return void
   */
  stop: function() {
    this.reset();
    window.clearTimeout(this.timeout);
    this.options.onStop(this);
  },
  /**
   * Increment the value
   *
   * @return void
   */
  increment: function() {
    this.updateValue(1);
    this.timeout = window.setTimeout(this.increment.bind(this), this.getSpeed());
    this.options.onIncrement(this);
  },
  /**
   * Decrement the value
   *
   * @return void
   */  
  decrement: function() {
    this.updateValue(-1);
    this.timeout = window.setTimeout(this.decrement.bind(this), this.getSpeed());
    this.options.onDecrement(this);
  },
  /**
   * Get the delay for the next timeout
   * Overwrite this function for custom speed schemes
   *
   * @return integer
   */  
  getSpeed: function() {
    this.iterations++;
    for (var iterations in this.speedHash) {
      if (this.iterations < iterations) {
        return this.speedHash[iterations];
      }
    }
    return this.speedHash[30];
  },
  
  isObserved: function() {
  	return this.observed;
  }
  
};