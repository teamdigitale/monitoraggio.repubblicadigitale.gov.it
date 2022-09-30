<?php

namespace Drupal\core\Utility;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\taxonomy\Entity\Term;
use Exception;

/**
 * Class TaxonomyController
 * @package Drupal\core\Utility
 */
class TaxonomyController{

  /**
   * @param $vid
   * @param $termName
   * @return mixed
   * @throws EntityStorageException
   */
  public static function createOrGetTermTid($vid, $termName)
  {
    $termId = self::termIdByName($vid, $termName);
    if (!empty($termId)) {
      return $termId;
    }

    $termObj = Term::create(['vid' => $vid, 'name' => $termName]);
    $termObj->save();

    return (int) $termObj->id();
  }

  /**
   * @param $term
   * @param $termName
   * @return int
   * @throws Exception
   */
  public static function updateTerm($term, $termName): int
  {
    if (empty($term)) {
      throw new Exception('Empty term passed');
    }

    $term->setName($termName);

    if (!$term->save()) {
      throw new Exception('Error in term update');
    }

    return (int) $term->id();
  }

  /**
   * @param $term
   * @return int
   * @throws EntityStorageException
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws Exception
   */
  public static function deleteTerm($term): int
  {
    if (empty($term)) {
      throw new Exception('Empty term passed');
    }

    $vid = $term->bundle();

    $nodes = \Drupal::entityTypeManager()
      ->getStorage('node')
      ->loadByProperties([
        'field_category' => $term->id()
      ]);

    $term->delete();
    $alternativeTermId = self::createOrGetTermTid($vid, EnvController::getValues('ALTERNATIVE_CATEGORY'));

    foreach ($nodes as $node) {
      $node->set('field_category', $alternativeTermId);
      if (!$node->save()) {
        throw new Exception('Error in node update in category delete');
      }
    }

    return (int) $alternativeTermId;
  }

  /**
   * @param $tid
   * @param $vid
   * @return bool
   */
  public static function termExistsById($vid, $tid): bool
  {
    $term = Term::load($tid);

    if (empty($term) || ($term->bundle() != $vid)) {
      return false;
    }

    return true;
  }

  /**
   * @param $vid
   * @param $termName
   * @return null
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   */
  public static function termIdByName($vid, $termName)
  {
    $termObj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(
      [
        'name' => $termName,
        'vid' => $vid
      ]
    );

    if (empty($termObj)) {
      return null;
    }

    return reset($termObj)->tid->value;
  }
}
