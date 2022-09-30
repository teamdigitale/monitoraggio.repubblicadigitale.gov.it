<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Drupal\core\Utility\EnvController;

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
   * @return bool
   */
  public static function flag($flagMachineName, $entityObj, $userObj): bool
  {
    $flagService = \Drupal::service('flag');
    $flag = $flagService->getFlagById($flagMachineName);

    $flaggingStatus = $flagService->getFlagging($flag, $entityObj, $userObj);
    if (!$flaggingStatus) {
      $flagService->flag($flag, $entityObj, $userObj);
    }

    if ($flagMachineName == "like" || $flagMachineName == "like_comment") {
      $type = "comment_like";
      $notificationUserIds[] = $entityObj->getOwnerId();
      $bundle = $entityObj->bundle();

      if ($entityObj->bundle() != 'comment') {
        $notificationUserIds = array_unique(
          array_merge(
            $notificationUserIds,
            CommentController::getCommentators($entityObj->id())
          )
        );
        $type = str_replace("item", "like", $bundle);
      }

      if ($entityObj->bundle() == 'comment') {
        $node = Node::load($entityObj->getCommentedEntityId());
        if (empty($node)) {
          throw new Exception('Error in load node in comment create');
        }

        $entityObj = $node;
      }

      $notificationUserIds = array_diff($notificationUserIds, [$userObj->id()]);

      if (!empty($notificationUserIds)) {
        NotificationsController::sendMultipleNotifications($entityObj, $userObj->id(), $notificationUserIds, $type);
      }
    }

    $FLAG_ID_TO_VIEW_ID = (array)EnvController::getValues('FLAG_ID_TO_VIEW_ID');
    if(in_array($flagMachineName, $FLAG_ID_TO_VIEW_ID)){
      CacheController::resetViewCache($FLAG_ID_TO_VIEW_ID[$flagMachineName]);
    }

    return true;
  }

  /**
   * @param $flagMachineName
   * @param $entityObj
   * @param $userObj
   * @return bool
   */
  public static function unflag($flagMachineName, $entityObj, $userObj): bool
  {
    $flagService = \Drupal::service('flag');
    $flag = $flagService->getFlagById($flagMachineName);

    $flaggingStatus = $flagService->getFlagging($flag, $entityObj, $userObj);
    if ($flaggingStatus) {
      $flagService->unflag($flag, $entityObj, $userObj);
    }
    
    $FLAG_ID_TO_VIEW_ID = (array)EnvController::getValues('FLAG_ID_TO_VIEW_ID');
    if(in_array($flagMachineName, $FLAG_ID_TO_VIEW_ID)){
      CacheController::resetViewCache($FLAG_ID_TO_VIEW_ID[$flagMachineName]);
    }

    return true;
  }
}
