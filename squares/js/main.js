(function(win, doc){

	var box = $("#box");
	var colors = [
		'red', 'blue', 'green', 'yellow',
		'purple', 'pink', 'cyan', 'orange',
		'lightgreen', 'sky', 'brown', 'teal',
		'rose'
	];
	var count = 1600;

	function range(num){
		var arr = [];
		for(var i = 0; i <= num; i++){
			arr.push(num);
		}
		return arr;
	}

	function pickRandom(){
		var args = Array.from(arguments);
		if(typeof args[0] == "object") args = args[0];
		var rand = Math.floor(Math.random() * args.length);
  	return args[rand];	
	}

	function squareText(color){
		return "<div class=\"square\" color=\""+color+"\"></div>";
	}

	function Square(elt, num){
		if(!elt || !elt.length) return {};
		var square = {ccolor: function(color){
			return changeSquareColor(num, color);
		}, rm: function(){
			return elt.remove();
		}, rf: function(){
			elt.hide();
			setTimeout(function() {
				elt.show();
			}, 1);
			return null;
		}};
		square.id = num ? num : 0;
		square.color = elt.attr('color');
		square.colorIndex = (function(){
			var clr = square.color;
			var ind = 0;
			colors.forEach(function(colr, index){
				if(colr == clr) ind = index;
			});
			return ind;
		})();
		square.pos = num;
		square.elt = elt;
		return square;
	}

	function draw(color, gridPos){
		if(box.children().length == count) return;
		if(!color) color = "";
		var pos = box.children().length;
		box.append(squareText(color));
		var ths = getSquare(box.children().length-1);
		ths.elt[0].square = ths;
		ths.elt.on('contextmenu',function(e){
			e.preventDefault();
			var square = getSquare($(this).index());
			if(square.colorIndex == colors.length-1) square.colorIndex = -1;
			square.ccolor(colors[square.colorIndex+1]);
		});
		ths.elt.click(function(e){
			ths.elt.toggleClass('active');
		});
	}

	function updateSquares(){
		box.find('.square').each(function(){
			var square = getSquare($(this).index());
			this['square'] = square;
		});
	}

	function deleteSquare(pos){
		var square = getSquare(pos);
		square.elt.remove();
		updateSquares();
	}
	
	function drawBoxes(){
		var args = Array.from(arguments);
		args.forEach(function(box){
			var color = typeof box != "string" ? box[0] : box;
			var gridPos = typeof box != "string" ? box[1] : null;
			draw(color, gridPos);
		});
	}

	function getPattern(color){
		if(typeof color != 'string'){
			color.forEach(function(clr){
				if(typeof color != 'string'){
					getPattern(clr);
					return;
				}
				drawBoxes(clr);
			});
			return;
		}
		drawBoxes(color);
	}

	function fillBox(){
		var args = Array.from(arguments);
		if(!args.length) args[0] = 'random';
		var pattern = args;
		if(args[0] == 'random') pattern == args[0];
		clearBox();
		for(var i in range(count)){
			if(pattern == 'random'){
				drawBoxes(pickRandom(colors));
			} else {
				getPattern(pattern);
			}
		}
	}

	function clearBox(){
		box.empty();
	}

	function getSquare(num){
		return Square($(box.children()[num]), num);
	}

	function changeSquareColor(num, color){
		getSquare(num).elt.attr('color', color);
		return getSquare(num).color;
	}

	function getAllSquares(){
		var i = [];
		box.children().each(function(){
			i.push(getSquare($(this).index()));
		});
		return i;
	}

	function getAllColors(){
		var i = [];
		box.children().each(function(){
			i.push(getSquare($(this).index()).color);
		});
		return i;
	}

	function saveBox(){
		localStorage.squaresCache = JSON.stringify(getAllColors());	
	}

	function loadLS(){
		if(localStorage.squaresCache){
			JSON.parse(localStorage.squaresCache).forEach(function(color){
				drawBoxes(color);
			});
		}
	}

	$(document).on('keydown', function(e){
		// e.preventDefault();
		if(e.keyCode == 46){
			box.find('.active').each(function(){
				deleteSquare($(this).index());
			});
		}
		if(e.key == 'R'){
			box.find('.active').each(function(){
				getSquare($(this).index()).ccolor(prompt('Color: '));
			});
		}
		if(e.key == 'A'){
			e.preventDefault();
			drawBoxes(pickRandom(colors));
		}
		if(e.key == 'S'){
			e.preventDefault();
			saveBox();
		}
	});

	win.getSquare = getSquare;
	win.draw = drawBoxes;
	win.fill = fillBox;

	var optionalScript = (function(){

		$("#menu .mbtn#random").click(function(){
			fillBox();
		});

		$("#menu .mbtn#pattern").click(function(){
			var pt = prompt('Insert Pattern: ').trim();
			pt.match(',') ? pt = pt.split(',') : pt = pt;
			if(Array.isArray(pt)) pt.forEach(function(item, index){
				if(item.trim() == "colors"){
					pt[index] = colors;
					return;
				}
				if(item[0] == "["){
					pt[index] = item.replace('[','').replace(']','').split('|');
					return;
				}
				pt[index] = item.trim();
			});
			fillBox(pt);
		});

		$("#menu .mbtn#clear").click(function(){
			clearBox();
		});

	})();

	$(document).ready(function(){
		setTimeout(function() {
			loadLS();
		}, 100);
	});

})(window, document);