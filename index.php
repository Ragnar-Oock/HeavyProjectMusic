<?php
  include './lang/FR_fr.php';
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>HeavyChatMusic</title>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="requester.js"></script>
  <script src="tag.js"></script>
  <script src="music.js"></script>
  <script src="processing.js"></script>
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
      <input type="checkbox" class="menu__item_checkbox" id="stream_mode" <?php if (isset($_GET['stream'])) {
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
      <input type="checkbox" class="menu__item_checkbox" id="show_id" <?php if (isset($_GET['show_id'])) {
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
      <div class="warning">
        <div class="warning_title">
          <i class="fas fa-exclamation-triangle warning_title__icon"></i><span class="warning_title__text"><?php echo constant("NOSCRIPT_TITLE"); ?></span>
        </div>
        <div class="warning_body">
          <?php echo constant("NOSCRIPT_BODY") ?>
        </div>
      </div>
    </noscript>
    <div id="playlist">
      <div class="playlist_head">
        <button type="button" id="refresh" title="<?php echo constant("REFRESH_BUTTON"); ?>">
          <i class="btn_icon fas fa-sync-alt"></i><span class="btn_txt"><?php echo constant("REFRESH_BUTTON"); ?></span>
        </button>
        <div class="playlist_length">
          <?php
          echo constant("PLAYLIST_LENGTH_TOTAL_PRE");?><span id="playlist_length_total">0</span><?php echo constant("PLAYLIST_LENGTH_TOTAL_POST"); ?>
        </div>
      </div>
      <div class="playlist_list">

      </div>
    </div>
  </main>

  <footer>
    <p><?php echo constant("FOOTER_AUTOR"); ?>Rägnar O'ock</p>
    <p><?php echo constant("FOOTER_ISSUE") ?></p>
  </footer>
</body>
</html>
