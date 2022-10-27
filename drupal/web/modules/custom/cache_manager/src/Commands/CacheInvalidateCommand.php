<?php

namespace Drupal\cache_manager\Commands;

use Drupal;
use Drupal\cache_manager\Controller\CacheController;
use Drupal\core\Utility\EnvController;
use Drush\Commands\DrushCommands;
use Exception;
use Symfony\Component\Console\Output\ConsoleOutput;

/**
 *
 */
class CacheInvalidateCommand extends DrushCommands
{
  /**
   * Cache invalidation
   *
   * @usage drush cache:invalidate
   *
   * @command cache:invalidate
   * @aliases cache:inv
   */
  public function run()
  {
    $output = new ConsoleOutput();
    $output->writeln('Cache invalidation start ..');

    try {
      $viewIds = (array)EnvController::getValues('VIEWS_IDS_TO_INVALIDATE');

      if (empty($viewIds)) {
        throw new Exception('CAINV01: Error in loading cache view ids', 400);
      }

      $invalidatedViewIds = [];
      foreach ($viewIds as $viewId) {
        if (CacheController::resetViewCache($viewId)) {
          $invalidatedViewIds[] = $viewId;
        }
      }

      $log = 'Cache invalidation successful.
      Invalidate cache ids:' . json_encode($invalidatedViewIds) . '.';
      $output->writeln($log);
      Drupal::logger('cache:invalidate')->info($log);
    } catch (Exception $ex) {
      $message = 'Error:' . $ex->getMessage();

      $output->writeln($message);
      Drupal::logger('cache:invalidate')->error($message);
    }

    $output->writeln('Cache invalidation finish ..');
  }
}
