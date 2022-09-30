<?php

namespace Drupal\core\Controller;

use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Utility\Random;
use Drupal\user\Entity\User;
use Exception;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for user handling
 */
class UserController {

  /**
   * @throws InvalidPluginDefinitionException
   * @throws PluginNotFoundException
   * @throws Exception
   */
  public static function load(string $userName)
  {
    $user = \Drupal::entityTypeManager()
      ->getStorage('user')
      ->loadByProperties([
        'name' => $userName,
      ]);

    $user = array_shift($user);

    if (empty($user)) {
      $user = User::create();
      $user->enforceIsNew();
      $user->setPassword((new Random())->string(20, true));
      $user->setUsername($userName);
      $user->addRole('api_no_access');
      $user->activate();

      if (!$user->save()) {
        throw new \Exception('Error in user creation');
      }
    }

    return $user->id();
  }

  /**
   * @param Request $req
   * @param array $allowedRoles
   * @return array|string
   * @throws Exception
   */
  public static function checkAuth(Request $req, array $allowedRoles) {
    $userRoles = $req->headers->get('user-roles') ?? [];
    if (empty($userRoles)) {
      throw new Exception('Missing user roles in headers');
    }

    $userName = $req->headers->get('user-id') ?? '';
    if (empty($userName)) {
      throw new Exception('Missing user id in headers');
    }

    if (!self::checkAuthRoles($userRoles, $allowedRoles)) {
      throw new Exception('User unauthorized', 403);
    }

    return $userName;
  }


  public static function checkAuthRoles(string $userRoles, array $allowedRoles) {

    if (empty($userRoles)) {
      return false;
    }
    $userRoles = explode(';', $userRoles);

    return !empty(array_intersect($allowedRoles, $userRoles));
  }

}
