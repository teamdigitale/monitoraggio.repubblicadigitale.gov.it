<?php

namespace Drupal\rest_api\Controller\Utility;

use Drupal\Core\Controller\ControllerBase;
use Exception;

/**
 * Controller for request validation
 */
class ValidationController extends ControllerBase
{

  private const JSON_SCHEMA = [
    'board_item' => [
      'type' => 'object',
      'properties' => [
        'title' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'intervention' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'program' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'category' => [
          'type' => 'integer',
          'required' => true
        ],
        'description' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'enable_comments' => [
          'type' => 'boolean',
          'required' => true
        ],
        'highlighted' => [
          'type' => 'boolean',
          'required' => true
        ]

      ]
    ],
    'community_item' =>  [
      'type' => 'object',
      'properties' => [
        'title' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'category' => [
          'type' => 'integer',
          'required' => true
        ],
        'description' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'tags' => [
          'type' => 'array',
          'required' => true
        ]
      ]
    ],
    'document_item' => [
      'type' => 'object',
      'properties' => [
        'title' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'intervention' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'program' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'category' => [
          'type' => 'integer',
          'required' => true
        ],
        'external_link' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'category_create' => [
      'type' => 'object',
      'properties' => [
        'term_name' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ],
        'term_type' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'category_update' => [
      'type' => 'object',
      'properties' => [
        'term_name' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'comment_create' => [
      'type' => 'object',
      'properties' => [
        'comment_body' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'comment_update' => [
      'type' => 'object',
      'properties' => [
        'comment_body' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'item_delete' => [
      'type' => 'object',
      'properties' => [
        'reason' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ],
    'report_create' => [
      'type' => 'object',
      'properties' => [
        'reason' => [
          'type' => 'string',
          'minLength' => 1,
          'required' => true
        ]
      ]
    ]
  ];


  /**
   * @param $body
   * @param $bundle
   * @return bool
   * @throws Exception
   */
  /**
   */
  public static function validateRequestBody($body, $bundle): bool
  {
    $validator = new \JsonSchema\Validator();

    $schema = self::JSON_SCHEMA[$bundle];

    $validator->validate($body, $schema);

    if (!$validator->isvalid()) {
      throw new Exception('Invalid JSON body');
    }

    return $validator->isvalid();
  }
}
