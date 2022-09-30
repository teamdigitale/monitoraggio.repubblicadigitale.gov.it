<?php

namespace Drupal\core\Controller;

use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\TaxonomyController;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Class BoardController
 * @package Drupal\core\Controller
 */
class BoardController
{

  /**
   * @param $userId
   * @param $title
   * @param $intervention
   * @param $program
   * @param $category
   * @param $description
   * @param $enableComments
   * @param $highlighted
   * @return mixed
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function create($userId, $title, $intervention, $program, $category, $description, $enableComments, $highlighted): mixed {
    $node = Node::create([
      'uid' => $userId,
      'type' => 'board_item',
      'title' => $title,
      'field_intervention' => $intervention,
      'field_program' => TaxonomyController::createOrGetTermTid('board_programs', $program),
      'field_category' => $category,
      'field_description' => $description,
      'field_enable_comments' => $enableComments
    ]);
    $node->setSticky($highlighted);
    $node->setPublished();

    if (!$node->save()) {
      throw new Exception('Error in board node creation');
    }

    return (int) $node->id();
  }

  /**
   * @param $id
   * @param $title
   * @param $intervention
   * @param $program
   * @param $category
   * @param $description
   * @param $enableComments
   * @param $highlighted
   * @return int
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function update($userId, $id, $title, $intervention, $program, $category, $description, $enableComments, $highlighted): int {
    $node = Node::load($id);
    if (empty($node) || $node->bundle() != 'board_item') {
      throw new Exception("Empty node or wrong node passed");
    }

    $node->set('title', $title);
    $node->set('field_intervention', $intervention);
    $node->set('field_program', TaxonomyController::createOrGetTermTid('board_programs', $program));
    $node->set('field_category', $category);
    $node->set('field_description', $description);
    $node->set('field_enable_comments', $enableComments);
    $node->setSticky($highlighted);

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
        'board_update'
      );
    }

    return (int) $node->id();
  }
}
