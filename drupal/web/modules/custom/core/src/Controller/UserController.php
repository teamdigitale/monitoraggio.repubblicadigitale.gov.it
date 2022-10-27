<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Utility\Random;
use Drupal\core\Utility\EnvController;
use Drupal\user\Entity\User;
use Exception;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for user handling
 */
class UserController
{

  /**
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws Exception
   */
  public static function getOrCreate(string $userName, $retry = 0)
  {
    try {
      $query = Drupal::database()->select('users_field_data', 'ufd');
      $query->fields('ufd', ['uid']);
      $query->condition('name', $userName);
      $users = $query->execute()->fetchAll();
      $user = reset($users);
      $userId = '';
      if (!empty($user)) {
        $userId = $user->uid ?? '';
      }

      if (empty($userId)) {
        $user = User::create();
        $user->enforceIsNew();
        $user->setPassword((new Random())->string(20, true));
        $user->setUsername($userName);
        $user->addRole('api_no_access');
        $user->activate();

        if (!$user->save()) {
          throw new Exception('UC01: Error in user creation', 400);
        }
        $userId = $user->id();
      }

      return $userId;
    } catch (Exception $ex) {
      if (get_class($ex) !== 'Drupal\Core\Entity\EntityStorageException' || $retry > 10) {
        throw new Exception($ex->getMessage());
      }

      return self::getOrCreate($userName, $retry + 1);
    }
  }


  /**
   * @param Request $req
   * @param string $route
   * @return array|string
   * @throws Exception
   */
  public static function checkAuth(Request $req, string $route): array|string
  {
    $userRoles = $req->headers->get('user-roles') ?? [];
    if (empty($userRoles)) {
      throw new Exception('UC02: Missing user roles in headers', 400);
    }

    $userGroups = $req->headers->get('role-groups') ?? [];
    if (empty($userGroups)) {
      throw new Exception('UC05: Missing user groups in headers', 400);
    }

    $beUserId = $req->headers->get('user-id') ?? '';
    if (empty($beUserId)) {
      throw new Exception('UC03: Missing user id in headers', 400);
    }

    if (!self::checkAuthGroups($userGroups, $route)) {
      throw new Exception('UC04: User unauthorized', 401);
    }

    return true;
  }


  /**
   * @param string $userGroups
   * @param $route
   * @param $type
   * @return bool
   * @throws Exception
   */
  public static function checkAuthGroups(string $userGroups, $route, $type = null): bool
  {
    $allowedRouteGroups = (array)EnvController::getValues('ALLOWED_ROUTE_GROUPS');

    if (!array_key_exists($route, $allowedRouteGroups)) {
      throw new Exception('RES02: Invalid route', 400);
    }

    $allowedGroups = (array)$allowedRouteGroups[$route];

    if (!empty($type)) {
      $allowedGroups = $allowedGroups[$type] ?? [];

    }

    if (array_key_exists('board_item', $allowedGroups)) {
      $allowedGroups = array_merge($allowedGroups, $allowedGroups['board_item']);
      unset($allowedGroups['board_item']);
    }

    if (array_key_exists('community_item', $allowedGroups)) {
      $allowedGroups = array_merge($allowedGroups, $allowedGroups['community_item']);
      unset($allowedGroups['community_item']);
    }

    if (array_key_exists('document_item', $allowedGroups)) {
      $allowedGroups = array_merge($allowedGroups, $allowedGroups['document_item']);
      unset($allowedGroups['document_item']);
    }

    if (array_key_exists('own', $allowedGroups)) {
      $allowedGroups = array_merge($allowedGroups, $allowedGroups['own']);
      unset($allowedGroups['own']);
    }

    if (array_key_exists('any', $allowedGroups)) {
      $allowedGroups = array_merge($allowedGroups, $allowedGroups['any']);
      unset($allowedGroups['any']);
    }

    if (empty($userGroups)) {
      return false;
    }
    $userGroups = explode(';', strtoupper($userGroups ?? ''));

    return !empty(array_intersect($allowedGroups, $userGroups));
  }

  /**
   * @param $req
   * @return void
   * @throws Exception
   */
  public static function checkRouteParams($req)
  {
    $path_user_name = $req->get('user_name');
    $header_user_name = $req->headers->get('user-id') ?? '';

    if ($path_user_name != $header_user_name) {
      throw new Exception('UC06: User id in path param is different from the user id in headers', 400);
    }
  }

}
