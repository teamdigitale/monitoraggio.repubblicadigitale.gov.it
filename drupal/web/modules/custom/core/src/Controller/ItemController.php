<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\notifications\Controller\NotificationsController;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;

/**
 * Class nodeController
 * @package Drupal\core\Controller
 */
class ItemController
{
  /**
   * @param $id
   * @return bool
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws Exception
   */
  public static function delete($userId, $id, $reason): bool {
    $node = Node::load($id);
    if (empty($node)) {
      throw new Exception("Invalid node id");
    }

    $comments = \Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'entity_id' => $id
      ]);

    foreach ($comments as $comment) {
      if(empty($comment->getParentComment())){
        CommentController::delete($userId, $comment->id());
      }
    }

    $node->set('status', 0);
    $node->setNewRevision(TRUE);
    $node->setRevisionCreationTime(\Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    ReportController::deleteAll($userId, $id, null);

    if (!$node->save()) {
      throw new Exception('Error in node delete');
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds, 
        CommentController::getCommentators($node->id())
        )
      );

    $notificationUserIds = array_diff($notificationUserIds, [$userId]);

    if(!empty($notificationUserIds)){
      NotificationsController::sendMultipleNotifications(
        $node,
        $userId,
        $notificationUserIds,
        str_replace("item", "delete", $node->bundle()),
        $reason
      );
    }
    return true;
  }
}
