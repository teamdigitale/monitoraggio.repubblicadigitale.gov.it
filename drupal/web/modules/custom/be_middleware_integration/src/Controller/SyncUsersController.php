<?php

namespace Drupal\be_middleware_integration\Controller;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\core\Controller\UserController;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\core\Utility\TaxonomyController;
use Drupal\notifications\Controller\NotificationsController;
use Drupal\user\Entity\User;
use Exception;

/**
 *
 */
class SyncUsersController
{
  /**
   * @param array $userNames
   * @return array
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws EntityStorageException
   */
  public static function checkReportUsers(array $userNames): array
  {
    $userIds = [];

    $termId = TaxonomyController::createOrGetTermTid('user_groups', EnvController::getValues('USER_GROUP_FOR_NOTIFICATION'));

    foreach ($userNames as $userName) {
      $userId = UserController::getOrCreate($userName);
      $user = User::load($userId);
      $user->set('field_groups', [$termId]);
      if (!$user->save()) {
        throw new Exception('SUC01: Error in setting notification user role', 400);
      }
      $userIds[] = $userId;
    }

    $notificationUserIds = NotificationsController::getNotificationUserIds();

    $userIdsToRemove = array_diff($notificationUserIds, $userIds);

    foreach ($userIdsToRemove as $userIdToRemove) {
      $user = User::load($userIdToRemove);
      $user->set('field_groups', []);
      if (!$user->save()) {
        throw new Exception('SUC02: Error in removing notification user role', 400);
      }
    }

    return [
      'notification_user_ids' => $userIds,
      'removed_user_ids' => $userIdsToRemove
    ];
  }
}
