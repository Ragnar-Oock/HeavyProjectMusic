<?php
  include './lang/FR_fr.php';
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>HeavyBot</title>
  <script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="lib/anime.min.js"></script>
  <script src="requester.js"></script>
  <script src="music.js"></script>
  <script src="main.js"></script>
  <link rel="stylesheet" href="css.css">
</head>
<body>
  <button type="button" name="button" class="btn">AJAX!</button>
  <noscript>
    <?php
      echo constant("NOSCRIPT")
    ?>
  </noscript>
  <div id="playlist">
    <div class="playlist_length">
      <?php
      echo constant("PLAYLIST_LENGTH_DISPLAY_LABEL_PRE");
      ?>
      <!-- <span id="playlist_length_displayed">0</span> -->
      <?php
      // echo constant("PLAYLIST_LENGTH_DISPLAY_LABEL_POST");
      // echo constant("PLAYLIST_LENGTH_CEPARATOR");
      echo constant("PLAYLIST_LENGTH_TOTAL_PRE");?><span id="playlist_length_total">0</span><?php echo constant("PLAYLIST_LENGTH_TOTAL_POST"); ?>
    </div>
  </div>

  <footer>
    <p><?php echo constant("FOOTER_AUTOR"); ?>Rägnar O'ock</p>
  </footer>
</body>
</html>
