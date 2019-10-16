class Tag {
  constructor(obj, parentId, index) {
    this.id = typeof obj.id !== 'undefined' ? obj.id : Date.now() + '' + index;
    this.parentId = parentId;
    this.index = index;
    this.type = typeof obj.color !== 'undefined' ? obj.type : 'text';
    this.time = this.type === 'timer' ? obj.time : undefined;
    this.text = obj.text;
    this.icon = typeof obj.icon !== 'undefined' ? obj.icon : '';
    this.ariaLabel = typeof obj.ariaLabel !== 'undefined' ? obj.ariaLabel : '';
    this.color = typeof obj.color !== 'undefined' ? obj.color : 'c3c3c3';
    this.fontColor = typeof obj.fontColor !== 'undefined' ? obj.fontColor : 'fff';

    this.lastTimer = this.getTimer();

    if (this.type === 'timer') {
      this.timer = setInterval(() => {
        $('#tag' + this.parentId + '-' + this.id).html(this.toHtml())
      }, 60000);
    }

    return this.html;
  }

  /**
   * @returns formated HTML for the tag
   */
  toHtml() {
    let text = this.text.replace('%TIME%', this.lastTimer),
      ariaLabel = this.ariaLabel.replace('%TIME%', this.lastTimer),
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
      $('#tag' + this.parentId + '-' + this.id).replace(this.html);
      return true;
    }
    return false;
  }

  /**
   * compare the passed obj to this object, updatethe properties as needed and notify it
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
    if (this.fontColor !== obj.fontColor && obj.fontColor !== 'undefined') {
      this.fontColor = obj.fontColor;
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
      let delta = Math.round((Date.now() - this.time) / 1000),
        min = Math.round(delta / 60) % 60,
        hours = Math.round(delta / 3600),
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
}