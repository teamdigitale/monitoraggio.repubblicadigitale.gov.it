<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\cache_manager\Controller\CacheController;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\core\Utility\EnvController;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class FlagController
 * @package Drupal\core\Controller
 */
class FlagController
{
  /**
   * @param $flagMachineName
   * @param $entityObj
   * @param $userObj
   * @return mixed
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function flag($flagMachineName, $entityObj, $userObj)
  {
    $flagService = Drupal::service('flag');
    $flag = $flagService->getFlagById($flagMachineName);

    $flaggingStatus = $flagService->getFlagging($flag, $entityObj, $userObj);
    if (!$flaggingStatus) {
      $flaggingStatus = $flagService->flag($flag, $entityObj, $userObj);
    }

    if ($flagMachineName == 'like' || $flagMachineName == 'like_comment') {
      $type = 'comment_like';
      $notificationUserIds[] = $entityObj->getOwnerId();
      $bundle = $entityObj->bundle();

      if ($entityObj->bundle() != 'comment') {
        $notificationUserIds = array_unique(
          array_merge(
            $notificationUserIds,
            CommentController::getCommentators($entityObj->id())
          )
        );
        $type = str_replace('item', 'like', $bundle);
      }

      if ($entityObj->bundle() == 'comment') {
        $node = Node::load($entityObj->getCommentedEntityId());
        if (empty($node)) {
          throw new Exception('FLC01: Error in load node in comment create', 400);
        }

        $entityObj = $node;
      }

      $notificationUserIds = array_diff($notificationUserIds, [$userObj->id()]);

      if (!empty($notificationUserIds)) {
        NotificationsController::sendMultipleNotifications($entityObj, $userObj->id(), $notificationUserIds, $type);
      }
    }

    $FLAG_ID_TO_VIEW_ID = (array)EnvController::getValues('FLAG_ID_TO_VIEW_ID');
    if (in_array($flagMachineName, $FLAG_ID_TO_VIEW_ID)) {
      CacheController::resetViewCache($FLAG_ID_TO_VIEW_ID[$flagMachineName]);
    }

    return $flaggingStatus;
  }

  /**
   * @param $flagMachineName
   * @param $entityObj
   * @param $userObj
   * @return bool
   * @throws Exception
   * @throws Exception
   */
  public static function unflag($flagMachineName, $entityObj, $userObj): bool
  {
    $flagService = Drupal::service('flag');
    $flag = $flagService->getFlagById($flagMachineName);

    $flaggingStatus = $flagService->getFlagging($flag, $entityObj, $userObj);
    if ($flaggingStatus) {
      $flagService->unflag($flag, $entityObj, $userObj);
    }

    $FLAG_ID_TO_VIEW_ID = (array)EnvController::getValues('FLAG_ID_TO_VIEW_ID');
    if (in_array($flagMachineName, $FLAG_ID_TO_VIEW_ID)) {
      CacheController::resetViewCache($FLAG_ID_TO_VIEW_ID[$flagMachineName]);
    }

    return true;
  }

  /**
   * @param $flag
   * @param $status
   * @return bool
   * @throws Exception
   */
  public static function setFlagStatus($flag, $status)
  {
    if (empty($flag)) {
      throw new Exception('FLC01: Empty flag in set flag status', 400);
    }

    if (empty($status)) {
      throw new Exception('FLC02: Empty status in set flag status', 400);
    }

    $flag->field_status->value = $status;
    if (!$flag->save()) {
      throw new Exception('FLC03: Error in flag safe in flag status', 400);
    }

    return true;
  }
}
