<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\comment\Entity\Comment;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\CacheController;
use Drupal\core\Utility\EnvController;
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
   * @param $entityId
   * @param $authorUid
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function create($entityId, $authorUid, $commentBody): int
  {
    $comment = Comment::create([
      'entity_type' => 'node',
      'entity_id' => $entityId,
      'field_name' => 'field_comments',
      'uid' => $authorUid,
      'comment_type' => 'comment',
      'subject' => 'comment_' . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('CMC01: Error in comment creation');
    }

    $node = Node::load($entityId);
    if (empty($node)) {
      throw new Exception('CMC02: Error in comment creation node load');
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds,
        CommentController::getCommentators($node->id())
      )
    );

    $notificationUserIds = array_diff($notificationUserIds, [$authorUid]);

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC03: Error in load node in comment create');
    }

    if (!empty($notificationUserIds)) {
      NotificationsController::sendMultipleNotifications(
        $node,
        $authorUid,
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
   * @param $entityId
   * @param $commentId
   * @param $authorUid
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function replyCreate($entityId, $commentId, $authorUid, $commentBody): int
  {
    $comment = Comment::create([
      'entity_type' => 'node',
      'entity_id' => $entityId,
      'field_name' => 'field_comments',
      'uid' => $authorUid,
      'pid' => $commentId,
      'comment_type' => 'comment',
      'subject' => 'comment_' . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('CMC04: Error in reply creation');
    }

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC05: Error in load node in reply create');
    }

    $parentComment = Comment::load($commentId);
    NotificationsController::sendNotification(
      $node,
      $comment->getOwnerId(),
      $parentComment->getOwnerId(),
      'comment_reply'
    );

    $node = Node::load($entityId);
    if (empty($node)) {
      throw new Exception('CMC06: Error in comment creation node load');
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds,
        CommentController::getCommentators($node->id())
      )
    );

    $notificationUserIds = array_diff($notificationUserIds, [$authorUid]);

    if (!empty($notificationUserIds)) {
      NotificationsController::sendMultipleNotifications(
        $node,
        $authorUid,
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
   * @param $userRoles
   * @param $id
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   */
  public static function update($userId, $userRoles, $id, $commentBody): int
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception('CMC07: Invalid comment id');
    }

    if ($comment->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['comment_update_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('CMC08: Unauthorized to update this item');
      }
    }


    $comment->set('comment_body', $commentBody);

    if (!$comment->save()) {
      throw new Exception('CMC09: Error in comment update');
    }

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC10: Error in load node in reply create');
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
   * @param $userRoles
   * @param $id
   * @param null $reason
   * @return array
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function delete($userId, $userRoles, $id, $reason = null): array
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception('CMC11: Invalid comment id');
    }

    if ($comment->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['comment_delete_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('CMC12: Unauthorized to delete this item');
      }
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
        throw new Exception('CMC13: Error in reply delete');
      }

      $deleteIds[] = (int)$reply->id();
      ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $reply->id());
    }

    $comment->set('status', 0);
    ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $comment->id());

    $node = Node::load($comment->getCommentedEntityId());
    if (empty($node)) {
      throw new Exception('CMC14: Error in load node in comment delete');
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
      throw new Exception('CMC15: Error in comment delete');
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
      throw new Exception('CMC16: Invalid node id in getCommentators');
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
