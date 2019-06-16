class Music {
  /**
   * construct the object with the information of the parsed JSON
   * @param {object} obj anonymous object from parsed JSON
   */
  constructor(obj, index) {
    this.id = obj.id;
    this.title = obj.title;
    this.artist = obj.artist;
    if (typeof(obj.tags) !== "undefined") {
      this.tags = obj.tags;
    }
    else {
      this.tags = {};
    }
    this.requester = new Requester(obj.requester);
    this.index = index;
  }

  /**
   * log all the properties of the object, debug purpose only
   * @return {none} methode without return value
   */
  log() {
    console.log(this.id, this.title, this.artist, this.tags, this.requester, this.index);
  }

  /**
   * return the html markup to display the list of tags
   * @return {template literal} html markup
   */
  htmlTags() {
    let html = "";
    for (var i = 0; i < this.tags.length; i++) {
      let img = "";
      if (typeof(this.tags[i].icon) !== "undefined") {
        img = `<img class="badge" src="${this.tags[i].icon}">`
      }
      html += `
      <figure class="playlist_item__tag" style="background:#${this.tags[i].color};color:#d2d2d2">
        ${img}
        <figcaption>${this.tags[i].text}</figcaption>
      </figure>`
    }
    return html;
  }

  /**
   * append the object to the wrapper
   * @return {none} method without return value
   */
  htmlPrint() {
    let vip = "";
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].text === "VIP") {
        vip = " VIP";
      }
    }
    $('#playlist>div').eq(this.index).after(`
      <div id="id${this.id}" class="playlist_item${vip} playlist_item_hidden">
        <div class="playlist_item__tags">
          ${this.htmlTags()}
        </div>
        <div class="playlist_item__title">
          <p>${this.title}</p>
        </div>
        <div class="playlist_item__artiste">
          <p>${this.artist}</p>
        </div>
        <div class="playlist_item__id">
          <p>[${this.id}]</p>
        </div>
        <div class="playlist_item__requester">
          ${this.requester.toHTML()}
        </div>
      </div>`);
      setTimeout(function(item) {
        $('#id'+item.id).removeClass('playlist_item_hidden');
      }, 10, this);
  }
}
