<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class nodeController
 * @package Drupal\core\Controller
 */
class ItemController
{
  /**
   * @param $userId
   * @param $userRoles
   * @param $id
   * @param $reason
   * @return bool
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function delete($userId, $userRoles, $id, $reason): bool
  {
    $node = Node::load($id);
    if (empty($node)) {
      throw new Exception('IC01: Invalid node id');
    }

    if ($node->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['item_delete_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('IC02: Unauthorized to delete this item');
      }
    }

    $comments = Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'entity_id' => $id
      ]);

    foreach ($comments as $comment) {
      if (empty($comment->getParentComment())) {
        CommentController::delete($userId, $userRoles, $comment->id());
      }
    }

    $node->set('status', 0);
    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    ReportController::deleteAll($userId, $id, null);

    if (!$node->save()) {
      throw new Exception('IC03: Error in node delete');
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds,
        CommentController::getCommentators($node->id())
      )
    );

    $notificationUserIds = array_diff($notificationUserIds, [$userId]);

    if (!empty($notificationUserIds)) {
      NotificationsController::sendMultipleNotifications(
        $node,
        $userId,
        $notificationUserIds,
        str_replace('item', 'delete', $node->bundle()),
        $reason
      );
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['board_item_cache', 'community_item_cache', 'document_item_cache']);

    return true;
  }
}
