<?php

namespace Drupal\rest_api\Controller\Utility;

use Drupal\Core\Controller\ControllerBase;
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
   * @param string $result
   * @return JsonResponse
   */
  public static function success(array $data, int $code = 200)
  {
    $returnValue = [
      'code' => $code,
      'result' => true,
      'data' => $data
    ];

    return new JsonResponse($returnValue, $code);
  }

  /**
   * Success response
   * @param string $message
   * @param int $code
   * @param string $codeError
   * @return JsonResponse
   */
  public static function error(string $message, int $code = 500)
  {
    $code = $code < 400 || $code > 599 ? 500 : $code;

    $returnValue = [
      'code' => $code,
      'result' => false,
      'data' => [
        'message' => $message
      ]
    ];

    return new JsonResponse($returnValue, $code);
  }
}
