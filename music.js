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
   * @param  {object} obj anonymous object from parsed JSON - music
   */
  update(obj) {
    if (typeof obj !== 'undefined') {
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
      this.updateTags(obj.tags);
    }
    else {
      // throw error in the console
      // console.error('no argument provided to update music object', this);
      console.trace('no argument provided to update music object', this);
    }
  }

  /**
   * update the tag list if needed
   * @param  {object} obj JSON parsed object - tag list
   * @return {Boolean} either or not something changed
   */
  updateTags(obj) {
    // if obj is provided
    if (typeof obj !== 'undefined') {
      let tagList = Array.from(this.tags);
      // loop through an image of the list and delete all tags that are not present anymore
      for (let i = 0, len = tagList.length; i < len; i++) {
        const currentTag = tagList[i];
        let objTagIndex = obj.findIndex(function (tag) {
          return tag.id === currentTag.id;
        })
        if (objTagIndex === -1) {
          this.tags[i].delete();
          this.tags.splice(i, 1);
        }
      }
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
          let tag = new Tag(objTag, this.id, i)
          // add the new tag object to the list at the good index
          this.tags.splice(i, 0, tag);
          if (0 <= i && i < length) {
            // insert the tag before the i-th tag
            this.dom.children().eq(0).children().eq(i).before(tag.toHtml());
          }
          else {
            // insert the tag at the end of the list
            this.dom.children().eq(0).append(tag.toHtml());
          }
        }
        else {
          // else if the tag index is not the same as the current one move it accordingly
          if (tagIndex !== i) {
            // move the tag visualy
            tag.move(i);
            // move the tag form its current position (tagIndex) to its new one (i) in the list
            this.tags.copyWithin(i, tagIndex);
          }
          // in all cases, trigger the tag update method
          tag.update(objTag)
        }
      }
    }
    // else, if obj.tags is not set
    else {
      // delete all tags from the dom
      for (let i = 0, len = this.tags.length; i < len; i++) {
        const tag = this.tags[i];
        tag.delete();
      }
      // clear the tags list
      this.tags = [];
    }
  }
}