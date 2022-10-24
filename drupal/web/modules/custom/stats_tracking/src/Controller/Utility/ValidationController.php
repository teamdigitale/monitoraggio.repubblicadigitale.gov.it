<?php

namespace Drupal\stats_tracking\Controller\Utility;

use Drupal\Core\Controller\ControllerBase;
use Exception;
use JsonSchema\Validator;

/**
 * Controller for request validation
 */
class ValidationController extends ControllerBase
{

  private const JSON_SCHEMA = [
    'chat' => [
      'type' => 'object',
      'properties' => [
        'role_code' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'event' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'program_id' => [
          'type' => ['string', 'null'],
          'required' => true
        ]
      ]
    ],
    'wd' => [
      'type' => 'object',
      'properties' => [
        'role_code' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'event' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'program_id' => [
          'type' => ['string', 'null'],
          'required' => true
        ]
      ]
    ],
    'tnd' => [
      'type' => 'object',
      'properties' => [
        'role_code' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'event_type' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'event' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'event_value' => [
          'type' => ['string', 'null'],
          'minLength' => 1,
          'required' => true
        ],
        'program_id' => [
          'type' => ['string', 'null'],
          'required' => true
        ],
        'category' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ]
  ];

  private const ALLOWED_EVENT_TYPE = ['topic', 'news', 'documenti'];
  private const ALLOWED_EVENT = [
    'chat' => ['click'],
    'wd' => ['click'],
    'tnd' => [
      'topic' => ['creazione', 'commento', 'visualizzazione', 'like'],
      'news' => ['creazione', 'commento', 'visualizzazione', 'like'],
      'documenti' => ['creazione', 'commento', 'visualizzazione-download', 'rating']
    ]
  ];
  private const ALLOWED_EVENT_VALUE = ['y', 'n', null];

  /**
   * @param $body
   * @param $bundle
   * @return bool
   * @throws Exception
   */
  public static function validateRequestBody($body, $bundle): bool
  {
    $validator = new Validator();

    $schema = self::JSON_SCHEMA[$bundle];

    $validator->validate($body, $schema);

    if (!$validator->isValid()) {
      throw new Exception('ATVC01: Invalid JSON body: ' . json_encode(array_map(function ($value) {
          return $value['message'];
        }, $validator->getErrors())));
    }

    $event_type = strtolower($body->event_type);
    $event = strtolower($body->event);
    $event_value = strtolower($body->event_value);

    if ($bundle == 'tnd') {
      if (!in_array($event_type, self::ALLOWED_EVENT_TYPE)) {
        throw new Exception('ATVC02: Invalid event type');
      }

      if (!in_array($event, self::ALLOWED_EVENT['tnd'][$event_type])) {
        throw new Exception('ATVC03: Invalid event for this event type');
      }

      if (
        ($event_type == 'documenti' && $event == 'rating' && !in_array($event_value, self::ALLOWED_EVENT_VALUE))
        ||
        ($event_type == 'documenti' && $event != 'rating' && !empty($event_value))
        ||
        ($event_type != 'documenti' && $event != 'rating' && !empty($event_value))
      ) {
        throw new Exception('ATVC04: Invalid event value');
      }
    } elseif (!in_array($event, self::ALLOWED_EVENT[$bundle])) {
      throw new Exception('ATVC05: Invalid event');
    }

    return true;
  }
}
