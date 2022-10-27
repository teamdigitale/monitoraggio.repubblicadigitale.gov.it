<?php

namespace Drupal\core\Controller;

use Drupal;
use Drupal\Core\Entity\EntityStorageException;
use Drupal\core\Utility\EnvController;
use Drupal\media\Entity\Media;
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

  /**
   * @param $userId
   * @param $node
   * @param $type
   * @param $tmpName
   * @param $name
   * @return void
   * @throws EntityStorageException
   */
  public static function setMedia($userId, $node, $type, $tmpName, $name)
  {
    $mediaId = null;
    if (!empty($tmpName) && !empty($name)) {
      $fileContent = file_get_contents($tmpName);
      $mediaId = self::createMedia($fileContent, self::FILE_TYPES[$type]['bundle'], $name);
    }

    $node->set(self::FILE_TYPES[$type]['field'], $mediaId);
    $node->setNewRevision();
    $node->setRevisionCreationTime(Drupal::time()->getCurrentTime());
    $node->setRevisionUserId($userId);
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
      throw new Exception('FC03: Not allowed file type to create media', 400);
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
      throw new Exception('FC04: Error in media node creation', 400);
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
      throw new Exception('FC05: Invalid file extension.', 400);
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
      throw new Exception('FC06: Invalid file extension.', 400);
    }

    return [
      'filename' => $fileName,
      'field' => 'field_media_document'
    ];
  }
}
