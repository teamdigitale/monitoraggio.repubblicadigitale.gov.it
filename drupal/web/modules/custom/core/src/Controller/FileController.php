<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\media\Entity\Media;
use Drupal\node\Entity\Node;
use Drupal\notifications\Controller\NotificationsController;
use Exception;

/**
 * Controller for file handling
 */
class FileController
{
  private const FILE_TYPES = [
    'cover' => [
      'bundle' => 'image',
      'field' => 'field_cover'
    ],
    'attachment' => [
      'bundle' => 'document',
      'field' => 'field_attachment'
    ]
  ];

  public static function setMedia($userId, $userRoles, $nodeId, $type, $tmpName, $name)
  {
    $node = Node::load($nodeId);
    if (empty($node)) {
      throw new Exception('FC01: Invalid node id');
    }

    if ($node->bundle() !== 'board_item' && $type === 'cover') {
      throw new Exception('FC07: Invalid media type for item');
    }

    if ($node->getOwnerId() != $userId) {
      $allowedRoles = ((array)EnvController::getValues('ALLOWED_METHOD_ROLES'))['file_upload_any'];
      if (!UserController::checkAuthRoles($userRoles, $allowedRoles)) {
        throw new Exception('FC02: Unauthorized to modify this item');
      }
    }

    $mediaId = null;
    if (!empty($tmpName) && !empty($name)) {
      $fileContent = file_get_contents($tmpName);
      $mediaId = self::createMedia($fileContent, self::FILE_TYPES[$type]['bundle'], $name);
    }

    $node->set(self::FILE_TYPES[$type]['field'], $mediaId);
    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId(UserController::load($userId));
    $node->save();

    if ($node->getOwnerId() != $userId) {
      NotificationsController::sendNotification(
        $node,
        $userId,
        $node->getOwnerId(),
        str_replace('item', 'update', $node->bundle())
      );
    }
  }

  /**
   * @param $fileContent
   * @param $fileType
   * @param $fileName
   * @return mixed
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function createMedia($fileContent, $fileType, $fileName): mixed
  {
    if (!in_array($fileType, (array)EnvController::getValues('ALLOWED_FILE_TYPE'))) {
      throw new Exception('FC03: Not allowed file type to create media');
    }

    $date = date('Y-m') . '/';

    $path = 'public://' . $date;
    if (!is_dir($path)) {
      mkdir($path);
    }

    $fileExtension = pathinfo($fileName)['extension'];
    $fileName = (int)(microtime(true)) . rand(1111111111, 9999999999) . '.' . $fileExtension;

    $mediaInfo = match ($fileType) {
      'image' => self::createImageInfo($fileName),
      'document' => self::createFileInfo($fileName),
      default => [],
    };

    $file = Drupal::service('file.repository')->writeData($fileContent, $path . $mediaInfo['filename']);

    $media = Media::create([
      'bundle' => $fileType,
      'uid' => Drupal::currentUser()->id(),
      'name' => $fileName,
      'status' => 1,
      $mediaInfo['field'] => [
        'target_id' => $file->id(),
        'alt' => $fileName,
      ]
    ]);

    if (!$media->save()) {
      throw new Exception('FC04: Error in media node creation');
    }

    return $media->id();
  }

  /**
   * @param $fileName
   * @return string[]
   * @throws Exception
   */
  private static function createImageInfo($fileName): array
  {
    $fileExtension = pathinfo($fileName)['extension'];
    if (!in_array($fileExtension, (array)EnvController::getValues('IMAGE_ALLOWED_EXTENSIONS'))) {
      throw new Exception('FC05: Invalid file extension.');
    }

    return [
      'filename' => $fileName,
      'field' => 'field_media_image'
    ];
  }

  /**
   * @param $fileName
   * @return string[]
   * @throws Exception
   */
  private static function createFileInfo($fileName): array
  {
    $fileExtension = pathinfo($fileName)['extension'];
    if (!in_array($fileExtension, (array)EnvController::getValues('FILE_ALLOWED_EXTENSIONS'))) {
      throw new Exception('FC06: Invalid file extension.');
    }

    return [
      'filename' => $fileName,
      'field' => 'field_media_document'
    ];
  }
}
