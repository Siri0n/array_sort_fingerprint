if(!window.location.search){
	window.location.search = "?size=7&canvas=8";
}

function hslToRgb(h, s, l){ //stolen from StackOverflow =)
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function Item(index, val, comparisons){
	this.getVal = function(){
		return val;
	}
	this.getIndex = function(){
		return index;
	}
	this.compare = function(other){
		comparisons.push([index, other.getIndex()]);
		return val - other.getVal();
	}
}

function shuffle(array) { //also stolen from StackOverflow
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function ensureSorted(arr, name){
	for(var i = 0; i < arr.length - 1; i++){
		if(arr[i].getVal() > arr[i+1].getVal()){
			console.log("incorrect sort: " + name);
			console.log(arr.map(function(elem){return elem.getIndex()}));
			return;
		}
	}
}

function generateComparisonsArray(size, sort){
	var comparisons = [];
	var arr = [];
	var i, val = 0;
	for(i = 0; i < size; i++){
		arr.push(new Item(i, val, comparisons));
		val += Math.random(); //hack
	}
	shuffle(arr);
	sort.sort(arr, function(a, b){ return a.compare(b)});
	ensureSorted(arr, sort.name);
	return comparisons;
}

function draw(arr, size, canvasSize, sort, parent){
	var div = document.createElement("div");
	parent.appendChild(div);
	var a = document.createElement("a");
	a.innerText = sort.name;
	a.href=sort.href;
	div.appendChild(a);
	var canvas = document.createElement("canvas");
	canvas.width = canvas.height = Math.max(size, canvasSize);
	div.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	var data = ctx.getImageData(0, 0, size, size);
	arr.forEach(function(item, index){
		var rgb = hslToRgb(index/(arr.length*1.5), 1, 0.5);
		var pos = size*item[0] + item[1];
		data.data[pos*4] = rgb[0];
		data.data[pos*4 + 1] = rgb[1];
		data.data[pos*4 + 2] = rgb[2];
		data.data[pos*4 + 3] = 255;
		pos = size*item[1] + item[0];
		data.data[pos*4] = rgb[0];
		data.data[pos*4 + 1] = rgb[1];
		data.data[pos*4 + 2] = rgb[2];
		data.data[pos*4 + 3] = 255;
	});
	ctx.putImageData(data, 0, 0);
	if(size < canvasSize){
		ctx.drawImage(canvas, 0, 0, canvasSize*canvasSize/size, canvasSize*canvasSize/size)
	}
}

function createFingerprint(size, canvasSize, sort, parent){
	var arr = generateComparisonsArray(size, sort);
	draw(arr, size, canvasSize, sort, parent);
}

function main(sorts){
	var pow = (window.location.search.match(/size=([0-9]+)/) || [])[1];
	var size = Math.pow(2, pow|0);
	if(!(size == size)){
		size = 128;
	}
	pow = (window.location.search.match(/canvas=([0-9]+)/) || [])[1];
	var canvasSize = Math.pow(2, pow|0);
	if(!(canvasSize == canvasSize)){
		canvasSize = 256;
	}
	var leftColumn = document.getElementById("left");
	var rightColumn = document.getElementById("right");
	createFingerprint(
		size, 
		canvasSize,
		{
			name: "Array#sort (current browser)", 
			sort: function(arr, f){arr.sort(f)},
			href: "http://www.w3schools.com/Jsref/jsref_sort.asp"
		}, 
		leftColumn);
	sorts.forEach(function(sort){
		createFingerprint(size, canvasSize, sort, rightColumn);
	});
}