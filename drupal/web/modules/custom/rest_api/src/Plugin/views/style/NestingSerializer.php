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
   * {@inheritdoc}
   */
  public function render(): array|string
  {
    $rows = [];
    foreach ($this->view->result as $row_index => $row) {
      $this->view->row_index = $row_index;
      $rows[] = $this->view->rowPlugin->render($row);
    }
    unset($this->view->row_index);
    $content_type = !empty($this->options['formats']) ? reset($this->options['formats']) : 'json';

    for ($i = 0; $i < count($rows); $i++) {
      foreach ($rows[$i] as $key => $value) {
        if ($value == '[]') {
          $rows[$i][$key] = [];
        }

        if ($value == '0') {
          $rows[$i][$key] = 0;
        }

        if (!empty($rows[$i][$key]) && Json::decode($rows[$i][$key])) {
          $rows[$i][$key] = Json::decode($rows[$i][$key]);
        }
      }
    }

    return $this->serializer->serialize($rows, $content_type, ['views_style_plugin' => $this]);
  }
}
