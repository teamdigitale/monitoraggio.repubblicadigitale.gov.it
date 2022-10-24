<?php

namespace Drupal\core\Controller;

use Drupal;

/**
 * Class BoardController
 * @package Drupal\core\Controller
 */
class FiltersController
{
  /**
   * @param $bundle
   * @param $categories
   * @param $programs
   * @param $interventions
   * @return array
   */
  public static function checkFilters($bundle, $categories, $programs = null, $interventions = null)
  {
    $possibleCategories = [];
    $possiblePrograms = [];
    $possibleInterventions = [];

    $query = Drupal::database()->select('node', 'n');
    $query->fields('n', ['nid']);

    $query->fields('ttfd', ['tid', 'name']);

    if ($bundle === 'board_item' || $bundle === 'document_item') {
      $query->fields('nfp', ['field_program_value']);
      $query->fields('nfpl', ['field_program_label_value']);
      $query->fields('nfi', ['field_intervention_value']);

      $query->join('node__field_program', 'nfp', 'n.nid = nfp.entity_id ');
      $query->join('node__field_program_label', 'nfpl', 'n.nid = nfpl.entity_id ');
      $query->join('node__field_intervention', 'nfi', 'n.nid = nfi.entity_id ');
    }

    $query->join('taxonomy_index', 'ti', 'n.nid = ti.nid ');
    $query->join('taxonomy_term_field_data', 'ttfd', 'ti.tid = ttfd.tid ');

    $query->join(' node_field_data', 'nfd', 'n.nid = nfd.nid');

    $query->condition('ttfd.vid', ['board_categories', 'community_categories', 'document_categories'], 'IN');

    $query->condition('n.type', $bundle);

    if (!empty($categories)) {
      $query->condition('ttfd.tid', $categories, 'IN');
    }

    if (!empty($programs)) {
      $query->condition('nfp.field_program_value', $programs, 'IN');
    }

    if (!empty($interventions)) {
      $query->condition('nfi.field_intervention_value', $interventions, 'IN');
    }

    $query->orderBy('nfd.changed');

    $data = $query->execute()->fetchAll();


    foreach ($data as $item) {
      $possibleCategories[$item->tid] = $item->name;
      if ($bundle === 'board_item' || $bundle === 'document_item') {
        $possiblePrograms[$item->field_program_value] = $item->field_program_label_value;
        $possibleInterventions[$item->field_intervention_value] = $item->field_intervention_value;
      }
    }

    $returnData = [];
    $returnData['categories'] = $possibleCategories;
    if ($bundle === 'board_item' || $bundle === 'document_item') {
      $returnData['programs'] = $possiblePrograms;
      $returnData['interventions'] = $possibleInterventions;
    }

    return $returnData;
  }
}
