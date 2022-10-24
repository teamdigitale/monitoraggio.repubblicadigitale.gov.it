<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\core\Controller\CommunityController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\core\Utility\TaxonomyController;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Drupal\rest_api\Controller\Utility\ValidationController;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "community_item_update",
 *   label = @Translation("Api to update a community item"),
 *   uri_paths = {
 *     "create" = "api/community/item/{id}/update"
 *   }
 * )
 */
class CommunityItemUpdateResourceApi extends ResourceBase
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

  private const JSON_SCHEMA = [
    'type' => 'object',
    'properties' => [
      'title' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ],
      'category' => [
        'type' => 'integer',
        'required' => true
      ],
      'description' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ],
      'tags' => [
        'type' => 'array',
        'required' => true
      ]
    ]
  ];

  /**
   * Responds to POST requests.
   *
   * @param Request $req
   * @param null $id
   * @return JsonResponse
   */
  public function post(Request $req, $id = null)
  {
    try {
      if (empty($id)) {
        throw new Exception('CIURA01: Missing node id');
      }

      $userId = $req->headers->get('user-id') ?? '';
      if (empty($userId)) {
        throw new Exception('CIURA02: Missing user id in headers');
      }

      $userRoles = $req->headers->get('user-roles') ?? '';
      if (empty($userRoles)) {
        throw new Exception('CIURA03: Missing user roles in headers');
      }

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, self::JSON_SCHEMA);

      $exists = TaxonomyController::termExistsById('community_categories', $body->category);
      if (!$exists) {
        throw new Exception('CIURA04: Taxonomy term does not exists');
      }

      $nodeId = CommunityController::update(
        $userId,
        $userRoles,
        $id,
        $body->title,
        $body->category,
        $body->description,
        $body->tags
      );

      return ResponseFormatterController::success([
        'id' => $nodeId
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
