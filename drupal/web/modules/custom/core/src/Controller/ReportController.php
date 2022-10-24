<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\comment\Entity\Comment;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 *
 */
class ReportController
{

  /**
   * @param $userId
   * @param $itemId
   * @param $commentId
   * @param $reason
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function createReport($userId, $itemId, $commentId, $reason): int
  {
    $node = Node::create([
      'uid' => $userId,
      'title' => 'report_' . (int)(microtime(true) * 1000000),
      'type' => 'report',
      'field_item' => $itemId,
      'field_comment_id' => $commentId,
      'field_reason' => $reason
    ]);

    $node->setPublished();
    if (!$node->save()) {
      throw new Exception('RC01: Error in item report creation');
    }

    $notificationUserIds = NotificationsController::getNotificationUserIds();

    $authorId = '';
    $itemNode = Node::load($itemId);
    if (empty($itemNode)) {
      throw new Exception('RC02: Error in node load in report creation');
    }
    $notificationType = str_replace('item', 'report', $itemNode->bundle());

    $authorId = $itemNode->getOwnerId();

    if (!empty($commentId)) {
      $comment = Comment::load($commentId);
      if (empty($comment)) {
        throw new Exception('RC03: Error in comment load in report creation');
      }

      $notificationType = 'comment_report';

      $authorId = $comment->getOwnerId();
    }

    if (!empty($notificationUserIds)) {
      NotificationsController::sendMultipleNotifications(
        $itemNode,
        $userId,
        $notificationUserIds,
        $notificationType,
        null,
        $authorId
      );
    }

    return (int)$node->id();
  }

  /**
   * @param $userId
   * @param $itemId
   * @param $commentId
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function deleteAll($userId, $itemId, $commentId): void
  {
    $queryParams['field_item'] = $itemId;
    if (!empty($commentId)) {
      $queryParams['field_comment_id'] = $commentId;
    }

    $reports = Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadByProperties($queryParams);

    foreach ($reports as $report) {
      self::delete($userId, $report);
    }
  }

  /**
   * @throws Exception
   */
  public static function delete($userId, $report): void
  {
    if (empty($report)) {
      throw new Exception('RC04: Empty report passed');
    }

    $report->set('status', 0);
    $report->setNewRevision(TRUE);
    $report->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $report->setRevisionUserId($userId);

    if (!$report->save()) {
      throw new Exception('RC05: Error in report delete');
    }
  }
}
