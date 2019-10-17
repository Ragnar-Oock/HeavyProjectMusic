class Music {
  /**
   * construct the object with the information of the parsed JSON
   * @param {object} obj anonymous object from parsed JSON
   */
  constructor(obj, index) {
    this.id = obj.id;
    this.title = obj.title;
    this.artist = obj.artist;
    this.tags = [];
    if (typeof (obj.tags) !== "undefined") {
      for (let i = 0, len = obj.tags.length; i < len; i++) {
        const tag = obj.tags[i];
        this.tags.push(new Tag(tag, this.id, i));
      }
    }
    this.requester = new Requester(obj.requester);
    this.index = index;

    this.htmlPrint();
    this.dom = $('#id' + this.id);
    this.lastUpdatedTime = '';
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
      html += this.tags[i].toHtml();
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

    let list = $('.playlist_list'),
      length = list.eq(0).children().length,
      html = `<div id="id${this.id}" class="playlist_item${vip} playlist_item_hidden" style="transform: translateY(${this.index * 8.5}em)">
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
    // update tags list
    this.updateTags(obj);
  }

  /**
   * update the tag list if needed
   * @param  {object} obj JSON parsed object
   * @return {Boolean} either or not something changed
   */
  updateTags(obj) {
    // loop througth all the tag of the received obj
    for (let i = 0, len = obj.length; i < len; i++) {
      const objTag = obj[i];
      // find the index of the current tag in the current tag list
      let tagIndex = this.tags.findIndex(function (tag) {
        return tag.id === objTag.id;
      }),
        tag = this.tags[tagIndex];

      // if the current tag is not present add it
      if (tagIndex === -1) {
        // add the new tag object to the list at the good index
        this.tags.splice(i, 0, new Tag(objTag, this.id, i));
      }
      // else if the tag index is not the same as the current one move it accordingly
      else if (tagIndex !== i) {
        // move the tag visualy
        tag.move(i);
        // move the tag form its current position (tagIndex) to its new one (i) in the list
        // this.tags.splice(i, 0, this.list.splice(tagIndex, 1)[0]);
        this.tags.copyWithin(i, tagIndex);
      }

      // in all cases, trigger the tag update method
      tag.update(objTag)
    }
  }
}
