<?php

namespace Drupal\core\Utility;

use Drupal\views\Views;
use Exception;

/**
 * Class nodeController
 * @package Drupal\core\Utility
 */
class CacheController
{
  /**
   * @param $viewId
   * @return bool
   * @throws Exception
   */
  public static function resetViewCache($viewId): bool
  {
    $view = Views::getView($viewId);

    if (empty($view)) {
      throw new Exception('CC01: Invalid view id.');
    }

    $view->storage->invalidateCaches();

    return true;
  }
}
