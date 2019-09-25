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
    this.dom = $('#id' + this.id);
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
    let vip = "";
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].text === "VIP") {
        vip = " VIP";
      }
    }

    let list = $('.playlist_list');
    let length = list.children.length;
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
    if (length === 0) {
      list.append(html);
    }
    else {
      if (this.index === 0) {
        list.prepend(html);
      }
      else if (this.index = length){
        list.append(html);
      }
      else {
        list.children[this.index].after(html);
      }
    }

    setTimeout(function() {
      $('#id' + this.id).removeClass('playlist_item_hidden');
    }.bind(this), 10);
  }

  /**
   * remove the item
   */
  delete() {
    this.dom.toggleClass('playlist_item_hidden', true);
  }

  /**
   * move the item to the desired location
   * @param  {int} index index to move the item to visualy
   */
  move(index) {
    this.dom[0].style.transform = 'translateY(' + (index * 8.5) + 'em)';
  }

  /**
   * edit the music item with the information from the new parsed json
   * @param  {object} obj anonymous object from parsed JSON
   */
  update(obj){
    console.log(this.title, obj.title, this.artist, obj.artist);
    if (this.title !== obj.title) {
      this.title = obj.title;
      $('#id' + this.id +' playlist_item__title>p').html(this.title);
    }
    if (this.artist !== obj.artist) {
      this.artist = obj.artist;
      $('#id' + this.id +' playlist_item__artiste>p').html(this.artist);
    }
  }
}
