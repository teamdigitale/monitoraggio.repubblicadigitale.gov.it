<?php

namespace Drupal\banned_words\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Controller to check for banned words in text
 */
class BannedWordsController extends ControllerBase {

  /**
   * @param $text
   * @return bool
   */
  public static function validateText($text): bool {
    $bannedWordsConfig = \Drupal::config('banned_words.config');
    $bannedWordList = array_map('trim', explode(';', $bannedWordsConfig->get('banned_words_list') ?? ''));

    foreach ($bannedWordList as $bannedWord) {
      if (str_contains(strtolower($text), $bannedWord) && !empty($bannedWord)) {
        return false;
      }
    }

    return true;
  }
}
