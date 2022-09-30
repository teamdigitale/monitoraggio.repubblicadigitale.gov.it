<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\comment\Entity\Comment;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\notifications\Controller\NotificationsController;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;

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
      'entity_id'   => $entityId,
      'field_name'  => 'field_comments',
      'uid' => $authorUid,
      'comment_type' => 'comment',
      'subject' => "comment_" . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('Error in comment creation');
    }

    $node = Node::load($entityId);
    if (empty($node)) {
      throw new Exception('Error in comment creation node load');
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
    if(empty($node)){
      throw new Exception('Error in load node in comment create');
    }

    if(!empty($notificationUserIds)){
      NotificationsController::sendMultipleNotifications(
        $node,
        $authorUid,
        $notificationUserIds,
        str_replace("item", "comment", $node->bundle())
      );
    }

    return (int) $comment->id();
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
      'entity_id'   => $entityId,
      'field_name'  => 'field_comments',
      'uid' => $authorUid,
      'pid' => $commentId,
      'comment_type' => 'comment',
      'subject' => "comment_" . (int)(microtime(true) * 1000000),
      'comment_body' => $commentBody,
      'status' => 1
    ]);

    if (!$comment->save()) {
      throw new Exception('Error in reply creation');
    }

    $node = Node::load($comment->getCommentedEntityId());
    if(empty($node)){
      throw new Exception('Error in load node in reply create');
    }

    $parentComment = Comment::load($commentId);
    NotificationsController::sendNotification(
      $node,
      $comment->getOwnerId(),
      $parentComment->getOwnerId(),
      "comment_reply"
    );

    $node = Node::load($entityId);
    if (empty($node)) {
      throw new Exception('Error in comment creation node load');
    }

    $notificationUserIds[] = $node->getOwnerId();
    $notificationUserIds = array_unique(
      array_merge(
        $notificationUserIds, 
        CommentController::getCommentators($node->id())
      )
    );

    $notificationUserIds = array_diff($notificationUserIds, [$authorUid]);

    if(!empty($notificationUserIds)){
      NotificationsController::sendMultipleNotifications(
        $node,
        $authorUid,
        $notificationUserIds,
        str_replace("item", "comment", $node->bundle())
      );
    }

    return (int) $comment->id();
  }

  /**
   * @param $id
   * @param $commentBody
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function update($userId, $id, $commentBody): int
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception("Invalid comment id");
    }

    $comment->set('comment_body', $commentBody);

    if (!$comment->save()) {
      throw new Exception('Error in comment update');
    }
    
    $node = Node::load($comment->getCommentedEntityId());
    if(empty($node)){
      throw new Exception('Error in load node in reply create');
    }

    if ($comment->getOwnerId() != $userId) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $comment->getOwnerId(),
        "comment_update"
      );
    }

    return (int) $comment->id();
  }

  /**
   * @param $id
   * @return array
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function delete($userId, $id, $reason = null): array
  {
    $comment = Comment::load($id);
    if (empty($comment)) {
      throw new Exception("Invalid comment id");
    }

    $deleteIds = [];

    $replies = \Drupal::entityTypeManager()
      ->getStorage('comment')
      ->loadByProperties([
        'pid' => $id
      ]);

    foreach ($replies as $reply) {
      $reply->set('status', 0);

      if (!$reply->save()) {
        throw new Exception('Error in reply delete');
      }

      $deleteIds[] = (int) $reply->id();
      ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $reply->id());
    }

    $comment->set('status', 0);
    ReportController::deleteAll($userId, $comment->getCommentedEntityId(), $comment->id());

    $node = Node::load($comment->getCommentedEntityId());
    if(empty($node)){
      throw new Exception('Error in load node in comment delete');
    }

    if ($comment->getOwnerId() != $userId && !empty($reason)) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $comment->getOwnerId(),
        "comment_delete",
        $reason
      );
    }

    if (!$comment->save()) {
      throw new Exception('Error in comment delete');
    }


    $deleteIds[] = (int) $id;

    return $deleteIds;
  }

  public static function getCommentators($nodeId)
  {
    $node = Node::load($nodeId);
    if (empty($node)) {
      throw new Exception("Invalid node id");
    }

    $comments = \Drupal::entityTypeManager()
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
