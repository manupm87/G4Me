// Image Loader

function ImageLoader(){
	this.images = new Array();
}

ImageLoader.prototype.loadImage = function(name, img_path){
	var img = new Image();
	img.name = name;
	img.src = img_path;
	this.images.push(img);
}

ImageLoader.prototype.loaded = function(){
	for(var i=0; i< this.images.length; i++){
		if(this.images[i].complete == false){
			return false;
		}
	}
	return true;
}

ImageLoader.prototype.getImage = function(name){
	for(var i = 0; i < this.images.length; i++){
		if(this.images[i].name == name){
			return this.images[i];
		}
	}
	return -1;
}