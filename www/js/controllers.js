angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state) {
	$scope.op = {plus: true, min: true, mult: false, div: false};
	$scope.lims = [{value: 100, selected: true},{value: 500}, {value: 1000}, {value: 10000}];
	$scope.nums = [{value: 10},{value: 20},{value: 30, selected: true},{value: 50},{value: 100}];
	
	$scope.selection = {};
	$scope.selection.selectedLim = $scope.lims[0];
	$scope.selection.selectedNum = $scope.nums[2];
	
	$scope.doStart = function(){
		var op = $scope.op;
		var ops = [];
		if (op.plus) ops.push('+');
		if (op.min) ops.push('-');
		if (op.mult) ops.push('*');
		if (op.div) ops.push('/');
		
		
		$state.go('test', {n: $scope.selection.selectedNum.value, l: $scope.selection.selectedLim.value, op: ops.join(',')});
	};
})

.controller('ChatsCtrl', function($scope, $stateParams) {
	$scope.ansDigs = [];
	$scope.ansRight = false;
	
	String.prototype.format = String.prototype.f = function() {
	    var s = this,
	        i = arguments.length;

	    while (i--) {
	        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	    }
	    return s;
	};

	function qs(key) {
	    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
	    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
	    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	}
	
	function sp(c){
		c = c.replace(/\-/g,'减');
    	c = c.replace(/\+/g,'加');
    	c = c.replace(/\*/g,'乘');
    	c = c.replace(/\//g,'除');
    	c += '等于';
    	speak(c);
	}
	
	var num = $stateParams.n || 50;
	var ops = $stateParams.op || '+';
	ops = ops.split(',');
	var lim = $stateParams.l;
	for (var i = 0; i < num; i++){
		var a = parseInt(Math.random()*lim);
		var b = parseInt(Math.random()*lim);
		var o = ops[parseInt(Math.random()*100)%ops.length];
		
		if (o == '-'){
			var d = a;
			if (a < b) {
				a = b;
				b = d;
			}
		}
		
		
		var s = '<section><h1><span class="a">{0}</span> <span class="o">{1}</span> <span class="b">{2}</span></h1><p>=</p></section>';
		s = s.f(a, o, b);
		
		$('.slides').append(s);
	}
	
	// Full list of configuration options available at:
	// https://github.com/hakimel/reveal.js#configuration
	Reveal.initialize({
		controls: false,
		progress: true,
		history: false,
		center: false,
		slideNumber: 'c/t',
		touch: false,
		mouseWheel: false,
		keyboard: false,
		progress: false,

		transition: 'convex', // none/fade/slide/convex/concave/zoom

		// Optional reveal.js plugins
		dependencies: [
			{ src: 'lib/reveal/classList.js', condition: function() { return !document.body.classList; } },
			//{ src: 'lib/reveal/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			//{ src: 'lib/reveal/plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			{ src: 'lib/reveal/plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
			//{ src: 'lib/reveal/plugin/zoom-js/zoom.js', async: true },
			//{ src: 'lib/reveal/plugin/notes/notes.js', async: true }
		]
	});
	
	function asked(slide){
		var s = $(slide);
		var a = parseInt(s.find('.a').text());
		var o = s.find('.o').text();
		var b = parseInt(s.find('.b').text());
		
		deal(a, b, o);
	}
	
	function deal(a, b, o){
		var c;
		eval('c = ' + a + '' + o + '' + b);
		
		c= parseInt(c);
		c += '';
		var ans = [];
		$scope.$apply(function(){
			for (var i = 0; i < c.length; i++){
				ans.push({value: c.charAt(i)});
			}
			$scope.ansDigs = ans;
			$scope.ansRight = false;
		});
		
		try {
			sp('' + a + '' + o + '' + b);
		} catch(err){}
	}
	
	Reveal.addEventListener( 'ready', function( event ) {
		setTimeout(function(){
	    	asked(event.currentSlide);
	    }, 50);
	} );
	
	Reveal.addEventListener( 'slidechanged', function( event ) {
	    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
	    //console.log(event);
	    //listen();
	    setTimeout(function(){
	    	asked(event.currentSlide);
	    }, 50);
	} );
	
	Reveal.addEventListener( 'fragmentshown', function( event ) {
	    // event.fragment = the fragment DOM element
	    setTimeout(function(){
	    	console.log(event.fragment.innerText);
		    //speak('' + event.fragment.innerText);
	    }, 50);
	    
	} );
	
	
	
	$scope.doClickNum = function(n){
		if (n == -1){
			for (var i = $scope.ansDigs.length - 1; i >= 0; i--){
				var item = $scope.ansDigs[i];
				if (item.number || item.number === 0){
					delete item.number;
					break;
				}
			}
			return;
		}
		
		for (var i = 0; i < $scope.ansDigs.length; i++){
			var item = $scope.ansDigs[i];
			if (!item.number && item.number !==0) {
				item.number = n;
				break;
			}
		};
		
		if (i == $scope.ansDigs.length - 1) judge();
	}
	
	function judge(){
		var yes = true;
		$scope.ansDigs.forEach(function(item){
			if (item.number != item.value) yes = false;
		});
		
		$scope.ansDigs.forEach(function(item){
			item.color = yes ? 'green' : 'red';
		});
		
		if (yes) {
			$scope.ansRight = true;
			setTimeout(Reveal.next, 600);
		} else {
			setTimeout(function(){
				$scope.ansDigs.forEach(function(item){
					delete item.number;
					delete item.color;
				});
			}, 500);
		}
	}
})
;
