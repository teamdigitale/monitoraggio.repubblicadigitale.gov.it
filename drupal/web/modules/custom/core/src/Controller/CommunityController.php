<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\core\Utility\TaxonomyController;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class CommunityController
 * @package Drupal\core\Controller
 */
class CommunityController
{

  /**
   * @param $entity
   * @param $entityType
   * @param $userId
   * @param $title
   * @param $category
   * @param $description
   * @param $tags
   * @return int
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function create($entity, $entityType, $userId, $title, $category, $description, $tags): int
  {
    $tagsTermIds = [];
    foreach ($tags as $tag) {
      $tagsTermIds[] = TaxonomyController::createOrGetTermTid('tags', $tag);
    }

    $node = Node::create([
      'uid' => $userId,
      'type' => 'community_item',
      'title' => $title,
      'field_entity' => $entity,
      'field_entity_type' => $entityType,
      'field_category' => $category,
      'field_tags' => $tagsTermIds,
      'field_description' => $description,
    ]);
    $node->setPublished();

    if (!$node->save()) {
      throw new Exception('CYC01: Error in community node creation');
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['community_item_cache']);

    return (int)$node->id();
  }

  /**
   * @param $userId
   * @param $userRoles
   * @param $id
   * @param $title
   * @param $category
   * @param $description
   * @param $tags
   * @return int
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function update($userId, $userRoles, $id, $title, $category, $description, $tags): int
  {
    $node = Node::load($id);
    if (empty($node) || $node->bundle() != 'community_item') {
      throw new Exception('CYC02: Invalid node id');
    }

    if ($node->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['community_item_modify_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('CYC03: Unauthorized to modify this item');
      }
    }

    $tagsTermIds = [];
    foreach ($tags as $tag) {
      $tagsTermIds[] = TaxonomyController::createOrGetTermTid('tags', $tag);
    }

    $node->set('title', $title);
    $node->set('field_category', $category);
    $node->set('field_description', $description);
    $node->set('field_tags', $tagsTermIds);

    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    if (!$node->save()) {
      throw new Exception('CYC04: Error in community node update');
    }

    if ($node->getOwnerId() != $userId) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $node->getOwnerId(),
        'community_update'
      );
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['community_item_cache']);

    return (int)$node->id();
  }
}
