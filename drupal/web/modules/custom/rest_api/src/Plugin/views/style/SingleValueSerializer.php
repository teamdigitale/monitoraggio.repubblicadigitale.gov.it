<?php

namespace Drupal\rest_api\Plugin\views\style;

use Drupal\rest\Plugin\views\style\Serializer;
use Drupal\Component\Serialization\Json;

/**
 * The style plugin for serialized output formats.
 *
 * @ingroup views_style_plugins
 *
 * @ViewsStyle(
 *   id = "single_value_serializer",
 *   title = @Translation("Single Value Serializer"),
 *   help = @Translation("Return a single value"), display_types = {"data"}
 * )
 */
class SingleValueSerializer extends Serializer
{

  /**
   * {@inheritdoc}
   */
  public function render(): array|string {
    $rows = [];
    foreach ($this->view->result as $row_index => $row) {
      $this->view->row_index = $row_index;
      $rows[] = $this->view->rowPlugin->render($row);
    }
    unset($this->view->row_index);

    $content_type = !empty($this->options['formats']) ? reset($this->options['formats']) : 'json';

    $returnValue = Json::decode($rows[0]['value'] ?? '0');

    return $this->serializer->serialize($returnValue, $content_type, ['views_style_plugin' => $this]);
  }
}
