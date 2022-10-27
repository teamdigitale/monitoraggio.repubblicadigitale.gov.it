<?php

namespace Drupal\notifications\Controller;

use Drupal;
use Drupal\cache_manager\Controller\CacheController;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\core\Utility\EnvController;
use Drupal\core\Utility\TaxonomyController;
use Drupal\user\Entity\User;
use Exception;

/**
 *
 */
class NotificationsController
{
  /**
   * @param $entity
   * @param $senderId
   * @param $receiverId
   * @param $type
   * @param $reason
   * @param $contentAuthorId
   * @return void
   * @throws Exception
   */
  public static function sendNotification($entity, $senderId, $receiverId, $type, $reason = null, $contentAuthorId = null): void
  {
    $messages = Drupal::config('notifications.messages');

    if (empty($messages)) {
      throw new Exception('NC01: Notification messages are not set', 400);
    }

    if (empty($entity)) {
      throw new Exception('NC02: Notification entity is not set', 400);
    }

    if (empty($type) || empty($messages->get($type))) {
      throw new Exception('NC03: Error in notification type', 400);
    }

    $user = User::load($senderId);
    if (empty($user)) {
      throw new Exception('NC04: Error in user load in notification create.', 400);
    }

    $contentAuthorUserName = '';
    if (!empty($contentAuthorId)) {
      $contentAuthor = User::load($contentAuthorId);
      if (empty($contentAuthor)) {
        throw new Exception('NC05: Error in content author load in notification create.', 400);
      }
      $contentAuthorUserName = '$' . $contentAuthor->getAccountName() . '$';
    }

    $variables = [
      'sender' => '$' . $user->getAccountName() . '$',
      'title' => $entity->getTitle(),
      'reason' => $reason ?? '',
      'content_author' => $contentAuthorUserName
    ];

    $messageContent = $messages->get($type);

    foreach ($variables as $key => $value) {
      $messageContent = str_replace('{' . strtoupper($key) . '}', $value, $messageContent);
    }

    $notificationService = Drupal::service('notifications_widget.logger');
    $message = [
      'id' => $entity->id(),
      'bundle' => $entity->bundle(),
      'content' => $messageContent,
      'content_link' => 'users-list'
    ];

    $notificationService->logNotification($message, $type, $entity, $receiverId);
    CacheController::resetViewCache('user_notifications');
  }

  /**
   * @param $entity
   * @param $senderId
   * @param array $receiverIds
   * @param $type
   * @param $reason
   * @param $contentAuthorId
   * @return void
   * @throws Exception
   */
  public static function sendMultipleNotifications($entity, $senderId, array $receiverIds, $type, $reason = null, $contentAuthorId = null): void
  {
    if (empty($entity)) {
      throw new Exception('NC06: Notification entity is not setted.', 400);
    }

    if (empty($receiverIds)) {
      throw new Exception('NC07: No notification receiver ids.', 400);
    }

    foreach ($receiverIds as $receiverId) {
      self::sendNotification($entity, $senderId, $receiverId, $type, $reason, $contentAuthorId);
    }
  }

  /**
   * @param $notificationIds
   * @param $status
   * @return void
   * @throws Exception
   */
  public static function setNotificationStatus($notificationIds, $status): void
  {
    try {
      $query = Drupal::database()->update('notifications')
        ->fields([
          'status' => $status
        ]);
      $query->condition('id', $notificationIds, 'IN');
      $query->execute();

      CacheController::resetViewCache('user_notifications');
    } catch (Exception $ex) {
      throw new Exception('NC09: Error in notification update.', 400);
    }
  }

  /**
   * @param $notificationIds
   * @return void
   * @throws Exception
   */
  public static function deleteNotifications($notificationIds): void
  {
    try {
      $query = Drupal::database()->delete('notifications');
      $query->condition('id', $notificationIds, 'IN');
      $query->execute();

      CacheController::resetViewCache('user_notifications');
    } catch (Exception $ex) {
      throw new Exception('NC10: Error in notification delete.', 400);
    }
  }

  /**
   * @return array
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function getNotificationUserIds(): array
  {
    $termId = TaxonomyController::termIdByName('user_groups', EnvController::getValues('USER_GROUP_FOR_NOTIFICATION'));
    if (empty($termId)) {
      throw new Exception('NC10: Notification user roles does not exist.', 400);
    }

    $notificationUsers = Drupal::entityTypeManager()
      ->getStorage('user')
      ->loadByProperties([
        'field_groups' => [$termId]
      ]);

    $userIds = [];
    foreach ($notificationUsers as $notificationUser) {
      $userIds[] = $notificationUser->id();
    }

    return $userIds;
  }
}
