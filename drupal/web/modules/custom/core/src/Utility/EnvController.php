<?php

namespace Drupal\core\Utility;

class EnvController {
  /**
   * @param $envKey
   * 
   */
  public static function getValues($envKey) {
    $envContent = file_get_contents(__DIR__ . '/../../../../../../env.json') ?? null;
    $values = json_decode($envContent);

    return $values->$envKey ?? null;
  }
}
