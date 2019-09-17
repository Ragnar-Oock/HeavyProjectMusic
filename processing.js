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
            for (var i = 0; i < this.list.length; i++) {
              // move the item as needed
              this.moveOrDelete(this.list[i]);
            }
            // add the new items to this.list
            this.add(this.getAddedInMod());
            this.updateLength();
          }
        }.bind(this),
        error: function(error){
          console.error(error);
        }
      });
    }
  }

  /**
   * add new item to the map and on screen
   * @param  {dict} added dictinary of all added items with their index
   */
  add(added) {
    for (var i = 0; i < added.length; i++) {
      let item = new Music(added[i][1], added[i][0]);
      this.list.splice(added[i][0], 0, item);
    }
  }

  /**
   * move an item in the list and on screen or delete it
   * @param  {int} item item to work with
   */
  moveOrDelete(item) {
    // get the index of the current item in the new list
    let dest = this.getIndexInMod(item);
    // isolate the item id
    let id = item.id;

    // delete the item if the dest index is -1
    if (dest === -1) {
      // get the item index
      let index = this.getIndexInList(item);
      // delete the item
      this.list.splice(index, 1);
      // remove the dom item
      item.remove();
    }
    // move the item otherwise
    else {
      // get the current index of the item
      let index = this.getIndexInList(item);

      // move the item from its current position to its new position
      this.list.splice(dest, 0, this.list.splice(index, 1));
      // get the target dom item style
      let targetStyle = $('#id' + id)[0].style.transform;
      // edit the item position on screen
      targetStyle = 'translateY(' + (dest * 8.5) + 'em);';
    }
  }

  /**
   * search for the index of the designited item in the new list
   * @param  {int} item index in this.list of item to search for
   * @return {int}      index in the new list
   */
  getIndexInMod(item) {
    return this.mod.indexOf(item);
  }

  /**
   * search for the index of the designited item in this.list
   * @param  {obj} item item to search for
   * @return {int}      index in the list
   */
  getIndexInList(item) {
    return this.list.indexOf(item)
  }

  /**
   * search for newly added item in the list
   * @return {array} list of [index, item] to add
   */
  getAddedInMod() {
    let added = [];
    // let i = 0;
    // while (i < this.mod.length) {
    //   let j = 0;
    //   // while j is less than list length and the comparated items are differents
    //   while (j < this.list.length && this.list[j].id != this.mod[i].id) {
    //     j++;
    //   }
    //   // if j is egal or more than list length, the current item is new
    //   if (j >= this.list.length) {
    //     // add the item to the list
    //     added.push([i, this.mod[i]]);
    //   }
    //   i++;
    // }
    for (var i = 0; i < this.mod.length; i++) {
      let current = this.mod[i];
      let index = this.getIndexInList(current);
      if (index === -1) {
        added.push([i, current])
      }
      console.log(current, index, added);
    }
    console.log(added);
    return added;
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
