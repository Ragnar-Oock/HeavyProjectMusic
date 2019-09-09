<?php
  include './lang/FR_fr.php';
  if (isset($__GET['stream'])) {
    echo "checked='true'";
  }
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>HeavyChatMusic</title>
  <script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="lib/anime.min.js"></script>
  <script src="requester.js"></script>
  <script src="music.js"></script>
  <script src="main.js"></script>
  <link rel="stylesheet" href="css.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css">
</head>
<body>
  <input type="checkbox" id="menu" class="menu_checkbox">
  <div class="screen"></div>
  <header class="header">
    <label for="menu" class="menu__icon">
      <div class="menu__icon_bar bar1"></div>
      <div class="menu__icon_bar bar2"></div>
      <div class="menu__icon_bar bar3"></div>
    </label>
  </header>
  <nav class="menu">
    <div class="menu__item">
      <input type="checkbox" class="menu__item_checkbox" id="autoRefresh">
      <label for="autoRefresh" class="menu__item_label checkbox">
        <div class="checkbox_icon"></div>
        <span><?php
        echo constant("AUTO_REFRESH");
        ?></span>
      </label>
    </div>
    <div class="menu__item">
      <input type="checkbox" class="menu__item_checkbox" id="dark_mode">
      <label for="dark_mode" class="menu__item_label checkbox">
        <div class="checkbox_icon"></div>
        <span><?php
        echo constant("DARK_MODE");
        ?></span>
      </label>
    </div>
    <div class="menu__item">
      <input type="checkbox" class="menu__item_checkbox" id="stream_mode" <?php if (isset($__GET['stream'])) {
        echo "checked='true'";
      } ?>>
      <label for="stream_mode" class="menu__item_label checkbox">
        <div class="checkbox_icon"></div>
        <span><?php
        echo constant("STREAM_MODE");
        ?></span>
      </label>
    </div>
    <div class="menu__item">
      <input type="checkbox" class="menu__item_checkbox" id="show_id" <?php if (isset($__GET['show_id'])) {
        echo "checked='true'";
      } ?>>
      <label for="show_id" class="menu__item_label checkbox">
        <div class="checkbox_icon"></div>
        <span><?php
        echo constant("SHOW_ID");
        ?></span>
      </label>
    </div>
  </nav>
  <main>
    <noscript>
      <?php
      echo constant("NOSCRIPT");
      ?>
    </noscript>
    <div id="playlist">
      <div class="playlist_head">
        <button type="button" onclick="ajaxd(true);" id="refresh" title="<?php echo constant("REFRESH_BUTTON"); ?>">
          <i class="fas fa-sync-alt"></i><span><?php echo constant("REFRESH_BUTTON"); ?></span>
        </button>
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
    </div>
  </main>

  <footer>
    <p><?php echo constant("FOOTER_AUTOR"); ?>Rägnar O'ock</p>
  </footer>
</body>
</html>
