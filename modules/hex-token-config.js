
export class HexTokenConfig extends FormApplication {

	originalPosition = {x: 0, y:0}

	originalScale = 1.0
	originalHeight = 1.0
	originalWidth = 1.0

	constructor(src, token, options={}) {
		super(src, options);
		this.object = src;
		// this.tokenConfig = tokenConfig
		this._related = null;

		this.originalPosition = {x: this.object.x, y: this.object.y}

		this.originalScale = this.object.data.scale;
		this.originalWidth = this.object.data.width;
		this.originalHeight = this.object.data.height;

    	//prevent the arrowkeys from moving the token by setting a locking value
    	this.object.data.tempHexValues = {}
    	this.object.data.tempHexValues.locked = true;
    	this.object.data.tempHexValues.tempPivot = {x: this.object.getFlag('hex-size-support','pivotx'), y:this.object.getFlag('hex-size-support','pivoty')}

    	// console.log(this)
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sheet", "scene-sheet"],
			template: "modules/hex-size-support/templates/hex-token-config.html",
			width: 420,
			height: "auto",
			tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "image"}]
		});
	}
  /* -------------------------------------------- */


  /** @override */
  async getData(options) {
    return {
    	foo: this.foo || "",
    	options: this.options,
    	pivotX: this.object.getFlag('hex-size-support','pivotx'),
    	pivotY: this.object.getFlag('hex-size-support','pivoty'),
    	scale: this.object.data.scale,
      alternateOrientation: this.object.getFlag('hex-size-support','alternateOrientation'),
    	borderType: this.object.getFlag('hex-size-support','borderSize'),
    	altSnapping: this.object.getFlag('hex-size-support','altSnapping'),
    	vertexSnap: this.object.getFlag('hex-size-support','evenSnap'),
      alwaysShowBorder: this.object.getFlag('hex-size-support','alwaysShowBorder'),
      templates: templateArray
    };
  }

  /** @override */
  get title(){
  	return "Hex Token Configuration Wizard"
  }

//------------------------------------------------------------
//---------------Listeners------------------------------------
//------------------------------------------------------------

 /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    this._keyHandler = this._keyHandler || this._onKeyDown.bind(this);
    html.find("#borderType").change(this._changeBorderHandler.bind(this))
    html.find("#applyTemplateButton").click(this._applyTemplate.bind(this))
    document.addEventListener("keydown", this._keyHandler);
  }

  _applyTemplate(event){
  	console.log(this)
  	let index = this.form.elements.template.selectedIndex;
  	if(index > -1){
  		let options = templateArray[index];
  		this.object.data.scale = options.scale;
  		this.object.data.height = options.borderSize;
  		this.object.data.width = options.borderSize;

  		this.object.data.tempHexValues = {
  			tempPivot : options.pivot,
  			// borderRotationOffset: options.borderOffset,
  			altSnapping: options.altSnapping,
  			vertexSnap: options.vertexSnap,
  			borderSize: options.borderSize
  		}

  		this._updateFlagCheckboxes();
  		this.form.elements.borderOffset.value = this.object.data.tempHexValues.borderRotationOffset;

  		// console.log("redraw")
  		this.object.refresh()
  		// this.object.shiftPosition(0,0);
		this.object.setPosition(this.originalPosition.x, this.originalPosition.y)
	  	//tell the token to redraw the bars for the new size
	  	this.object.drawBars()
  	}
  }

  //handles converting the 
  _changeBorderHandler(event){
  	return this._changeBorder(parseInt(event.target.value))
  }

  _updateFlagCheckboxes(){
  	this.form.elements['altSnapping'].checked = this.object.data.tempHexValues.altSnapping;
  	this.form.elements['evenSnap'].checked = this.object.data.tempHexValues.vertexSnap;
  }

  _changeBorder(border){

  	if(border == 0){

  		this.object.data.tempHexValues.borderSize = 1;

  		this.object.data.height = 1;
  		this.object.data.width = 1;

		// this.object.data.flags['hex-size-support'].altSnapping = false;
		this.object.data.tempHexValues.altSnapping = false;
		// this.object.data.flags['hex-size-support'].evenSnap = false;
		this.object.data.tempHexValues.vertexSnap = false;
		
		//reset the hit area because it might have changed with the other choices
	  	this.object.hitArea = new PIXI.Rectangle(0, 0, this.object.w, this.object.h);

  	}
  	else{
  		// this.object.data.flags['hex-size-support'].altSnapping = true;
  		this.object.data.tempHexValues.altSnapping = true;

  		if(border % 2 == 0){
			// this.object.data.flags['hex-size-support'].evenSnap = true;
			this.object.data.tempHexValues.vertexSnap = true;
  		}
  		else{
  			// this.object.data.flags['hex-size-support'].evenSnap = false;
  			this.object.data.tempHexValues.vertexSnap = false;
  		}

  		this.object.data.width = border;
  		this.object.data.height = border;


	  	this.object.data.tempHexValues.borderSize = border;

	  	let locked = this.object.data.tempHexValues.locked;
	  	this.object.data.tempHexValues.locked = undefined;
	  	this.object.shiftPosition(0,0);
	  	this.object.data.tempHexValues.locked = locked
	  	// this.object.refresh();
  	}
  	this._updateFlagCheckboxes()

  	this.object.setPosition(this.originalPosition.x, this.originalPosition.y)
  	//tell the token to redraw the bars for the new size
  	this.object.drawBars()
  }


  _onKeyDown(event) {
    const key = game.keyboard.getKey(event);
    if ( !(key in game.keyboard.moveKeys) || game.keyboard.hasFocus ) return;
    event.preventDefault();

    const up = ["w", "W", "ArrowUp"];
    const down = ["s", "S", "ArrowDown"];
    const left = ["a", "A", "ArrowLeft"];
    const right = ["d", "D", "ArrowRight"];

    // Increase the Scene scale on shift + up or down
    if ( event.shiftKey ) {
      
    }
    //prevent enter key from submitting the form
    else if( event.keyCode == 13){
    	event.preventDefault();
    	return false;
    }

    // Resize grid size on ALT
    else if ( event.altKey ) {
      let delta = up.includes(key) ? 1 : (down.includes(key) ? -1 : 0);
      this._increaseScale(delta);
    }

    // Shift grid position
    else {
		// if(this._tabs[0].active === "position"){
			if ( up.includes(key) ) this._shiftPivot({deltaY: 1});
			else if ( down.includes(key) ) this._shiftPivot({deltaY: -1});
			else if ( left.includes(key) ) this._shiftPivot({deltaX: 1});
			else if ( right.includes(key) ) this._shiftPivot({deltaX: -1});
		// }
		// else if(this._tabs[0].active === "snapping"){
		// 	if ( left.includes(key) ) this._rotateBorder(-15);
		// 	else if ( right.includes(key) ) this._rotateBorder(15);
		// }
    }

  }

  /** @override */
  _onChangeInput(event) {
  	let token = this.object;

    event.preventDefault();

    //TODO implement temp flags so they aren't automatically updated even if the form is cancelled
	token.data.tempHexValues.tempPivot.x = parseFloat(this.form.elements.pivotx.value);
	token.data.tempHexValues.tempPivot.y = parseFloat(this.form.elements.pivoty.value);
	token.data.scale = parseFloat(this.form.elements.scale.value);
  token.data.tempHexValues.alternateOrientation = this.form.elements.alternateOrientation.checked
	// token.data.tempHexValues.borderRotationOffset = parseFloat(this.form.elements.borderOffset.value);
	token.refresh();
  }

  //add to the border offset of a token by a given delta
  _rotateBorder(deltaOffset){
  	if(this.object.data.tempHexValues.borderRotationOffset == undefined){
  		this.object.data.tempHexValues.borderRotationOffset = deltaOffset;
  	}
  	else{
  		this.object.data.tempHexValues.borderRotationOffset += deltaOffset;
  	}

  	//handle values greater/less than 360/-360
  	if(this.object.data.tempHexValues.borderRotationOffset >= 360){
  		this.object.data.tempHexValues.borderRotationOffset -= 360
  	}
  	else if(this.object.data.tempHexValues.borderRotationOffset < 0){
  		this.object.data.tempHexValues.borderRotationOffset += 360
  	}


  	this.object.refresh()

  	this.form.elements.borderOffset.value = this.object.data.tempHexValues.borderRotationOffset;
  }

	_shiftPivot(options){
		let token = this.object;

		let newPivotX = (token.data.tempHexValues.tempPivot.x || 0.0) + (options.deltaX || 0);
		let newPivotY = (token.data.tempHexValues.tempPivot.y || 0.0) + (options.deltaY || 0);

		token.data.tempHexValues.tempPivot.x = newPivotX;
		token.data.tempHexValues.tempPivot.y = newPivotY;

		this.form.elements.pivotx.value = newPivotX;
		this.form.elements.pivoty.value = newPivotY;

		token.refresh()
	}

	_increaseScale(delta){
		let token = this.object;

    let tokenScale = parseFloat(token.data.scale)

		let newScale = (Math.round((tokenScale + 0.01 * delta) * 100)/100)

		token.data.scale = newScale;

		token.refresh()
		this.form.elements.scale.value = token.data.scale;
	}

	async _updateObject(event, formData) {
		let token = this.object;
		let updateData = {
				scale: formData.scale, 
				height: token.data.height, 
				width: token.data.width
		};


		//for some reason after updating the scale of a token, it becomes a string? And you also can't use
		//a float as a value to update to for some reason as well, so we just transform it back to a float here
		token.data.scale = parseFloat(token.data.scale);

		// console.log(formData)
		await token.setFlag("hex-size-support","pivotx", formData.pivotx);
		await token.setFlag("hex-size-support","pivoty", formData.pivoty);
		await token.setFlag("hex-size-support","borderSize", formData.borderType);
		await token.setFlag("hex-size-support","altSnapping", formData.altSnapping);
		await token.setFlag("hex-size-support","evenSnap", formData.evenSnap);
    await token.setFlag("hex-size-support","alwaysShowBorder", formData.alwaysShowBorder);
    await token.setFlag("hex-size-support","alternateOrientation", formData.alternateOrientation);

		await token.update(updateData);

		token.data.width = Number(token.data.width);
		token.data.height = Number(token.data.height);
		token.data.scale = Number(token.data.scale);
	}


  /** @override */
  async close(options) {
    document.removeEventListener("keydown", this._keyHandler);
    document.removeEventListener("wheel", this._wheelHandler);
    this._keyHandler = this._wheelHandler = null;
    // this.object.locked = undefined;
    // this.object.data.tempPivot = undefined;
    this.object.data.tempHexValues = undefined;

    //handle resetting the object back if the config wasn't submitted
    if(options == undefined){
	    this.object.data.scale = this.originalScale;
	    this.object.data.height = this.originalHeight;
	    this.object.data.width = this.originalWidth;
	}

    //trigger relevant redraws on the token
    this.object.refresh()
    this.object.drawBars()
    return super.close(options);
  }

}

let templateArray = [
{
  name: "Retrograde Size 2 Pointy Top",
	scale: 1.6,
	pivot: {
		x: 0,
		y: 72
	},
	borderSize: 2,
	borderOffset: 0,
	altSnapping: true,
	vertexSnap: true
},
{
  name: "Retrograde Size 2 Flat Top",
	scale: 1.6,
	pivot: {
		x: 0,
		y: 72
	},
	borderSize: 2,
	borderOffset: 330,
	altSnapping: true,
	vertexSnap: true
},
{
  name: "Retrograde Size 3 Pointy",
	scale: 1.6,
	pivot: {
		x: 0,
		y: 72
	},
	borderSize: 3,
	borderOffset: 0,
	altSnapping: true,
	vertexSnap: false
},
{
  name: "Retrograde Size 4 Pointy",
	scale: 1.37,
	pivot: {
		x: 100,
		y: 0
	},
	borderSize: 2,
	borderOffset: 90,
	altSnapping: true,
	vertexSnap: true
},
]
