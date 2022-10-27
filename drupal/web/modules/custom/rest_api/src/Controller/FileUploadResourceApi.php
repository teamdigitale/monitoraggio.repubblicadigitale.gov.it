<?php

/**
 * @file
 * Contains \Drupal\rest_api\Controller\FileUploadApiController.
 */

namespace Drupal\rest_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\core\Controller\FileController;
use Drupal\core\Controller\UserController;
use Drupal\node\Entity\Node;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 *
 */
class FileUploadResourceApi extends ControllerBase
{
  /**
   * @param Request $req
   * @param int $id
   * @return JsonResponse
   */
  public static function fileUpload(Request $req, int $id): JsonResponse
  {
    try {
      if (empty($id)) {
        throw new Exception('FURA01: Missing node id', 400);
      }

      $userId = $req->headers->get('drupal-user-id') ?? '';
      $userGroups = $req->headers->get('role-groups') ?? '';
      $route = $req->get('_route');

      $node = Node::load($id);
      if (empty($node)) {
        throw new Exception('FURA05: Invalid node id', 400);
      }

      if (!UserController::checkAuthGroups($userGroups, $route, $node->bundle())) {
        throw new Exception('FURA07: User unauthorized', 401);
      }

      if ($node->getOwnerId() != $userId && !UserController::checkAuthGroups($userGroups, $route, 'any')) {
        throw new Exception('FURA08: User unauthorized', 401);
      }

      $data = $_FILES['data'] ?? '';
      $type = $req->get('type') ?? '';

      if (empty($data) && empty($type)) {
        $body = json_decode($req->getContent());
        $type = $body->type ?? '';
      }

      if (empty($type)) {
        throw new Exception('FURA04: Missing file type in body', 400);
      }

      $tmpName = $_FILES['data']['tmp_name'] ?? '';
      $name = $_FILES['data']['name'] ?? '';

      if ($node->bundle() !== 'board_item' && $type === 'cover') {
        throw new Exception('FURA06: Invalid media type for item', 400);
      }

      FileController::setMedia(
        $userId,
        $node,
        $type,
        $tmpName,
        $name
      );

      return ResponseFormatterController::success([
        'item_id' => $id
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
