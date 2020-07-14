
export class HexTokenConfig extends FormApplication {
	constructor(src, tokenConfig, options={}) {
		super(src, options);
		this.tokenConfig = tokenConfig
		console.log(tokenConfig)
		this._related = null;
		// this.tokenOptions = {
  //   		pivotY: this.tokenConfig.token.icon.pivot.y,
  //   		pivotX: this.tokenConfig.token.icon.pivot.x
  //   	}

    	//prevent the arrowkeys from moving the token by setting a locking value
    	tokenConfig.token.locked = true;
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["sheet", "scene-sheet"],
			template: "modules/hex-size-support/templates/hex-token-config.html",
			width: 420
		});
	}
  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    return {
    	foo: this.foo || "",
    	options: this.options,
    	pivotX: this.tokenConfig.token.icon.pivot.x,
    	pivotY: this.tokenConfig.token.icon.pivot.y,
    	scale: this.tokenConfig.token.data.scale
    };
  }

    /** @override */
  async close(options) {
    document.removeEventListener("keydown", this._keyHandler);
    document.removeEventListener("wheel", this._wheelHandler);
    this._keyHandler = this._wheelHandler = null;
    canvas.draw();
    await this.tokenConfig.maximize();
    return super.close(options);
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    this._keyHandler = this._keyHandler || this._onKeyDown.bind(this);
    document.addEventListener("keydown", this._keyHandler);
    // this._wheelHandler = this._wheelHandler || this._onWheel.bind(this);
    // document.addEventListener("wheel", this._wheelHandler, {passive: false});

    // html.find('button[name="reset"]').click(this._onReset.bind(this));
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
  	let token = this.tokenConfig.token;
  	// console.log(event)
    event.preventDefault();
    // console.log(this)
    // this.tokenConfig.token.icon.pivot.x = this.form.elements.pivotx.value;
    // this.tokenConfig.token.icon.pivot.y = this.form.elements.pivoty.value;
    token.setFlag("hex-size-support","pivotx", parseFloat(this.form.elements.pivotx.value));
	token.setFlag("hex-size-support","pivoty", parseFloat(this.form.elements.pivoty.value));
	token.data.scale = parseFloat(this.form.elements.scale.value);
  }

	_shiftPivot(options){
		let token = this.tokenConfig.token;
		let newPivotX = token.icon.pivot.x + (options.deltaX || 0);
		let newPivotY = token.icon.pivot.y + (options.deltaY || 0);
		// console.log(options)
		token.setFlag("hex-size-support","pivotx", newPivotX);
		token.setFlag("hex-size-support","pivoty", newPivotY);

		this.form.elements.pivotx.value = newPivotX;
		this.form.elements.pivoty.value = newPivotY;
	}

	_increaseScale(delta){

		let token = this.tokenConfig.token;

		console.log(delta)
		console.log(token.data.scale)

		token.data.scale = (Math.round((token.data.scale + 0.01 * delta) * 100)/100)
		// token.data.scale = token.data.scale + 0.01 * delta

		token.refresh()

		this.form.elements.scale.value = token.data.scale;
	}

}