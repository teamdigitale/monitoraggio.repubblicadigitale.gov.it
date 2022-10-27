<?php

namespace Drupal\rest_api\EventSubscriber;

use Drupal\core\Controller\UserController;
use Drupal\core\Utility\EnvController;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Exception;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 *
 */
class RequestEventSubscriber implements EventSubscriberInterface
{
  /**
   * @return array
   */
  public static function getSubscribedEvents(): array
  {
    $events[KernelEvents::REQUEST][] = ['onRequest', 30];
    return $events;
  }

  /**
   * @param RequestEvent $event
   */
  public function onRequest(RequestEvent $event)
  {
    try {
      $req = $event->getRequest() ?? '';
      $route = $req->get('_route');
      if (!str_starts_with($req->getRequestUri(), '/api')) {
        return;
      }

      UserController::checkAuth($req, $route);

      if (in_array($route, (array)EnvController::getValues('CHECK_PATH_PARAMETER_ROUTE'))) {
        UserController::checkRouteParams($req);
      }

      $drupalUserId = UserController::getOrCreate($req->headers->get('user-id'));
      $req->headers->set('drupal-user-id', $drupalUserId);

    } catch (Exception $ex) {
      $event->setResponse(ResponseFormatterController::error($ex->getMessage(), $ex->getCode()));
    }
  }
}
