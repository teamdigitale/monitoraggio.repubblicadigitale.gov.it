<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\cache_manager\Controller\CacheController;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
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
   * @param $node
   * @param $reason
   * @return bool
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function delete($userId, $node, $reason): bool
  {
    $comments = Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'entity_id' => $node->id()
      ]);

    foreach ($comments as $comment) {
      if (empty($comment->getParentComment())) {
        CommentController::delete($userId, $comment->id());
      }
    }

    $node->set('status', 0);
    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    ReportController::deleteAll($userId, $node->id(), null);

    if (!$node->save()) {
      throw new Exception('IC03: Error in node delete', 400);
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

    CacheController::resetViewCache($node->bundle() . 's');
    CacheController::resetViewCache('user_items');
    CacheController::resetViewCache('search_items');

    return true;
  }
}
