<?php

namespace Drupal\stats_tracking\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Drupal\stats_tracking\Controller\ActionTracker;
use Drupal\stats_tracking\Controller\Utility\ValidationController;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "action_tracking",
 *   label = @Translation("Api to track activity"),
 *   uri_paths = {
 *     "create" = "/api/user/action/{type}/track"
 *   }
 * )
 */
class TrackingResourceApi extends ResourceBase
{
  /**
   * A current user instance.
   *
   * @var AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Constructs a Drupal\rest\Plugin\ResourceBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param LoggerInterface $logger
   *   A logger instance.
   * @param AccountProxyInterface $current_user
   *   A current user instance.
   */
  public function __construct(
    array                 $configuration,
                          $plugin_id,
                          $plugin_definition,
    array                 $serializer_formats,
    LoggerInterface       $logger,
    AccountProxyInterface $current_user
  )
  {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition)
  {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('example_rest'),
      $container->get('current_user')
    );
  }

  /**
   * Responds to POST requests.
   *
   * @param Request $req
   * @param null $type
   * @return JsonResponse
   */
  public function post(Request $req, $type = null)
  {
    try {
      $userId = $req->headers->get('drupal-user-id') ?? '';
      $userRoles = $req->headers->get('user-roles') ?? '';

      $body = json_decode($req->getContent());

      switch (strtolower($type ?? '')) {
        case 'chat':
          ValidationController::validateRequestBody($body, 'chat');

          if (!in_array($body->role_code, explode(';', $userRoles))) {
            throw new Exception('TRA03: Invalid user role in body', 400);
          }

          $trackId = ActionTracker::trackChat(
            $userId,
            $body->role_code,
            $body->event,
            $body->program_id
          );
          break;
        case 'wd':
          ValidationController::validateRequestBody($body, 'wd');

          if (!in_array($body->role_code, explode(';', $userRoles))) {
            throw new Exception('TRA04: Invalid user role in body', 400);
          }

          $trackId = ActionTracker::trackWD(
            $userId,
            $body->role_code,
            $body->event,
            $body->program_id
          );
          break;
        case 'tnd':
          ValidationController::validateRequestBody($body, 'tnd');

          if (!in_array($body->role_code, explode(';', $userRoles))) {
            throw new Exception('TRA05: Invalid user role in body', 400);
          }

          $trackId = ActionTracker::trackTND(
            $userId,
            $body->role_code,
            $body->event_type,
            $body->event,
            !empty($body->event_value) ? strtoupper($body->event_value ?? '') : null,
            $body->category,
            $body->program_id
          );
          break;
        default:
          throw new Exception('TRA06: Invalid tracking type', 400);
      }

      return ResponseFormatterController::success([
        'id' => (int)$trackId
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
