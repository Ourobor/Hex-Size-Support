
export class HexTokenConfig extends FormApplication {
	constructor(src, tokenConfig, options={}) {
		super(src, options);
		this.object = src;
		this.tokenConfig = tokenConfig
		this._related = null;

    	//prevent the arrowkeys from moving the token by setting a locking value
    	this.object.locked = true;
    	this.object.data.tempPivot = {x: this.object.getFlag('hex-size-support','pivotx'), y:this.object.getFlag('hex-size-support','pivoty')}


    	console.log(this)
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
    	scale: this.object.data.scale
    };
  }

  /** @override */
  get title(){
  	return "Hex Token Configureation Wizard"
  }

//------------------------------------------------------------
//---------------Listeners------------------------------------
//------------------------------------------------------------

 /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    this._keyHandler = this._keyHandler || this._onKeyDown.bind(this);
    html.find("#boop").click(this._boop.bind(this))
    document.addEventListener("keydown", this._keyHandler);
  }

  _boop(event){
  	console.log(event)
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

    // Resize grid size on ALT
    else if ( event.altKey ) {
      let delta = up.includes(key) ? 1 : (down.includes(key) ? -1 : 0);
      this._increaseScale(delta);
    }

    // Shift grid position
    else {
      if ( up.includes(key) ) this._shiftPivot({deltaY: 1});
      else if ( down.includes(key) ) this._shiftPivot({deltaY: -1});
      else if ( left.includes(key) ) this._shiftPivot({deltaX: 1});
      else if ( right.includes(key) ) this._shiftPivot({deltaX: -1});
    }
  }

  /** @override */
  _onChangeInput(event) {
  	let token = this.object;

    event.preventDefault();

    //TODO implement temp flags so they aren't automatically updated even if the form is cancelled
 //    token.setFlag("hex-size-support","pivotx", parseFloat(this.form.elements.pivotx.value));
	// token.setFlag("hex-size-support","pivoty", parseFloat(this.form.elements.pivoty.value));
	token.data.tempPivot.x = parseFloat(this.form.elements.pivotx.value);
	token.data.tempPivot.y = parseFloat(this.form.elements.pivoty.value);
	token.data.scale = parseFloat(this.form.elements.scale.value);
	token.refresh();
  }

	_shiftPivot(options){
		let token = this.object;
		// let newPivotX = (this.object.getFlag('hex-size-support','pivotx') || 0.0) + (options.deltaX || 0);
		// let newPivotY = (this.object.getFlag('hex-size-support','pivoty') || 0.0) + (options.deltaY || 0);
		let newPivotX = (token.data.tempPivot.x || 0.0) + (options.deltaX || 0);
		let newPivotY = (token.data.tempPivot.y || 0.0) + (options.deltaY || 0);


		// token.setFlag("hex-size-support","pivotx", newPivotX);
		// token.setFlag("hex-size-support","pivoty", newPivotY);
		token.data.tempPivot.x = newPivotX;
		token.data.tempPivot.y = newPivotY;

		this.form.elements.pivotx.value = newPivotX;
		this.form.elements.pivoty.value = newPivotY;

		token.refresh()
	}

	_increaseScale(delta){
		let token = this.tokenConfig.token;

		let newScale = (Math.round((token.data.scale + 0.01 * delta) * 100)/100)

		token.data.scale = newScale;

		token.refresh()
		this.form.elements.scale.value = token.data.scale;
	}

	async _updateObject(event, formData) {
		let token = this.object;
		let updateData = {scale: formData.scale.toString()};

		this.tokenConfig.form.elements.scale.value = formData.scale;

		//this pains me deeply, but I honestly spent like an hour trying to find a better
		//way to convince the form to update the little range box beside the scale range input >~<
		this.tokenConfig._onChangeRange({target: this.tokenConfig.form.elements.scale})

		await token.update(updateData);

		//for some reason after updating the scale of a token, it becomes a string? And you also can't use
		//a float as a value to update to for some reason as well, so we just transform it back to a float here
		token.data.scale = parseFloat(token.data.scale);

		console.log(formData)
		token.setFlag("hex-size-support","pivotx", formData.pivotx);
		token.setFlag("hex-size-support","pivoty", formData.pivoty);

		token.refresh()
	}


  /** @override */
  async close(options) {
    document.removeEventListener("keydown", this._keyHandler);
    document.removeEventListener("wheel", this._wheelHandler);
    this._keyHandler = this._wheelHandler = null;
    await this.tokenConfig.maximize();
    this.object.locked = undefined;
    this.object.data.tempPivot = undefined;
    this.object.refresh();
    return super.close(options);
  }

}