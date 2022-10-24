<?php

namespace Drupal\core\Utility;

use Drupal;
use Exception;

/**
 *
 */
class HttpController
{
  /**
   * @param string $apiBaseUrl
   * @param string $apiPath
   * @param array $headers
   * @param array $params
   * @return mixed
   */
  public static function get(string $apiBaseUrl, string $apiPath, array $headers, array $params): mixed
  {
    $options = [
      'verify' => false
    ];

    if (!empty($headers)) {
      $options['headers'] = $headers;
    }

    if (!empty($params)) {
      $options['params'] = $params;
    }

    $response = (Drupal::httpClient())->get($apiBaseUrl . $apiPath, $options)->getBody();

    if (empty($response)) {
      return [];
    }

    return json_decode($response, true);
  }

  /**
   * @param string $apiBaseUrl
   * @param string $apiPath
   * @param array $headers
   * @param array $params
   * @param $body
   * @param string $bodyType : use form_params when content type is application/x-www-form-urlencoded. Use body when content is application/json (body must be json_encoded)
   * @return mixed
   * @throws Exception
   */
  public static function post(string $apiBaseUrl, string $apiPath, array $headers, array $params, $body, string $bodyType): mixed
  {
    if (!in_array($bodyType, EnvController::getValues('ALLOWED_BODY_TYPES'))) {
      throw new Exception('HC01: Wrong body type passed');
    }

    switch ($bodyType) {
      case 'application/json':
        $bodyKey = 'body';
        $body = json_encode($body);
        break;
      case 'application/x-www-form-urlencoded':
        $bodyKey = 'form_params';
        break;
      default:
        $bodyKey = 'form_params';
    }

    $response = (Drupal::httpClient())->post($apiBaseUrl . $apiPath, [
      'verify' => false,
      'query' => $params,
      $bodyKey => $body,
      'headers' => $headers
    ])->getBody();

    if (empty($response)) {
      return [];
    }

    return json_decode($response, true);
  }
}
