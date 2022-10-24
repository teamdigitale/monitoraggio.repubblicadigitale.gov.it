<?php

namespace Drupal\rest_api\Controller\Utility;

use Drupal\Core\Controller\ControllerBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller routines for api routes.
 */
class ResponseFormatterController extends ControllerBase
{

  /**
   * Success response
   * @param array $data
   * @param int $code
   * @param string $cacheTag
   * @return JsonResponse|ResourceResponse
   */
  public static function success(array $data, int $code = 200, $cacheTag = ''): JsonResponse|ResourceResponse
  {
    $returnValue = [
      'code' => $code,
      'result' => true,
      'timestamp' => time(),
      'data' => $data
    ];

    if (!empty($cacheTag)) {
      $response = new ResourceResponse($returnValue, $code);
      $response->addCacheableDependency(new ResponseCacheableDependency([$cacheTag]));
      return $response;
    }
    return new JsonResponse($returnValue, $code);
  }

  /**
   * Success response
   * @param string $message
   * @param int $code
   * @return JsonResponse
   */
  public static function error(string $message, int $code = 400): JsonResponse
  {
    $code = $code < 400 || $code > 599 ? 500 : $code;

    $returnValue = [
      'code' => $code,
      'result' => false,
      'timestamp' => time(),
      'data' => [
        'message' => $message
      ]
    ];

    return new JsonResponse($returnValue, $code);
  }
}
