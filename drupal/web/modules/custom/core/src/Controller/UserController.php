<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException;
use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Utility\Random;
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
  public static function load(string $userName, $retry = 0)
  {
    try{
      $query = Drupal::database()->select('users_field_data', 'ufd');
      $query->fields('ufd', ['uid']);
      $query->condition('name', $userName);
      $userId = $query->execute()->fetchAll();
      $userId = reset($userId)->uid;

      if(empty($userId)) {
        $user = User::create();
        $user->enforceIsNew();
        $user->setPassword((new Random())->string(20, true));
        $user->setUsername($userName);
        $user->addRole('api_no_access');
        $user->activate();

        if (!$user->save()) {
          throw new Exception('UC01: Error in user creation');
        }
        $userId = $user->id();
      }

      return $userId;
    }catch(Exception $ex){
      if(get_class($ex) !== 'Drupal\Core\Entity\EntityStorageException' || $retry > 2){
        throw new Exception($ex->getMessage());
      }

      return self::load($userName, $retry+1);
    }
  }

  /**
   * @param Request $req
   * @param array $allowedRoles
   * @return array|string
   * @throws Exception
   */
  public static function checkAuth(Request $req, array $allowedRoles): array|string
  {
    $userRoles = $req->headers->get('user-roles') ?? [];
    if (empty($userRoles)) {
      throw new Exception('UC02: Missing user roles in headers');
    }

    $userName = $req->headers->get('user-id') ?? '';
    if (empty($userName)) {
      throw new Exception('UC03: Missing user id in headers');
    }

    if (!self::checkAuthRoles($userRoles, $allowedRoles)) {
      throw new Exception('UC04: User unauthorized');
    }

    return $userName;
  }


  /**
   * @param string $userRoles
   * @param array $allowedRoles
   * @return bool
   */
  /**
   * @param string $userRoles
   * @param array $allowedRoles
   * @return bool
   */
  public static function checkAuthRoles(string $userRoles, array $allowedRoles): bool
  {

    if (empty($userRoles)) {
      return false;
    }
    $userRoles = explode(';', $userRoles);

    return !empty(array_intersect($allowedRoles, $userRoles));
  }

}
