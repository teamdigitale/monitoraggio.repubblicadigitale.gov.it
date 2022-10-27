<?php

namespace Drupal\banned_words\Controller;

use Drupal;
use Drupal\Core\Controller\ControllerBase;

/**
 *
 */
class BannedWordsController extends ControllerBase
{
  /**
   * @param $text
   * @return bool
   */
  public static function validateText($text): bool
  {
    $bannedWordsConfig = Drupal::config('banned_words.config');

    $bannedWordList = array_map('trim', explode(';', $bannedWordsConfig->get('banned_words_list') ?? ''));

    foreach ($bannedWordList as $bannedWord) {
      if (!empty($bannedWord) && str_contains(strtolower($text ?? ''), strtolower($bannedWord ?? ''))) {
        return false;
      }
    }

    return true;
  }
}
