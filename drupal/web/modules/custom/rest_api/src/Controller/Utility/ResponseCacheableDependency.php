<?php

namespace Drupal\rest_api\Controller\Utility;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheableDependencyInterface;

/**
 *
 */
class ResponseCacheableDependency implements CacheableDependencyInterface
{
  protected $tags = [];

  /**
   * @param $tags
   */
  public function __construct($tags)
  {
    $this->tags = $tags;
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts()
  {
    return ['url.query_args'];
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheTags()
  {
    return $this->tags;
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheMaxAge()
  {
    return Cache::PERMANENT;
  }
}
