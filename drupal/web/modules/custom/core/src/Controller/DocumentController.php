<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Core\Entity\EntityStorageException;
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
      throw new Exception('DC01: Error in document node creation', 400);
    }

    Drupal::service('cache_tags.invalidator')->invalidateTags(['document_item_cache']);

    return (int)$node->id();
  }


  /**
   * @param $userId
   * @param $node
   * @param $title
   * @param $intervention
   * @param $program
   * @param $programLabel
   * @param $category
   * @param $description
   * @param $externalLink
   * @return int
   * @throws Exception
   */
  public static function update($userId, $node, $title, $intervention, $program, $programLabel, $category, $description, $externalLink): int
  {
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
      throw new Exception('DC04: Error in board node update', 400);
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
