<?php

namespace Drupal\be_middleware_integration\Commands;

use Drupal;
use Drupal\be_middleware_integration\Controller\ApiIntegrationController;
use Drupal\be_middleware_integration\Controller\SyncUsersController;
use Drupal\core\Utility\EnvController;
use Drush\Commands\DrushCommands;
use Exception;
use Symfony\Component\Console\Output\ConsoleOutput;

/**
 *
 */
class SyncUsersCommand extends DrushCommands
{
  /**
   * Users groups sync flow
   *
   * @usage drush sync_users:sync
   *
   * @command sync_users:sync
   * @aliases su:sync
   */
  public function run()
  {
    $output = new ConsoleOutput();
    $output->writeln('Sync start ..');

    try {
      $token = EnvController::getValues('AUTHENTICATION_TOKEN');

      if (empty($token)) {
        $log = 'Token is not set';
        $output->writeln($log);
        Drupal::logger('drush:sync_users')->info($log);
        return;
      }

      $roles = ApiIntegrationController::getGroupsRolesByGroupCode($token, EnvController::getValues('NOTIFICATION_GROUP'));

      $userNames = [];
      ApiIntegrationController::getAllUsers($token, $roles, $userNames, 0);

      $result = SyncUsersController::checkReportUsers($userNames);
      $notificationUserIds = json_encode($result['notification_user_ids']);
      $removedUserIds = json_encode($result['removed_user_ids']);

      $log = "User synchronization successful.
      Notification users ids:$notificationUserIds.
      Removed user ids:$removedUserIds.
      ";

      $output->writeln($log);
      Drupal::logger('drush:sync_users')->info($log);
    } catch (Exception $ex) {
      $message = 'Error:' . $ex->getMessage();

      $output->writeln($message);
      Drupal::logger('drush:sync_users')->error($message);
    }

    $output->writeln('Sync finish ..');
  }
}
