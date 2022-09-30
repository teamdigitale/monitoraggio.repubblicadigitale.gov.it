<?php

/**
 * @file
 * Contains \Drupal\rest_api\Controller\FileUploadApiController.
 */

namespace Drupal\rest_api\Controller;

use Exception;
use Drupal\node\Entity\Node;
use Drupal\Core\Controller\ControllerBase;
use Drupal\core\Controller\FileController;
use Drupal\core\Controller\UserController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\notifications\Controller\NotificationsController;
use Drupal\rest_api\Controller\Utility\ResponseFormatterController;

class FileUploadResourceApi extends ControllerBase {

  private const FILE_TYPES = [
    'cover' => [
      'bundle' => 'image',
      'field' => 'field_cover'
    ],
    'attachment' => [
      'bundle' => 'file',
      'field' => 'field_attachment'
    ]
  ];

  /**
   * @param Request $req
   * @param int $id
   * @return JsonResponse
   */
  public static function fileUpload(Request $req, int $id): JsonResponse {
    try {
      $userId = $req->headers->get('user-id') ?? '';
      if(empty($userId)){
        throw new Exception('Missing user id in headers');
      }

      if (empty($id)) {
        throw new Exception("Missing node id");
      }

      $node = Node::load($id);
      if (empty($node)) {
        throw new Exception("Invalid node id");
      }

      $type = $req->get('type') ?? '';

      if (!is_array(self::FILE_TYPES[$type]) || ($type == 'cover' && $node->bundle() != 'board_item')) {
        throw new Exception('Invalid file type');
      }

      $mediaId = null;
      if (!empty($_FILES["data"]) && !empty($_FILES["data"]["tmp_name"]) && !empty($_FILES["data"]["name"])) {
        $fileContent = file_get_contents($_FILES["data"]["tmp_name"]);
        $mediaId = FileController::createMedia($fileContent, self::FILE_TYPES[$type]['bundle'], $_FILES["data"]["name"]);
      }

      $node->set(self::FILE_TYPES[$type]['field'], $mediaId);
      $node->setNewRevision(TRUE);
      $node->setRevisionCreationTime(\Drupal::time()->getCurrentTime());
      $node->setRevisionUserId(UserController::load($userId));
      $node->save();

      if($node->getOwnerId() != $userId){
        NotificationsController::sendNotification(
          $node, 
          $userId, 
          $node->getOwnerId(), 
          'board_update'
        );
      }

      return ResponseFormatterController::success([
        'item_id' => $id
      ]);
    } catch (Exception $ex) {
      return ResponseFormatterController::error($ex->getMessage(), $ex->getCode());
    }
  }
}
