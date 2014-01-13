/* Wrappers for the media types.
 * 
 * An attempt is made at creating a consistent API.
 * 
 */
NS('org.korsakow.ui');

org.korsakow.ui.MediaUI = Class.register('org.korsakow.ui.MediaUI', {
	initialize: function($super) {
		$super();
	},
	bind: function() {
		this.element.bind.apply(this.element, arguments);
	},
	play: function () { },
	pause: function() { },
	paused: function() { },
	ended: function() { },
	currentTime: function() { }
});

/* Wrapper around HTML images.
 * 
 */
org.korsakow.ui.ImageUI = Class.register('org.korsakow.ui.ImageUI', org.korsakow.ui.MediaUI, {
	initialize: function($super, opts) {
		$super();
		this.element = jQuery("<img />");
		if (opts && opts.src)
			this.element.attr("src", opts.src);
		this.isPlaying = false;
		this.isEnded = false;
	},
	bind: function(eventType, cb) {
		var args = arguments;
		if (arguments.length > 0 && arguments[0] === 'timeupdate') {
			cb.apply({
				currentTime: 0
			}, args);
		} else {
			this.element.bind.apply(this.element, arguments);
		}
	},
	load: function(src) {
		this.element.attr("src", src);
	},
	source: function() {
		return this.element.attr("src");
	},
	play: function () { this.isPlaying = true; },
	pause: function() { this.isPlaying = false; },
	paused: function() { return !this.isPlaying; },
	ended: function() { return this.isEnded; },
	currentTime: function() { }
});

/* Wrapper around HTML videos.
 * 
 */
org.korsakow.ui.VideoUI = Class.register('org.korsakow.ui.VideoUI', org.korsakow.ui.MediaUI, {
	initialize: function($super, opts) {
		$super();
		this.element = jQuery("<video />");
		if (opts && opts.src) {
			alert('todo! VideoUI');
		}
	},
	bind: function() {
		this.element.bind.apply(this.element, arguments);
	},
	load: function(src) {
		var This = this;

		$.each([
			{
				type: 'video/ogg',
				src: src + '.ogv'
			},
			{
				type: 'video/mp4',
				src: src + '.mp4'
			}],
			function(i, info) {
				if(This.element[0].canPlayType(info.type)){
					var source = jQuery("<source />")
						.attr("src", info.src)
						.attr("type", info.type);
					This.element.append(source);
				}
			}
		);
		this.element[0].load();
	},
	play: function() {
		var This = this;
		// firefox 7 needs async between append <source> & play
		setTimeout(function() {
			This.element[0].play();
		});
	},
	pause: function() {
		this.element[0].pause();
	},
	paused: function() {
		return this.element.prop('paused');
	},
	ended: function() {
		return this.element.prop('ended');
	},
	buffered: function() {
		var total = 0;
		var b = this.element.prop('buffered');
		var len = b.length;
		for (var i = 0; i < len; ++i)
			total += b.end(i);
		return total;
	},
	currentTime: function(x) {
		if (typeof x != "undefined")
			this.element.prop('currentTime', x);
		return this.element.prop('currentTime');
	},
	duration: function() {
		return this.element.prop('duration');
	},
	source: function() {
		return this.element.find("source").attr("src");
	}
});

org.korsakow.ui.SubtitlesUI = Class.register('org.korsakow.ui.SubtitlesUI', {
	initialize: function($super, opts) {
		$super();
		this.element = jQuery("<div></div>");
		this.element.css({
			color: 'white'
		});
		this.currentText = [];
	},
	updateText: function(newText) {
		this.currentText = newText;
		this.render();
	},
	render: function () {
		var lineElements = [];
		var i;

		for (i = 0; i < this.currentText.length; i++) {
			lineElements.push(
				$('<p></p>').text(this.currentText[i]).addClass('subtitleLine')
			);
		}

		this.element.children().remove();

		for (i = 0; i < lineElements.length; i++) {
			this.element.append(lineElements[i]);
		}
	}
});

/*org.korsakow.ui.AudioUI = Class.create({
	initialize: function(opts) {
		this.element = jQuery("<audio />");
		this.element.attr("preload", true);
		if (opts && opts.src) {
			alert('todo! AudioUI');
		}
	},
	load: function(src){
		var This = this;
		$.each([
			{
				type: 'audio/mpeg',
				src: src + '.mp3'
			},
			{
				type: 'audio/wav',
				src: src + '.wav'
			},
			{
				type: 'audio/ogg',
				src: src + '.ogg'
			}
		], function(i,info){
			var source = jQuery("<source />")
				.attr("src", info.src)
				.attr("type", info.type);
			This.element.append(source);
		});
		This.element[0].load();
	},
	play: function(){
		var This = this;
		setTimeout(function(){
			This.element[0].play();
		});
	},
	source:function(){
		return this.element.find("source").attr("src");
	}
});*/

/* Maps the domain objects' class names to the UI classes.
 * 
 */
org.korsakow.ui.MediaUIFactory = Class.register("org.korsakow.ui.MediaUIFactory", org.korsakow.Factory, {
	initialize: function($super) {
		$super("MediaUIFactory");
	}
});
org.korsakow.ui.MediaUIFactory.instance = new org.korsakow.ui.MediaUIFactory();
org.korsakow.ui.MediaUIFactory.register("org.korsakow.domain.Image", org.korsakow.ui.ImageUI);
org.korsakow.ui.MediaUIFactory.register("org.korsakow.domain.Video", org.korsakow.ui.VideoUI);
org.korsakow.ui.MediaUIFactory.register("org.korsakow.domain.widget.Subtitles", org.korsakow.ui.SubtitlesUI);
//org.korsakow.ui.MediaUIFactory.register("org.korsakow.domain.Sound", org.korsakow.ui.AudioUI);
