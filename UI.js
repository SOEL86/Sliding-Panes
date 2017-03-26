/*jslint browser: true*/
/*global $, randomColor, TweenMax, Draggable, console*/
function Windows() {
	"use strict";
	var	appendCode,
		landscapeEvent,
		portraitEvent,
		windowLandscapeEvent,
		windowPortraitEvent,
		instanceDirection,
		setBarPosition,
		windowSize,
		makeClickable,
		toggleClickEvents,
		hideHandles,
		calculatePercent,
		windowDirection,
		sizeInstance,
		onPress,
		onDrag,
		onRelease,
		createDraggable,
		toggleOverlay,
		readyToCloseCheck,
		appendInstance;
	
	//Add basic instance HTML
	appendCode = function (e) {
		e.append('<div class="instance landscape"><div class="window one ' + randomColor() + ' landscape"></div><div class="bar" percent="50"><div class="handle w3-white"></div></div><div class="window two ' + randomColor() + ' landscape"></div></div>');
	};
	
	/*orientation events*/
	landscapeEvent = function (instance) {
		instance.removeClass("portrait");
		instance.addClass("landscape");
	};
	portraitEvent = function (instance) {
		instance.removeClass("landscape");
		instance.addClass("portrait");
	};
	windowLandscapeEvent = function (win) {
		win.removeClass("portrait");
		win.addClass("landscape");
	};
	windowPortraitEvent = function (win) {
		win.removeClass("landscape");
		win.addClass("portrait");
	};
	
	//calls an event when orientation changes
	instanceDirection = function (instance) {
		var width = instance.width(),
			height = instance.height();
		if (width > height) {
			if (instance.hasClass("portrait")) {
				landscapeEvent(instance);
			}
		} else {
			if (instance.hasClass("landscape")) {
				portraitEvent(instance);
			}
		}
	};
	//recalculate the bar offset to a percent of its parent
	setBarPosition = function (instance, bar, percent) {
		if (instance.hasClass("landscape")) {
			TweenMax.set(bar, {x: percent * instance.width() / 100, y: 0});
		} else {
			TweenMax.set(bar, {x: 0, y: percent * instance.height() / 100});
		}
	};
	//updates the scale of windows one and two
	windowSize = function (instance, one, two, percent) {
		if (instance.hasClass("landscape")) {
			TweenMax.set(one, {
				width: percent + "%",
				clearProps: "height"
			});
			TweenMax.set(two, {
				width: 100 - percent + "%",
				clearProps: "height"
			});
		} else {
			TweenMax.set(one, {
				"height": percent + "%",
				clearProps: "width"
			});
			TweenMax.set(two, {
				"height": 100 - percent + "%",
				clearProps: "width"
			});
		}
	};
	//*temporary* - makes window elements create new instances on click
	makeClickable = function (one, two) {
		one.on("click", function () {
			one.off("click");
			appendInstance(one);
		});
		two.on("click", function () {
			two.off("click");
			appendInstance(two);
		});
	};
	//adds or removes mouse events from all elements
	toggleClickEvents = function () {
		var win = $("div");
		if (!win.hasClass("disabled")) {
			win.addClass("disabled");
		} else {
			win.removeClass("disabled");
		}
	};
	//hides all handles except that being dragged
	hideHandles = function (handle) {
		$(".handle").each(function () {
			if ($(this)[0] !== handle[0]) {
				$(this).hide();
			}
		});
	};
	//updates the % position of the bar
	calculatePercent = function (instance, bar) {
		var percent;
		if (instance.hasClass("landscape")) {
			percent = Draggable.get(bar).x * 100 / instance.width();
		} else {
			percent = Draggable.get(bar).y * 100 / instance.height();
		}
		bar.attr("percent", percent);
		return percent;
	};
	//calls an event if the direction of the window has changed
	windowDirection = function (win) {
		var width = win.width(),
			height = win.height();
		if (width > height) {
			if (win.hasClass("portrait")) {
				windowLandscapeEvent(win);
			}
		} else {
			if (win.hasClass("landscape")) {
				windowPortraitEvent(win);
			}
		}
	};
	sizeInstance = function (win) { //checks that a window has an instance in it and resizes it, then checks if that instance has child instances

		var instance = win.children(), bar, percent, one, two;
		if (instance.length > 0) {

			bar = instance.children().eq(1);
			percent = parseFloat(bar.attr("percent"));
			one = bar.prev();
			two = bar.next();

			//sets orientation of instance
			instanceDirection(instance);
			//positions the bar correctly
			setBarPosition(instance, bar, percent);
			//resizes the windows
			windowSize(instance, one, two, percent);
			//calls this function again which will only reach this point if win has no children
			sizeInstance(one);
			sizeInstance(two);
		}
	};
	
	/* Draggable Events */
	onPress = function (handle) {
	//disabling window events
		toggleClickEvents();
	//hiding the other bars
		hideHandles(handle);
	};
	onDrag = function (instance, bar, one, two) { //every time the bar moves 1px
		var percent = calculatePercent(instance, bar);
		windowSize(instance, one, two, percent);
	};
	onRelease = function (instance, bar, one, two) { //when the bar stops
	//updating the windows to new bar % position
		windowSize(instance, one, two, calculatePercent(instance, bar));
	//updating orientation of the two windows
		windowDirection(one);
		windowDirection(two);
	//enabling window events
		toggleClickEvents();
	//showing the bars
		$(".handle").show();
	//resize instances embedded within the windows of this instance
		sizeInstance(one);
		sizeInstance(two);
	//check if any windows are small enough to consider closing
		//readyToCloseCheck(one);
		//readyToCloseCheck(two);
	};
	
	//makes the bar draggable
	createDraggable = function (instance, one, two, bar) {
		var	handle = bar.children(); //bar is zero size and contains the position value // handle is needed to give visual and functional trigger
		Draggable.create(bar, {
			bounds: instance,
			trigger: handle,
			onPress: function () {onPress(handle); },
			onDrag: function () {onDrag(instance, bar, one, two); },
			onRelease: function () {onRelease(instance, bar, one, two); }
		});
	};
	//adds an instance to any jQuery object
	appendInstance = function (win) {

		var instance, one, bar, two;

		appendCode(win);										//append code to given object
		instance = win.children().eq(0);						//get the new instance

		one = instance.children().eq(0);						//get the three main elements of the instance
		bar = instance.children().eq(1);
		two = instance.children().eq(2);

		instanceDirection(instance);							//calculate orientation of the new instance

		setBarPosition(instance, bar, 50);						/*	
																	sets the correct x/y position of the bar
																	needs to know: 
																	the instance orientation
																	the bar object
																	default percentage  
																*/

		windowSize(instance, one, two, 50);						/*	
																	sets the correct width/height of thw two windows
																	needs to know: 
																	the instance orientation
																	windows one and two
																	default percentage  
																*/

		makeClickable(one, two);								//

		createDraggable(instance, one, two, bar);				//make the bar object draggable

	};
	//adds or removes a red overlay with white text to the element
	toggleOverlay = function (win) {
		if (!win.children(".overlay").length) {
			win.append('<div class="overlay"><div class="note">swipe or click to close</div></div>');
		} else {
			win.children(".overlay").remove();
		}
	};
	//*not functioning* checks to see if any window is less
	readyToCloseCheck = function (win) {
		if (win.width() < $(window).width() * 10 / 100 || win.height() < $(window).height() * 20 / 100) {
			if (!win.children(".overlay").length) {
				toggleOverlay(win);
			}
		} else {
			if (win.children(".overlay").length) {
				toggleOverlay(win);
			}
			if (win.children(".window").length > 0) {
				readyToCloseCheck(win.children(".one"));
				readyToCloseCheck(win.children(".two"));
			}
		}
	};
	
	//initiate instance in the <main> HTML tag.
	appendInstance($("main"));
}