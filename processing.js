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
    setInterval(function(){this.process()}.bind(this), this.delay);
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
        success: function(result){
          this.last = this.mod;
          this.mod = result;

          // if the result is different process it
          if (this.mod !== this.last) {
            // add the new items to this.list
            this.addNew();
            for (var i = 0; i < this.list.length; i++) {
              console.log(this.list, this.list[i]);
              // move the item as needed
              this.moveOrDelete(this.list[i]);
            }
            this.updateLength();

            console.log(this.list);
          }
        }.bind(this),
        error: function(error){
          console.error(error);
        }
      });
    }
  }

  /**
   * move an item in the list and on screen or delete it
   * @param  {int} item item to work with
   */
  moveOrDelete(item) {
    // get the current index of the item
    let pos = this.getIndexIn(item, this.list);
    // get the index of the current item in the new list
    let dest = this.getIndexIn(item, this.mod);
    // isolate the item id
    let id = item.id;

    console.log(dest);
    // delete the item if the dest index is -1
    if (dest === -1) {
      console.log(item);
      // remove the dom item
      item.delete();
      // delete the item from the list
      this.list.splice(pos, 1);
    }

    // move the item if the destination doesn't match the current position
    else if (pos != dest) {
      // move the item from its current position to its new position in the list
      this.list.splice(dest, 0, this.list.splice(pos, 1)[0]);
      // edit the target position
      item.move(dest)
    }
    // else do nothing
  }

  /**
   * return the index of the passed item in the passed list
   * @param  {Music} item music item to find
   * @param  {array} list array of Music object to search in
   * @return {int}        index of the item in the list (-1 if not found)
   */
  getIndexIn(item, list) {
    // isolate the target id
    let target = item.id;
    // run throught the list and compare all ids
    for (var i = 0; i < list.length; i++) {
      // if the ids matchs return the indiex
      if (list[i].id === target) {
        return i;
      }
    }
    // if the id is not in the list, return -1
    return -1;
  }

  /**
   * add all new item at the correct location in this.list
   */
  addNew() {
    for (var i = 0; i < this.mod.length; i++) {
      let current = this.mod[i];
      let index = this.getIndexIn(current, this.list);
      console.log(current, index);
      if (index === -1) {
        // add the "Music" item at "index" in he list
        this.list.splice(index, 0, new Music(current, index));
        // added.push([i, current])
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
