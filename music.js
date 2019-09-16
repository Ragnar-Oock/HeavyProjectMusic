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

    this.htmlPrint();
  }

  /**
   * log all the properties of the object, debug purpose only
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
      <figure class="playlist_item__tag" style="background:#${this.tags[i].color};color:#fff">
        ${img}
        <figcaption>${this.tags[i].text}</figcaption>
      </figure>`
    }
    return html;
  }

  /**
   * append the object to the wrapper
   */
  htmlPrint() {
    console.log('debut print');
    let vip = "";
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].text === "VIP") {
        vip = " VIP";
      }
    }

    let list = $('.playlist_list');
    let html = `<div id="id${this.id}" class="playlist_item${vip} playlist_item_hidden" style="transform: translateY(${this.index * 8.5}em)">
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
          <p>${this.id}</p>
        </div>
        <div class="playlist_item__requester">
          ${this.requester.toHTML()}
        </div>
      </div>`;
    console.log('debut tests');
    if (list.length = 0) {
      list.html(html);
      console.log('1');
    }
    else {
      if (this.index = 0) {
        list.eq(this.index).before(html);
        console.log('2');
      }
      else {
        list.eq(this.index).after(html);
        console.log('3');
      }
    }

    console.log('timeout');
    setTimeout(function(item) {
      $('#id'+item.id).removeClass('playlist_item_hidden');
    }, 10, this);

    console.log('fin');
  }

  /**
   * remove the item
   */
  remove() {
    $('#id' + this.id).first()[0].remove();
  }
}
