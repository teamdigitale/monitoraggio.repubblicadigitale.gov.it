<?php

namespace Drupal\stats_tracking\Controller;

use Drupal;
use Drupal\Core\Database\Database;
use Drupal\Core\Database\StatementInterface;
use Drupal\user\Entity\User;
use Exception;

/**
 * Class BoardController
 * @package Drupal\core\Controller
 */
class ActionTracker
{
  /**
   * @param $userId
   * @param $userRole
   * @param $event
   * @param $programId
   * @return StatementInterface|int|string
   * @throws Exception
   */
  public static function trackChat($userId, $userRole, $event, $programId)
  {
    if (empty($event)) {
      throw new Exception('AT01: Empty event in chat track', 400);
    }

    $user = User::load($userId);
    if (empty($user)) {
      throw new Exception('AT03: Error in user load in chat track', 400);
    }

    $current_time = Drupal::time()->getCurrentTime();

    $db = Database::getConnection();

    $id = $db->insert('stats_chat')
      ->fields([
        'id_utente' => $user->getAccountName(),
        'evento' => strtolower($event ?? ''),
        'id_programma' => $programId,
        'timestamp_event_time' => $current_time,
        'codice_ruolo' => $userRole
      ])
      ->execute();

    if (empty($id)) {
      throw new Exception('AT04: Error in chat track insert', 400);
    }

    return $id;
  }

  /**
   * @param $userId
   * @param $userRole
   * @param $event
   * @param $programId
   * @return StatementInterface|int|string
   * @throws Exception
   */
  public static function trackWD($userId, $userRole, $event, $programId)
  {
    if (empty($event)) {
      throw new Exception('AT05: Empty event in workdocs track', 400);
    }

    $user = User::load($userId);
    if (empty($user)) {
      throw new Exception('AT07: Error in user load in workdocs track', 400);
    }

    $current_time = Drupal::time()->getCurrentTime();

    $db = Database::getConnection();

    $id = $db->insert('stats_workdocs')
      ->fields([
        'id_utente' => $user->getAccountName(),
        'evento' => strtolower($event ?? ''),
        'id_programma' => $programId,
        'timestamp_event_time' => $current_time,
        'codice_ruolo' => $userRole
      ])
      ->execute();

    if (empty($id)) {
      throw new Exception('AT08: Error in workdocs track insert', 400);
    }

    return $id;
  }

  /**
   * @param $userId
   * @param $userRole
   * @param $eventType
   * @param $event
   * @param $eventValue
   * @param $category
   * @param $programId
   * @return StatementInterface|int|string
   * @throws Exception
   */
  public static function trackTND($userId, $userRole, $eventType, $event, $eventValue, $category, $programId)
  {
    if (empty($userId)) {
      throw new Exception('AT09: Empty user id in topic news documents track', 400);
    }

    $user = User::load($userId);
    if (empty($user)) {
      throw new Exception('AT11: Error in user load in topic news documents track', 400);
    }

    $current_time = Drupal::time()->getCurrentTime();

    $db = Database::getConnection();

    $id = $db->insert('stats_topic_news_documents')
      ->fields([
        'tipologia_evento' => strtolower($eventType ?? ''),
        'id_utente' => $user->getAccountName(),
        'evento' => strtolower($event ?? ''),
        'valore_evento' => $eventValue,
        'id_programma' => $programId,
        'categoria' => $category,
        'timestamp_event_time' => $current_time,
        'codice_ruolo' => $userRole
      ])
      ->execute();

    if (empty($id)) {
      throw new Exception('AT12: Error in track topic news documents track insert', 400);
    }

    return $id;
  }
}


