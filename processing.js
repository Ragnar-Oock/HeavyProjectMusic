class playlistProcessing {
  constructor(delay = 10000, url = 'sampleMusique.json') {
    this.last = []
    this.mod = [];
    this.list = [];
    this.autoRefresh = true;
    this.delay = delay;
    this.url = url;

    // first API call
    this.process();
    // set API call delay to the configurated delay
    setInterval(function () { this.process() }.bind(this), this.delay);
  }

  /**
   * process loop
   * @param  {Boolean} [force=false] either or not to force the processing of the playlist (for manual refresh)
   */
  process(force = false) {
    if (this.autoRefresh || force) {
      $.ajax({
        url: this.url,
        type: 'GET',
        cache: false,
        crossDomain: true,
        success: function (result) {
          this.last = this.mod;
          this.mod = result;
          // add the new items to this.list
          this.addNew();
          // move the item as needed
          this.updateAllItems();
          // update the length displayed
          this.updateLength();
        }.bind(this),
        error: function (error) {
          console.error(error);
        }
      });
    }
  }

  updateAllItems() {
    // create an image of the list
    let buffer = Array.from(this.list);
    // run througth the image
    for (var i = 0, len = buffer.length; i < len; i++) {
      // isolate the current item
      let item = buffer[i],
        id = item.id;
      // get the index of the current item in the list
      let pos = this.list.findIndex(function (current) {
        return current.id === id;
      })
      // let pos = this.getIndexIn(item, this.list);
      // get the index of the current item in the new list
      let dest = this.mod.findIndex(function (current) {
        return current.id === id;
      })
      // let dest = this.getIndexIn(item, this.mod);

      // delete the item if the dest index is -1
      if (dest === -1) {
        // remove the dom item
        item.delete();
        // delete the item from the list
        this.list.splice(pos, 1);
      }
      // move the item if the destination doesn't match the current position
      else {
        // move the item from its current position to its new position in the list
        // this.list.splice(dest, 0, this.list.splice(pos, 1)[0]);
        this.list.copyWithin(dest, pos);
        // edit the target position
        item.move(dest)
      }
    }
    for (var i = 0; i < this.list.length; i++) {
      // update the title/artist/requester/tags if needed
      this.list[i].update(this.mod[i]);
    }
  }

  // DEPRACATED
  /**
   * return the index of the passed item in the passed list
   * @param  {Music} item music item to find
   * @param  {array} list array of Music object to search in
   * @return {int}        index of the item in the list (-1 if not found)
   */
  // getIndexIn(item, list) {
  //   // isolate the target id
  //   let target = item.id;
  //   // run throught the list and compare all ids
  //   for (var i = 0; i < list.length; i++) {
  //     // if the ids matchs return the indiex
  //     if (list[i].id === target) {
  //       return i;
  //     }
  //   }
  //   // if the id is not in the list, return -1
  //   return -1;
  // }

  /**
   * add all new item at the correct location in this.list
   */
  addNew() {
    for (var i = 0; i < this.mod.length; i++) {
      let current = this.mod[i];
      // let index = this.getIndexIn(current, this.list);
      let index = this.list.findIndex(function (item) {
        return current.id === item.id;
      })
      if (index === -1) {
        // add the "Music" item at the mod index (i) in the list
        this.list.splice(i, 0, new Music(current, i));
      }
    }
  }

  /**
   * update the playlist length display at the top and the height of the wrapper
   */
  updateLength() {
    let length = this.list.length;
    // display the length
    $('#playlist_length_total').html(length);
    // update the height
    $('.playlist_list').height((length * 8.5) + 'em');
  }

  /**
   * set the autoRefresh value
   * @param {Boolean} [status=true] target value
   */
  setAutoRefresh(status = true) {
    this.autoRefresh = status;
  }

  /**
   * toggle the autoRefresh
   */
  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
  }
}
