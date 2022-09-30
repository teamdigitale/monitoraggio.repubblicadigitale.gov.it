<?php

namespace Drupal\rest_api\EventSubscriber;

use Drupal\core\Controller\UserController;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use \Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Drupal\core\Utility\EnvController;

use Exception;

class RequestEventSubscriber implements EventSubscriberInterface {
  /**
   * @return array
   */
  public static function getSubscribedEvents(): array {
    $events[KernelEvents::REQUEST][] = ['onRequest', 30];
    return $events;
  }

  /**
   * @param RequestEvent $event
   */
  public function onRequest(RequestEvent $event) {
    $allowedRouteRoles = (array)EnvController::getValues('ALLOWED_ROUTE_ROLES');
    
    try{
      $req = $event->getRequest() ?? '';
      $route = null;
      if(!empty($req)){
        $route = $req->get("_route");
      }

      if (!empty($route) && array_key_exists($route, $allowedRouteRoles)) {
        if(in_array($route, EnvController::getValues('CHECK_PATH_PARAMETER_ROUTE'))){
          $path_user_name = $req->get("user_name");
          $header_user_name = $req->headers->get('user-id') ?? '';

          if($path_user_name != $header_user_name){
            $event->setResponse(ResponseFormatterController::error('User unauthorized', 403));
          }
        }

        $userName = UserController::checkAuth($req, $allowedRouteRoles[$route]);
        $userId = UserController::load($userName);
        $req->headers->set("user-id", $userId);
      }
    }
    catch (Exception $ex) {
      $event->setResponse(ResponseFormatterController::error($ex->getMessage(), $ex->getCode()));
    }
  }
}
