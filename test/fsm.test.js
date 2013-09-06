
var FSM = require('../lib/FSM.class');
var _ = require('underscore');


var dog = {
	mp: 100,
	sp: 100
}


var states = ['free', 'eating', 'sleeping', 'playing'];
var fsm = new FSM(states);

fsm.onLeave('eating', function() {
	dog.sp += 10;
}).onEnter('eating', function() {
	dog.sp -= 1;
}).onLeave('sleeping', function() {
	dog.mp += 10;
}).onEnter('sleeping', function() {
	dog.mp -= 1;
}).onLeave('playing', function() {
	dog.sp -= 4;
	dog.mp -= 4;
}).onEnter('playing', function() {
	dog.sp += 1;
	dog.mp += 1;
}).setState('free');


_.times(10, function() {
	var r = _.random(0, states.length - 1);
	fsm.setState(states[r]);
});
console.log(dog)

