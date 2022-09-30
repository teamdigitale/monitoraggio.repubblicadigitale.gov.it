<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\views\Views;

/**
 * Class nodeController
 * @package Drupal\core\Controller
 */
class CacheController
{
  public static function resetViewCache($viewId){
    $view = Views::getView($viewId);
    
    if(empty($view)){
        throw new Exception('Invalid view id.');
    }

    $view->storage->invalidateCaches();

    return true;
  }
}
