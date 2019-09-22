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
    // get the current index of the item
    let pos = this.getIndexIn(item, this.list);
    // get the index of the current item in the new list
    let dest = this.getIndexIn(item, this.mod);
    // isolate the item id
    let id = item.id;

    console.log(pos, dest);

    // delete the item if the dest index is -1
    if (dest === -1) {
      // get the item index
      let index = this.getIndexIn(item, this.list);
      // delete the item
      this.list.splice(index, 1);
      // remove the dom item
      item.remove();
    }
    // move the item if needed
    else if (pos != dest) {
      // move the item from its current position to its new position in the list
      this.list.splice(dest, 0, this.list.splice(pos, 1));
      // edit the target position
      $('#id' + id)[0].style.transform = 'translateY(' + (dest * 8.5) + 'em);';
    }
    // else do nothing
  }

  /**
   * search for the index of the designited item in the new list
   * @param  {int} item index in this.list of item to search for
   * @return {int}      index in the new list
   */
  getIndexInMod(item) {
    // // return this.mod.indexOf(item);
    // let i = this.mod.length;
    // while (this.mod[i].id !== item.id && i >= 0) {
    //   i --;
    // }
    // return i;
    // //
    // for (var i = 0; i < this.mod.length; i++) {
    //   if (this.list[i].id === item.id) {
    //     return i;
    //   }
    // }
    // return -1;
  }

  /**
   * search for the index of the designited item in this.list
   * @param  {obj} item item to search for
   * @return {int}      index in the list
   */
  getIndexInList(item) {
    // return this.list.indexOf(item)
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].id === item.id) {
        return i;
      }
    }
    return -1;
  }

  getIndexIn(item, list) {
    // if list is empty the item cna't be in it, return -1
    if (list.length === 0) {
      return -1;
    }
    // otherwise search for the item
    else {
      // isolate the target id
      let target = item.id;
      // run throught the list and compare all ids
      // for (var i = list.length - 1; i >= 0; i--) {
      //   // if the ids matchs, stop the loop
      //   if (list[i].id === target) {
      //     break;
      //   }
      // }
      let i = list.length - 1;
      while (i > -1 && list[i].id != target) {
        i--;
      }
      // return the index
      console.log(i, list, item);
      return i;
    }
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
      let index = this.getIndexIn(current, this.list);
      if (index === -1) {
        added.push([i, current])
      }
      console.log(current.id, index, added);
    }
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
