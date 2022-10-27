<?php

namespace Drupal\cache_manager\Plugin\SimpleCron;

use Drupal;
use Drupal\simple_cron\Plugin\SimpleCronPluginBase;

/**
 * Example cron job implementation.
 *
 * @SimpleCron(
 *   id = "cache_invalidate",
 *   label = @Translation("Cron to invalidate all views' cache")
 * )
 */
class CacheInvalidateCron extends SimpleCronPluginBase
{
  /**
   * {@inheritdoc}
   */
  public function process(): void
  {
    $command = Drupal::service('cache.invalidate');
    $command->run();
  }
}
