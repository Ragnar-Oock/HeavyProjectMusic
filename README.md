# HeavyProjectMusic
Dynamically display a playlist from a JSON file

## Currents functionalities
- parse and display the playlist from the specified JSON files (default: sampleMusique.json)
- automatically update the playlist every 10s (by default) unless the automatic refresh option is unchecked
- switch on/off dark mode
- switch on/off streaming mode
- switch on/off requests id display
- settings are stored locally
- preload settings using PHP args (available only for stream mode and id display)

## Known issues
- RAM overload when used for too long (>7h)
- the list gets messed up when editing a request but not changing the id
- the list gets messed up over time

## Dependencies
anime.js for the slide animation  
- [github page](https://github.com/juliangarnier/anime/)
- [web site](https://animejs.com/)

Roboto font from Google  
- [Google font page](https://fonts.google.com/specimen/Roboto)