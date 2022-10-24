<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class DocumentController
 * @package Drupal\core\Controller
 */
class DocumentController
{

  /**
   * @param $entity
   * @param $entityType
   * @param $userId
   * @param $title
   * @param $intervention
   * @param $program
   * @param $programLabel
   * @param $category
   * @param $description
   * @param $externalLink
   * @return int
   * @throws EntityStorageException
   */
  public static function create($entity, $entityType, $userId, $title, $intervention, $program, $programLabel, $category, $description, $externalLink): int
  {
    $node = Node::create([
      'uid' => $userId,
      'type' => 'document_item',
      'title' => $title,
      'field_entity' => $entity,
      'field_entity_type' => $entityType,
      'field_intervention' => $intervention,
      'field_program' => $program,
      'field_program_label' => $programLabel,
      'field_category' => $category,
      'field_description' => $description,
      'field_external_link' => $externalLink
    ]);
    $node->setPublished();

    if (!$node->save()) {
      throw new Exception('DC01: Error in document node creation');
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['document_item_cache']);

    return (int)$node->id();
  }

  /**
   * @param $userId
   * @param $userRoles
   * @param $id
   * @param $title
   * @param $intervention
   * @param $program
   * @param $programLabel
   * @param $category
   * @param $description
   * @param $externalLink
   * @return int
   * @throws EntityStorageException
   */
  public static function update($userId, $userRoles, $id, $title, $intervention, $program, $programLabel, $category, $description, $externalLink): int
  {
    $node = Node::load($id);
    if (empty($node) || $node->bundle() != 'document_item') {
      throw new Exception('DC02: Invalid node id');
    }

    if ($node->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['document_item_modify_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('DC03: Unauthorized to modify this item');
      }
    }

    $node->set('title', $title);
    $node->set('field_intervention', $intervention);
    $node->set('field_program', $program);
    $node->set('field_program_label', $programLabel);
    $node->set('field_category', $category);
    $node->set('field_description', $description);
    $node->set('field_external_link', $externalLink);

    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    if (!$node->save()) {
      throw new Exception('DC04: Error in board node update');
    }

    if ($node->getOwnerId() != $userId) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $node->getOwnerId(),
        'document_update'
      );
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['document_item_cache']);

    return (int)$node->id();
  }
}
