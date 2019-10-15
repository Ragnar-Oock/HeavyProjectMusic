class Tag {
  constructor(obj) {
    this.type = typeof obj.color !== 'undefined' ? obj.type : 'text';
    this.time = typeof this.type == 'time' && obj.time !== 'undefined' ? obj.time : Date.now();
    this.text = obj.text;
    this.icon = typeof obj.icon !== 'undefined' ? obj.icon : undefined;
    this.ariaLabel = typeof obj.ariaLabel !== 'undefined' ? obj.ariaLabel : undefined;
    this.color = typeof obj.color !== 'undefined' ? obj.color : 'c3c3c3';
    this.fontColor = typeof obj.fontColor !== 'undefined' ? obj.fontColor : 'fff';

    this.lastTimer = this.getTimer();
    return this.toHtml();
  }

  toHtml() {
    let text = this.text.replace('%TIME%', this.lastTimer),
      ariaLabel = this.ariaLabel.replace('%TIME%', this.lastTimer),
      img = typeof (this.icon) !== 'undefined' ? `<img class="badge" src="${this.icon}" aria-label="${ariaLabel}">` : '';

    return `
      <figure class="playlist_item__tag" style="background:#${this.color};color:#${this.fontColor}">
        ${img}
        <figcaption>${text}</figcaption>
      </figure>`;
  }

  update(obj) {
    let timer = this.getTimer();
    if (timer != this.lastTimer || this.isSame(obj)) {
      this.lastTimer = timer;
    }
    return this.toHtml();
  }

  isSame(obj) {
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

  getTimer() {
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
}