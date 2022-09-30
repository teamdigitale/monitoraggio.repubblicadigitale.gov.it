<?php

namespace Drupal\core\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\core\Utility\TaxonomyController;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\notifications\Controller\NotificationsController;

/**
 * Class DocumentController
 * @package Drupal\core\Controller
 */
class DocumentController {

  /**
   * @param $userId
   * @param $title
   * @param $intervention
   * @param $program
   * @param $category
   * @param $description
   * @param $externalLink
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function create($userId, $title, $intervention, $program, $category, $description, $externalLink): int {
    $node = Node::create([
      'uid' => $userId,
      'type' => 'document_item',
      'title' => $title,
      'field_intervention' => $intervention,
      'field_program' => TaxonomyController::createOrGetTermTid('document_programs', $program),
      'field_category' =>  $category,
      'field_description' => $description,
      'field_external_link' => $externalLink
    ]);
    $node->setPublished();

    if (!$node->save()) {
      throw new Exception('Error in document node creation');
    }

    return (int) $node->id();
  }

  /**
   * @param $node
   * @param $userId
   * @param $title
   * @param $intervention
   * @param $program
   * @param $category
   * @param $description
   * @param $externalLink
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function update($userId, $id, $title, $intervention, $program, $category, $description, $externalLink): int {
    $node = Node::load($id);
    if (empty($node) || $node->bundle() != 'document_item') {
      throw new Exception("Invalid node id");
    }

    $node->set('title', $title);
    $node->set('field_intervention', $intervention);
    $node->set('field_program',  TaxonomyController::createOrGetTermTid('document_programs', $program));
    $node->set('field_category', $category);
    $node->set('field_description', $description);
    $node->set('field_external_link', $externalLink);

    $node->setNewRevision(TRUE);
    $node->setRevisionCreationTime(\Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);

    if (!$node->save()) {
      throw new Exception('Error in board node update');
    }

    if($node->getOwnerId() != $userId){
      NotificationsController::sendNotification(
        $node, 
        $userId, 
        $node->getOwnerId(), 
        'document_update'
      );
    }
    
    return (int) $node->id();
  }
}
