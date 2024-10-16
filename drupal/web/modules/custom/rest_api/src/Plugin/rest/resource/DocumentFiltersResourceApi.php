<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\core\Controller\FiltersController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "document_filters",
 *   label = @Translation("Api to manage document item dinamic filters"),
 *   uri_paths = {
 *     "canonical" = "/api/document/filters"
 *   }
 * )
 */
class DocumentFiltersResourceApi extends ResourceBase
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
   * @return JsonResponse
   */
  public function get(Request $req)
  {
    try {
      $categories = $req->get('categories') ?? '';
      $programs = $req->get('programs') ?? '';
      $interventions = $req->get('interventions') ?? '';

      $categories = $categories !== '' ? explode(',', $categories) : [];
      $programs = $programs !== '' ? explode(',', $programs) : [];
      $interventions = $interventions !== '' ? explode(',', $interventions) : [];

      $program_intervention = $req->get('program_intervention') ?? '';
      $program_intervention = $program_intervention !== '' ? explode(' ', $program_intervention) : $program_intervention;

      $data = FiltersController::checkFilters(
        'document_item',
        $categories,
        $programs,
        $interventions,
        $program_intervention
      );

      return ResponseFormatterController::success($data, 200, 'document_item_cache');
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
