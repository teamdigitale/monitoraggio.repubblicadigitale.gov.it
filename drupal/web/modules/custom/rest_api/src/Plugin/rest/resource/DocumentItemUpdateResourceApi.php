<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\Component\Utility\UrlHelper;
use Drupal\core\Controller\DocumentController;
use Drupal\core\Controller\UserController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\core\Utility\TaxonomyController;
use Drupal\node\Entity\Node;
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
 *   id = "document_item_update",
 *   label = @Translation("Api to update a document item"),
 *   uri_paths = {
 *     "create" = "/api/document/item/{id}/update"
 *   }
 * )
 */
class DocumentItemUpdateResourceApi extends ResourceBase
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
      'intervention' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ],
      'program' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ],
      'program_label' => [
        'type' => 'string',
        'minLength' => 1,
        'required' => true
      ],
      'category' => [
        'type' => 'integer',
        'required' => true
      ],
      'external_link' => [
        'type' => 'string',
        'required' => false
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
        throw new Exception('DIURA01: Missing node id', 400);
      }

      $userId = $req->headers->get('drupal-user-id') ?? '';
      $userGroups = $req->headers->get('role-groups') ?? '';
      $route = $req->get('_route');

      $node = Node::load($id);
      if (empty($node) || $node->bundle() != 'document_item') {
        throw new Exception('DIURA05: Invalid node id', 400);
      }

      if ($node->getOwnerId() != $userId && !UserController::checkAuthGroups($userGroups, $route, 'any')) {
        throw new Exception('DIURA06: User unauthorized', 401);
      }

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, self::JSON_SCHEMA);

      $externalLink = $body->external_link;
      if (!preg_match('~^(?:f|ht)tps?://~i', $externalLink)) {
        $externalLink = 'https://' . $externalLink;
      }

      if (!UrlHelper::isValid($externalLink, true)) {
        throw new Exception('DIURA07: External link not valid', 400);
      }

      $exists = TaxonomyController::termExistsById('document_categories', $body->category);
      if (!$exists) {
        throw new Exception('DIURA04: Taxonomy term does not exists', 400);
      }

      $nodeId = DocumentController::update(
        $userId,
        $node,
        $body->title,
        $body->intervention,
        $body->program,
        $body->program_label,
        $body->category,
        $body->description,
        $externalLink
      );

      return ResponseFormatterController::success([
        'id' => $nodeId
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
