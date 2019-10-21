class Tag {
  /**
   * Tag constructor
   * @param {object} obj JSON parsed object from AJAX
   * @param {int} parentId id of the parent music item
   * @param {int} index index of the tag in the list
   */
  constructor(obj, parentId, index) {
    this.id = obj.id;
    this.parentId = parentId;
    this.index = index;
    // if no type is specified assume it to text
    this.type = typeof obj.type !== 'undefined' ? obj.type : 'text';
    // if the type is timer and the time specified store it, if not store now() otherwise undefined
    this.time = this.type === 'timer' ? typeof obj.time !== 'undefined' ? obj.time : Date.now() : undefined;
    this.text = obj.text;
    // if no icon is provided assume empty
    this.icon = typeof obj.icon !== 'undefined' ? obj.icon : '';
    // if no ariaLabel is provided assume empty
    this.ariaLabel = typeof obj.ariaLabel !== 'undefined' ? obj.ariaLabel : '';
    // if no color is provided assume dark grey
    this.color = typeof obj.color !== 'undefined' ? obj.color : '333';
    // if no font color is provided assume white
    this.fontColor = typeof obj.fontColor !== 'undefined' ? obj.fontColor : 'fff';

    this.lastTimer = this.getTimer();

    if (this.type === 'timer') {
      this.timer = setInterval(() => {
        $('#tag' + this.parentId + '-' + this.id).replaceWith(this.toHtml())
      }, 60000);
    }

    return this.html;
  }

  /**
   * @returns formated HTML for the tag
   */
  toHtml() {
    let timer = this.getTimer(),
      text = this.text.replace('%TIME%', timer),
      ariaLabel = this.ariaLabel.replace('%TIME%', timer),
      img = this.icon !== '' ? `<img class="badge" src="${this.icon}" aria-label="${ariaLabel}">` : '';

    return `
      <figure id="${'tag' + this.parentId + '-' + this.id}" class="playlist_item__tag" style="background:#${this.color};color:#${this.fontColor}">
        ${img}
        <figcaption>${text}</figcaption>
      </figure>`;
  }

  /**
   * update the tag if needed
   * @param {object} obj parsed JSON from AJAX request
   * @returns {boolean} either or not the tag updated itself
   */
  update(obj) {
    let timer = this.getTimer();
    if (timer != this.lastTimer || !this.isSameAs(obj)) {
      this.lastTimer = timer;
      this.html = this.toHtml();
      $('#tag' + this.parentId + '-' + this.id).replaceWith(this.html);
      return true;
    }
    return false;
  }

  /**
   * remove the item from the dom
   */
  delete() {
    $('#tag' + this.parentId + '-' + this.id).remove();
    if (typeof this.timer !== 'undefined') {
      clearInterval(this.timer);
    }
  }

  /**
   * compare the passed obj to this object, update the properties as needed and notify it
   * @param {object} obj parsed JSON from AJAX request
   * @returns {boolean}  the tag is the same / the tag as bein updated
   */
  isSameAs(obj) {
    let same = true;
    if (this.text !== obj.text) {
      this.text = obj.text;
      same = false;
    }
    if (this.icon !== obj.icon && typeof obj.icon !== 'undefined') {
      this.icon = obj.icon;
      same = false;
    }
    if (this.color !== obj.color && typeof obj.color !== 'undefined') {
      this.color = obj.color;
      same = false;
    }
    else if (this.color !== '333' && typeof obj.color === 'undefined') {
      this.color = '333';
      same = false;
    }
    if (this.fontColor !== obj.fontColor && obj.fontColor !== 'undefined') {
      this.fontColor = obj.fontColor;
      same = false;
    }
    else if (this.fontColor !== 'fff' && typeof obj.fontColor === 'undefined') {
      this.fontColor = 'fff';
      same = false;
    }
    if (this.time !== obj.time) {
      this.time = obj.time;
      same = false;
    }
    if (this.ariaLabel !== obj.ariaLabel && obj.ariaLabel !== 'undefined') {
      this.ariaLabel = obj.ariaLabel;
      same = false;
    }
    return same;
  }

  /**
   * return the formated timer if this.type = timer, undefine otherwise
   * @returns {string} formated timer
   */
  getTimer() {
    if (this.type === 'timer') {
      let delta = Math.trunc((Date.now() - this.time) / 1000),
        min = Math.trunc(delta / 60) % 60,
        hours = Math.trunc(delta / 3600),
        time = "error";
      if (hours === 0) {
        time = min + 'min';
      }
      else if (min === 0) {
        time = hours + 'h';
      }
      else {
        time = hours + 'h ' + min + 'min';
      }
      return time;
    }
    else {
      return undefined;
    }
  }

  /**
   * move the tag to the desired location
   * @param  {int} index index to move the item to visualy
   */
  move(index) {
    if (typeof index !== 'undefined') {
      // if the tag move at the first position
      if (index !== this.index) {
        if (index === 0) {
          this.dom.prependTo('#id' + this.parentId + '>.playlist_item__tags');
        }
        // if the item move anywhere else
        else {
          this.dom.insertAfter('#id' + this.parentId + '>.playlist_item__tags>.playlist_item__tag:nth-child(' + index + ')')
        }
      }
    }
    else {
      // throw error in the console
      console.error('no argument provided to update tag object', this);
    }
  }
}