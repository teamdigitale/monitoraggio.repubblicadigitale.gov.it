<?php

/**
 * @file
 * Contains \Drupal\rest_api\Controller\FileUploadApiController.
 */

namespace Drupal\rest_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\core\Controller\FileController;
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
        throw new Exception('FURA01: Missing node id');
      }

      $userId = $req->headers->get('user-id') ?? '';
      if (empty($userId)) {
        throw new Exception('FURA02: Missing user id in headers');
      }

      $userRoles = $req->headers->get('user-roles') ?? '';
      if (empty($userRoles)) {
        throw new Exception('FURA03: Missing user roles in headers');
      }

      $type = $req->get('type') ?? '';
      if (empty($type)) {
        throw new Exception('FURA04: Missing file type in headers');
      }

      $tmpName = $_FILES['data']['tmp_name'] ?? '';
      $name = $_FILES['data']['name'] ?? '';

      FileController::setMedia(
        $userId,
        $userRoles,
        $id,
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
