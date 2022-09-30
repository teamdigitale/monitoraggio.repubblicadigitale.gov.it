<?php

namespace Drupal\rest_api\Plugin\rest\resource;

use Drupal\banned_words\Controller\BannedWordsController;
use Drupal\core\Controller\CommentController;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\comment\Entity\Comment;
use Drupal\node\Entity\Node;
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
 *   id = "reply_create",
 *   label = @Translation("Api to create a reply to a comment"),
 *   uri_paths = {
 *     "create" = "/api/comment/{id}/reply"
 *   }
 * )
 */

class CommentReplyResourceApi extends ResourceBase
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
      $userId = $req->headers->get('user-id') ?? '';
      if(empty($userId)){
        throw new Exception('Missing user id in headers');
      }

      if (empty($id)) {
        throw new Exception("Missing node id");
      }

      $comment = Comment::load($id);
      if (empty($comment) || !empty($comment->getParentComment())) {
        throw new Exception("Invalid comment id");
      }

      $body = json_decode($req->getContent());
      ValidationController::validateRequestBody($body, 'comment_create');

      $nodeId = $comment->getCommentedEntityId();
      $node = Node::load($nodeId);
      if (empty($node)) {
        throw new Exception('Invalid node id');
      }

      if(!$node->get('field_enable_comments')->value){
        throw new Exception('Comments are not enabled for this node');
      }

      if (!BannedWordsController::validateText( $body->comment_body)){
        throw new Exception('Comment body contains banned words');
      }

      $commentId = CommentController::replyCreate(
        $nodeId, 
        $id, 
        $userId, 
        $body->comment_body
      );

      return ResponseFormatterController::success([
        'id' => $commentId
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
