class Requester {
  /**
  * contruct the object from the informations of the JSON
  * @param {object} obj anonymous object from parsed JSON
  */
  constructor(obj) {
    console.log(obj);
    this.displayName = obj.displayName;
    this.color = obj.color;
    this.badges = obj.badges;
  }

  /**
  * build the html markup to display the badges
  * @return {template literal} html markup
  */
  htmlBadges() {
    let html = "";
    for (var i = 0; i < this.badges.length; i++) {
      html += `<img class="badge" src="${this.badges[i].icon}" alt="${this.badges[i].alttext}" title="${this.badges[i].alttext}">`;
    }
    return html;
  }

  /**
   * build the html to display the list of badges
   * @return {template literal} html markup
   */
  toHTML() {
    return `<span style="color:#${this.color}">${this.displayName}</span>${this.htmlBadges()}`;
  }
}
