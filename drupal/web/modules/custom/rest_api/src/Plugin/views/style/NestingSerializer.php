<?php

namespace Drupal\rest_api\Plugin\views\style;

use Drupal\Component\Serialization\Json;
use Drupal\rest\Plugin\views\style\Serializer;

/**
 * The style plugin for serialized output formats.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "nesting_serializer",
 *   title = @Translation("Nesting Serializer"),
 *   help = @Translation("Serializes views row data and pager using the
 *   Serializer component."), display_types = {"data"}
 * )
 */
class NestingSerializer extends Serializer
{
  /**
   * @param $row
   * @return array
   */
  public function rowNormalize($row)
  {
    $items = [];

    foreach ($row as $key => $value) {
      if (!empty($value) && Json::decode($value)) {
        $items[$key] = json_decode($value, true);
      } elseif ($value === '[]') {
        $items[$key] = [];
      } elseif ((string)$value === '0') {
        $items[$key] = 0;
      } else {
        $items[$key] = html_entity_decode($value);
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

    return $this->serializer->serialize($rows, $content_type, ['views_style_plugin' => $this]);
  }
}
