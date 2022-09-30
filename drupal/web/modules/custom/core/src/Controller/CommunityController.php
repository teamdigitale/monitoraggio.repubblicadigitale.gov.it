<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\core\Utility\TaxonomyController;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\notifications\Controller\NotificationsController;

/**
 * Class CommunityController
 * @package Drupal\core\Controller
 */
class CommunityController {

  /**
   * @param $userId
   * @param $title
   * @param $category
   * @param $description
   * @param $tags
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function create($userId, $title, $category, $description, $tags): int {
    $tagsTermIds = [];
    foreach ($tags as $tag) {
      $tagsTermIds[] = TaxonomyController::createOrGetTermTid('tags', $tag);
    }

    $node = Node::create([
      'uid' => $userId,
      'type' => 'community_item',
      'title' => $title,
      'field_category' => $category,
      'field_tags' => $tagsTermIds,
      'field_description' => $description,
    ]);
    $node->setPublished();

    if (!$node->save()) {
      throw new Exception('Error in community node creation');
    }

    return (int) $node->id();
  }

  /**
   * @param $node
   * @param $title
   * @param $category
   * @param $description
   * @param $tags
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function update($userId, $id, $title, $category, $description, $tags): int {
    $node = Node::load($id);
    if (empty($node) || $node->bundle() != 'community_item') {
      throw new Exception("Invalid node id");
    }

    $tagsTermIds = [];
    foreach ($tags as $tag) {
      $tagsTermIds[] = TaxonomyController::createOrGetTermTid('tags', $tag);
    }

    $node->set('title', $title);
    $node->set('field_category', $category);
    $node->set('field_description', $description);
    $node->set('field_tags', $tagsTermIds);
    
    $node->setNewRevision(TRUE);
    $node->setRevisionCreationTime(\Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    if (!$node->save()) {
      throw new Exception('Error in community node update');
    }

    if($node->getOwnerId() != $userId){
      NotificationsController::sendNotification(
        $node, 
        $userId, 
        $node->getOwnerId(), 
        'community_update'
      );
    }

    return (int) $node->id();
  }
}
