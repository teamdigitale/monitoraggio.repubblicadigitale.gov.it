<?php

namespace Drupal\be_middleware_integration\Plugin\SimpleCron;

use Drupal;
use Drupal\simple_cron\Plugin\SimpleCronPluginBase;

/**
 * Example cron job implementation.
 *
 * @SimpleCron(
 *   id = "sync_user_sync",
 *   label = @Translation("Cron to sync users from middleware")
 * )
 */
class SyncUserCron extends SimpleCronPluginBase
{

  /**
   * {@inheritdoc}
   */
  public function process(): void
  {
    $command = Drupal::service('sync_users.sync_users_command');
    $command->run();
  }
}
