<?php

namespace Drupal\be_middleware_integration\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\core\Utility\EnvController;
use Drupal\core\Utility\HttpController;
use Exception;

/**
 *
 */
class ApiIntegrationController extends ControllerBase
{

  /**
   * @param $token
   * @param $groupCode
   * @return array|mixed
   */
  public static function getGroupsRolesByGroupCode($token, $groupCode): mixed
  {
    $returnValues = [];

    $host = EnvController::getValues('BE_HOST');
    $path = EnvController::getValues('BE_GET_ALL_GROUPS_ENDPOINT');
    $headers = [
      'authToken' => $token,
      'userRole' => EnvController::getValues('BE_USER_ROLE'),
      'Content-Type' => EnvController::getValues('BE_CONTENT_TYPE'),
    ];
    $response = HttpController::get($host, $path, $headers, []);

    foreach ($response as $responseElement) {
      if ($responseElement['gruppo']['codice'] === $groupCode) {
        $returnValues = $responseElement['ruoliAssociatiAlGruppo'];
      }
    }

    return $returnValues;
  }

  /**
   * @param $token
   * @param $rolesArray
   * @param $userNames
   * @param $page
   * @return bool
   * @throws Exception
   */
  public static function getAllUsers($token, $rolesArray, &$userNames, $page): bool
  {
    $host = EnvController::getValues('BE_HOST');
    $path = EnvController::getValues('BE_GET_ALL_USER_ENDPOINT');

    $headers = [
      'authToken' => $token,
      'userRole' => EnvController::getValues('BE_USER_ROLE'),
      'Content-Type' => EnvController::getValues('BE_CONTENT_TYPE'),
    ];

    $params = [
      'currPage' => $page
    ];

    $body = [
      'filtroRequest' => [
        'stati' => [
          'ATTIVO'
        ],
        'ruoli' => $rolesArray
      ]
    ];

    $response = HttpController::post($host, $path, $headers, $params, $body, 'application/json');
    $responseUsers = $response['utenti'];
    $responseMaxPage = $response['numeroPagine'];

    foreach ($responseUsers as $reponseUser) {
      $userNames[] = $reponseUser['id'];
    }

    if ($page < $responseMaxPage - 1) {
      self::getAllUsers($token, $rolesArray, $userNames, $page + 1);
    }

    return true;
  }
}
