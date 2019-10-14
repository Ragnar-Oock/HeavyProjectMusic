class Music {
  /**
   * construct the object with the information of the parsed JSON
   * @param {object} obj anonymous object from parsed JSON
   */
  constructor(obj, index) {
    this.id = obj.id;
    this.title = obj.title;
    this.artist = obj.artist;
    if (typeof (obj.tags) !== "undefined") {
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
      let img = "",
        currentTag = this.tags[i];
      if (currentTag.type === 'timer') {
        let delta = Math.round((Date.now() - currentTag.time) / 1000),
          min = Math.round(delta / 60) % 60,
          hours = Math.round(delta / 3600),
          time = "erreur";
        if (hours === 0) {
          time = min + 'min';
        }
        else if (min === 0) {
          time = hours + 'h';
        }
        else {
          time = hours + 'h ' + min + 'min';
        }
        currentTag.text = currentTag.text.replace('%TIME%', time);
        currentTag.ariaLabel = currentTag.ariaLabel.replace('%TIME%', time);
      }
      if (typeof (currentTag.icon) !== 'undefined') {
        img = `<img class="badge" src="${currentTag.icon}" aria-label="${currentTag.ariaLabel}">`
      }

      html += `
      <figure class="playlist_item__tag" style="background:#${currentTag.color};color:#${currentTag.fontColor === undefined ? "fff" : currentTag.fontColor}">
        ${img}
        <figcaption>${currentTag.text}</figcaption>
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
    let length = list.eq(0).children().length;
    let html = `<div id="id${this.id}" class="playlist_item${vip} playlist_item_hidden" style="transform: translateY(${this.index * 8.5}em)">
      <div class="playlist_item__tags fadable">
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
      <div class="playlist_item__requester fadable">
        ${this.requester.toHTML()}
      </div>
    </div>`;

    if (0 <= this.index && this.index < length) {
      list.children().eq(this.index).before(html);
    }
    else {
      list.append(html);
    }

    setTimeout(function () {
      $('#id' + this.id).removeClass('playlist_item_hidden');
    }.bind(this), 10);
  }

  /**
   * remove the item
   */
  delete() {
    this.dom.toggleClass('playlist_item_hidden', true);
    setTimeout(function () {
      this.dom[0].remove();
    }.bind(this), 300);
  }

  /**
   * move the item to the desired location
   * @param  {int} index index to move the item to visualy
   */
  move(index) {
    this.dom[0].style.transform = 'translateY(' + (index * 8.5) + 'em)';
    // if the item move at the first position
    if (index !== this.index) {
      if (index === 0) {
        this.dom.prependTo('.playlist_list');
      }
      // if the item move anywhere else
      else {
        this.dom.insertAfter('.playlist_item:nth-child(' + index + ')')
      }
    }
  }

  /**
   * edit the music item with the information from the new parsed json
   * @param  {object} obj anonymous object from parsed JSON
   */
  update(obj) {
    // compare title
    if (this.title !== obj.title) {
      this.title = obj.title;
      $('#id' + this.id + ' .playlist_item__title>p').html(this.title);
    }
    // compare artist name
    if (this.artist !== obj.artist) {
      this.artist = obj.artist;
      $('#id' + this.id + ' .playlist_item__artiste>p').html(this.artist);
    }
    // compare tags list
    if (!this.areTagsSame(obj)) {
      this.tags = obj.tags;
      let tags_list = $('#id' + this.id + ' .playlist_item__tags');
      // fade the list out
      tags_list.toggleClass('fade', true);
      setTimeout((tags_list) => {
        // when the animation end, update the list
        tags_list.html(this.htmlTags());
        // fade the list in
        tags_list.toggleClass('fade', false);
      }, 300, tags_list);
    }
    // compare the requester
    if (!this.requester.isSame(obj.requester)) {
      this.requester = new Requester(obj.requester);
      let requester = $('#id' + this.id + ' .playlist_item__requester');
      // fade the requester out
      requester.toggleClass('fade', true);
      setTimeout((requester) => {
        // when the animation end, update the requester displayed
        requester.html(this.requester.toHTML());
        // fade the requester in
        requester.toggleClass('fade', false);
      }, 300, requester);
    }
  }

  /**
   * evaluate either or not the tag list is the same between this and the passed object
   * @param  {object} obj JSON parsed object
   * @return {Boolean}
   */
  areTagsSame(obj) {
    if (this.tags.length !== obj.tags.length) {
      return false;
    }
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].text !== obj.tags[i].text) {
        return false;
      }
      if (this.tags[i].icon !== obj.tags[i].icon) {
        return false;
      }
      if (this.tags[i].color !== obj.tags[i].color) {
        return false;
      }
    }
    return true;
  }

  /**
   * update all tags with timers
   */
  updateTimers() {
    let update = false;
    for (let i = 0, len = this.tags.length; i < len; i++) {
      const tag = this.tags[i];
      if (tag.type === 'timer') {
        update = true;
      }
    }
    if (update) {
      let tags_list = $('#id' + this.id + ' .playlist_item__tags');
      // fade the list out
      tags_list.toggleClass('fade', true);

      setTimeout((tags_list) => {
        // when the animation end, update the list
        tags_list.html(this.htmlTags());
        // fade the list in
        tags_list.toggleClass('fade', false);
      }, 300, tags_list);
    }
  }
}
