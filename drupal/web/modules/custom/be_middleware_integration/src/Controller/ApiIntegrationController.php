<?php

namespace Drupal\be_middleware_integration\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\core\Utility\EnvController;
use Drupal\core\Utility\HttpController;

class ApiIntegrationController extends ControllerBase
{

  public static function getGroupsRolesByGroupCode($groupCode)
  {
    $returnValues = [];

    $host = EnvController::getValues('BE_HOST');
    $path = EnvController::getValues('BE_GET_ALL_GROUPS_ENDPOINT');
    $headers = [
      "authToken" => EnvController::getValues('AUTHENTICATION_TOKEN'),
      "userRole" => EnvController::getValues('BE_USER_ROLE'),
      "Content-Type" => EnvController::getValues('BE_CONTENT_TYPE'),
    ];
    $response = HttpController::get($host, $path, $headers, []);

    foreach ($response as $responseElement) {
      if ($responseElement['gruppo']['codice'] === $groupCode) {
        $returnValues = $responseElement['ruoliAssociatiAlGruppo'];
      }
    }

    return $returnValues;
  }

  public static function getAllUsers($rolesArray, &$userNames, $page)
  {
    $host = EnvController::getValues('BE_HOST');
    $path = EnvController::getValues('BE_GET_ALL_USER_ENDPOINT');

    $headers = [
      "authToken" => EnvController::getValues('AUTHENTICATION_TOKEN'),
      "userRole" => EnvController::getValues('BE_USER_ROLE'),
      "Content-Type" => EnvController::getValues('BE_CONTENT_TYPE'),
    ];

    $params = [
      "currPage" => $page
    ];

    $body = [
      "filtroRequest" => [
        "stati" => [
          "ATTIVO"
        ],
        "ruoli" => $rolesArray
      ]
    ];

    $response = HttpController::post($host, $path, $headers, $params, $body, 'application/json');
    $responseUsers = $response["utenti"];
    $responseMaxPage = $response["numeroPagine"];

    foreach ($responseUsers as $reponseUser) {
      $userNames[] = $reponseUser["id"];
    }

    if ($page < $responseMaxPage - 1) {
      self::getAllUsers($rolesArray, $userNames, $page + 1);
    }

    return true;
  }
}
