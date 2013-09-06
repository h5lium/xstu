
var _ = require('underscore');

function FSM(states) {
	this.states = states || [];
	this.state = null;
	this.onEnterHandlers = {};
	this.onLeaveHandlers = {};
}
FSM.prototype.setState = function(state) {
	if (state === this.state) {
		return this;
	}
	var self = this;
	_.each(this.onLeaveHandlers[this.state], function(val) {
		val.apply(self);
	});
	this.state = state;
	_.each(this.onEnterHandlers[state], function(val) {
		val.apply(self);
	});
	return this;
}
FSM.prototype.getState = function() {
	return this.state;
}
FSM.prototype.onEnter = function(states, handler) {
	return this.on(states, handler, 'enter');
}
FSM.prototype.onLeave = function(states, handler) {
	return this.on(states, handler, 'leave');
}
FSM.prototype.on = function(states, handler, type) {
	type = type[0].toUpperCase() + type.substr(1).toLowerCase();
	var store = this['on'+ type +'Handlers'];
	_.each(states === '*' ? this.states : states.split(' '), function(val) {
		if (store[val]) {
			store[val].push(handler);
		} else {
			store[val] = [handler];
		}
	});
	return this;
}

// expose
module.exports = FSM;
