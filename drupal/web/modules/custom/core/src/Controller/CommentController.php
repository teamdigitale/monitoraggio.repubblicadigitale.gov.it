<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\cache_manager\Controller\CacheController;
use Drupal\comment\Entity\Comment;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class CommentController
 * @package Drupal\core\Controller
 */
class CommentController
{

  /**
   * @param $nodeId
   * @param $userId
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function create($nodeId, $userId, $commentBody): int
  {
    $comment = Comment::create([
      'entity_type' => 'node',
      'entity_id' => $nodeId,
      'field_name' => 'field_comments',
      'uid' => $userId,
      'comment_type' => 'comment',
      'subject' => 'comment_' . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('CMC01: Error in comment creation', 400);
    }

    $node = Node::load($nodeId);
    if (empty($node)) {
      throw new Exception('CMC02: Error in comment creation node load', 400);
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds,
        CommentController::getCommentators($node->id())
      )
    );

    $notificationUserIds = array_diff($notificationUserIds, [$userId]);

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC03: Error in load node in comment create', 400);
    }

    if (!empty($notificationUserIds)) {
      NotificationsController::sendMultipleNotifications(
        $node,
        $userId,
        $notificationUserIds,
        str_replace('item', 'comment', $node->bundle())
      );
    }

    switch ($node->bundle()) {
      case 'board_item':
        CacheController::resetViewCache('board_items');
        CacheController::resetViewCache('board_item');
        break;
      case 'community_item':
        CacheController::resetViewCache('community_items');
        CacheController::resetViewCache('commy_item_view');
        break;
      case 'document_item':
        CacheController::resetViewCache('document_items');
        CacheController::resetViewCache('document_item_view');
        break;
    }

    return (int)$comment->id();
  }

  /**
   * @param $nodeId
   * @param $commentId
   * @param $userId
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function replyCreate($nodeId, $commentId, $userId, $commentBody): int
  {
    $comment = Comment::create([
      'entity_type' => 'node',
      'entity_id' => $nodeId,
      'field_name' => 'field_comments',
      'uid' => $userId,
      'pid' => $commentId,
      'comment_type' => 'comment',
      'subject' => 'comment_' . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('CMC04: Error in reply creation', 400);
    }

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC05: Error in load node in reply create', 400);
    }

    $parentComment = Comment::load($commentId);
    NotificationsController::sendNotification(
      $node,
      $comment->getOwnerId(),
      $parentComment->getOwnerId(),
      'comment_reply'
    );

    $node = Node::load($nodeId);
    if (empty($node)) {
      throw new Exception('CMC06: Error in comment creation node load', 400);
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
        str_replace('item', 'comment', $node->bundle())
      );
    }

    switch ($node->bundle()) {
      case 'board_item':
        CacheController::resetViewCache('board_items');
        CacheController::resetViewCache('board_item');
        break;
      case 'community_item':
        CacheController::resetViewCache('community_items');
        CacheController::resetViewCache('commy_item_view');
        break;
      case 'document_item':
        CacheController::resetViewCache('document_items');
        CacheController::resetViewCache('document_item_view');
        break;
    }

    return (int)$comment->id();
  }


  /**
   * @param $userId
   * @param $id
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   */
  public static function update($userId, $id, $commentBody): int
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception('CMC07: Invalid comment id', 400);
    }

    $comment->set('comment_body', $commentBody);

    if (!$comment->save()) {
      throw new Exception('CMC09: Error in comment update', 400);
    }

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC10: Error in load node in reply create', 400);
    }

    if ($comment->getOwnerId() != $userId) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $comment->getOwnerId(),
        'comment_update'
      );
    }

    return (int)$comment->id();
  }

  /**
   * @param $userId
   * @param $id
   * @param $reason
   * @return array
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function delete($userId, $id, $reason = null): array
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception('CMC11: Invalid comment id', 400);
    }

    $deleteIds = [];

    $replies = Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'pid' => $id
      ]);

    foreach ($replies as $reply) {
      $reply->set('status', 0);

      if (!$reply->save()) {
        throw new Exception('CMC13: Error in reply delete', 400);
      }

      $deleteIds[] = (int)$reply->id();
      ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $reply->id());
    }

    $comment->set('status', 0);
    ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $comment->id());

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC14: Error in load node in comment delete', 400);
    }

    if ($comment->getOwnerId() != $userId && !empty($reason)) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $comment->getOwnerId(),
        'comment_delete',
        $reason
      );
    }

    $deleteIds[] = (int)$id;

    if (!$comment->save()) {
      throw new Exception('CMC15: Error in comment delete', 400);
    }
    switch ($node->bundle()) {
      case 'board_item':
        CacheController::resetViewCache('board_items');
        CacheController::resetViewCache('board_item');
        break;
      case 'community_item':
        CacheController::resetViewCache('community_items');
        CacheController::resetViewCache('commy_item_view');
        break;
      case 'document_item':
        CacheController::resetViewCache('document_items');
        CacheController::resetViewCache('document_item_view');
        break;
    }

    return $deleteIds;
  }


  /**
   * @param $nodeId
   * @return array
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function getCommentators($nodeId): array
  {
    $node = Node::load($nodeId);
    if (empty($node)) {
      throw new Exception('CMC16: Invalid node id in getCommentators', 400);
    }

    $comments = Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'entity_id' => $nodeId,
      ]);

    $userIds = [];
    foreach ($comments as $comment) {
      $userIds[] = $comment->getOwnerId();
    }

    return array_unique($userIds);
  }
}
