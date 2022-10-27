<?php

namespace Drupal\rest_api\Controller\Utility;

use Drupal\Core\Controller\ControllerBase;
use Exception;
use JsonSchema\Validator;

/**
 * Controller for request validation
 */
class ValidationController extends ControllerBase
{

  /**
   * @param $body
   * @return bool
   * @throws Exception
   */
  public static function validateRequestBody($body, $jsonSchema): bool
  {
    if (empty($jsonSchema)) {
      throw new Exception('VC01: JSON SCHEMA is empty in body validation', 400);
    }

    $validator = new Validator();

    $validator->validate($body, $jsonSchema);

    if (!$validator->isValid()) {
      throw new Exception('VC02: Invalid JSON body: ' . json_encode(array_map(function ($value) {
          return $value['message'];
        }, $validator->getErrors())), 400);
    }

    return $validator->isValid();
  }
}
