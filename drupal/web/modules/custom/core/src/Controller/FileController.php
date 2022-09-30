<?php

namespace Drupal\core\Controller;

use Drupal\Core\Entity\EntityStorageException;
use Drupal\media\Entity\Media;
use Drupal\core\Utility\EnvController;
use Exception;

/**
 * Controller for file handling
 */
class FileController {
  /**
   * @param $fileContent
   * @param $fileType
   * @param $fileName
   * @return mixed
   * @throws EntityStorageException
   * @throws Exception
   */
  public static function createMedia($fileContent, $fileType, $fileName): mixed {
    if (!in_array($fileType, EnvController::getValues('ALLOWED_FILE_TYPE'))) {
      throw new Exception('Not allowed file type to create media');
    }

    $date = date("Y-m") . "/";

    $path = 'private://' . $date;
    if (!is_dir($path)) {
      mkdir($path);
    }

    $mediaInfo = match ($fileType) {
      'image' => self::createImageInfo($fileName),
      'file' => self::createFileInfo($fileName),
      default => [],
    };

    $file = \Drupal::service('file.repository')->writeData($fileContent, $path . $mediaInfo['filename']);

    if ($fileType === 'file') {
      return $file->id();
    }

    $media = Media::create([
      'bundle' => $fileType,
      'uid' => \Drupal::currentUser()->id(),
      'name' => $fileName,
      'status' => 0,
      $mediaInfo['field'] => [
        'target_id' => $file->id(),
        'alt' => $fileName,
      ]
    ]);

    if (!$media->save()) {
      throw new Exception('Error in media node creation');
    }

    return $media->id();
  }

  /**
   * @param $fileName
   * @return string[]
   * @throws Exception
   */
  private static function createImageInfo($fileName) {
    $fileExtension = pathinfo($fileName)['extension'];
    if (!in_array($fileExtension, EnvController::getValues('IMAGE_ALLOWED_EXTENSIONS'))) {
      throw new Exception('Invalid file extension.', 400);
    }

    return [
      'filename' => (int)(microtime(true) * 1000000) . '_' . $fileName,
      'field' => 'field_media_image'
    ];
  }

  /**
   * @param $fileName
   * @return string[]
   * @throws Exception
   */
  private static function createFileInfo($fileName) {
    $fileExtension = pathinfo($fileName)['extension'];
    if (!in_array($fileExtension, EnvController::getValues('FILE_ALLOWED_EXTENSIONS'))) {
      throw new Exception('Invalid file extension.', 400);
    }

    return [
      'filename' => (int)(microtime(true) * 1000000) . '_' . $fileName,
      'field' => 'field_media_attachment'
    ];
  }
}
