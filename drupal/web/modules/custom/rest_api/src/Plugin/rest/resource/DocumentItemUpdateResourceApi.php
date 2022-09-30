<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\Component\Utility\UrlHelper;
use Drupal\core\Controller\DocumentController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\core\Utility\TaxonomyController;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Drupal\rest_api\Controller\Utility\ValidationController;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Psr\Log\LoggerInterface;

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
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    AccountProxyInterface $current_user
  ) {
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
   * @param null $id
   * @return JsonResponse
   */
  public function post(Request $req, $id = null)
  {
    try {
      if (empty($id)) {
        throw new Exception("Missing node id");
      }

      $userId = $req->headers->get('user-id') ?? '';
      if(empty($userId)){
        throw new Exception('Missing user id in headers');
      }

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, 'document_item');

      $externalLink = $body->external_link;
      if (!UrlHelper::isValid($externalLink, true)) {
        $externalLink = 'https://' . $externalLink;
      }

      $exists = TaxonomyController::termExistsById('document_categories', $body->category);
      if (!$exists) {
        throw new Exception('Taxonomy term does not exists');
      }

      $nodeId = DocumentController::update(
        $userId,
        $id,
        $body->title,
        $body->intervention,
        $body->program,
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
