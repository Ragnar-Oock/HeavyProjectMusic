class Requester {
  /**
  * contruct the object from the informations of the JSON
  * @param {object} obj anonymous object from parsed JSON
  */
  constructor(obj) {
    this.displayName = obj.displayName;
    // if no color is specified placeholder is twitch's purple
    this.color = typeof obj.color !== 'undefined' ? obj.color : '8a2be2';
    // if no badges are specified leave it empty
    this.badges = typeof obj.badges !== 'undefined' ? obj.badges : [];
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

  isSame(obj) {
    if (this.color !== obj.color) {
      return false;
    }
    if (this.displayName !== obj.displayName) {
      return false;
    }
    if ((this.badges.length !== 0 && typeof obj.badges === 'undefined') || this.badges.length !== obj.badges.length) {
      return false;
    }
    for (var i = 0; i < this.badges.length; i++) {
      if (this.badges[i].alttext !== obj.badges[i].alttext) {
        return false;
      }
      if (this.badges[i].icon !== obj.badges[i].icon) {
        return false;
      }
    }
    return true;
  }
}
