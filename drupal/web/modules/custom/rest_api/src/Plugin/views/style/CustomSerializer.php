<?php

namespace Drupal\rest_api\Plugin\views\style;

use Drupal\rest\Plugin\views\style\Serializer;

/**
 * The style plugin for serialized output formats.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "custom_serializer",
 *   title = @Translation("Custom Json Serializer"),
 *   help = @Translation("Serializes views row data and pager using the
 *   Serializer component."), display_types = {"data"}
 * )
 */
class CustomSerializer extends Serializer
{
  /**
   * @param $row
   * @return array
   */
  public function rowNormalize($row)
  {
    $items = [];
    foreach ($row as $key => $value) {
      $value = (string)$value;
      if ($value === '[]') {
        $items[$key] = [];
      } elseif ($value === '0') {
        $items[$key] = 0;
      } elseif (!empty($value) && json_decode($value, true)) {
        $items[$key] = json_decode($value, true);
      } else {
        $items[$key] = html_entity_decode($value);
      }

      if (in_array($key,
        ['title',
          'body',
          'name',
          'description',
          'type',
          'intervention',
          'program_label',
          'category_label'])) {
        $items[$key] = (string)$items[$key];
      }
    }

    return $items;
  }

  /**
   * {@inheritdoc}
   */
  public function render(): array|string
  {
    $rows = [];
    foreach ($this->view->result as $row_index => $row) {
      $this->view->row_index = $row_index;
      $rows[] = $this->rowNormalize($this->view->rowPlugin->render($row));
    }

    unset($this->view->row_index);
    $content_type = !empty($this->options['formats']) ? reset($this->options['formats']) : 'json';

    $pager = $this->view->pager;
    if (!empty($pager) && $pager->getPluginId() === 'full') {
      $responseObj['pager'] = [
        'current_page' => (int)json_decode($pager->getCurrentPage()),
        'total_items' => (int)json_decode($pager->getTotalItems()),
        'total_pages' => (int)json_decode($pager->getPagerTotal()),
        'items_per_page' => (int)json_decode($pager->getItemsPerPage())
      ];
    }

    $returnValue['code'] = 200;
    $returnValue['result'] = true;
    $returnValue['timestamp'] = time();
    $returnValue['data'] = [];

    if (!empty($rows)) {
      $responseObj['items'] = $rows;
      $returnValue['data'] = $responseObj;
    }

    return $this->serializer->serialize($returnValue, $content_type, ['views_style_plugin' => $this]);
  }
}
